/**
 * ITAuditVault — server
 * ------------------------------------------------------------------
 * Serves the front end and exposes:
 *   GET  /api/health          → { live, model, refs }
 *   POST /api/extract         → { text }   (pull text out of an uploaded pdf/docx/txt)
 *   POST /api/generate        → { ok, markdown, format, summary }  (audit artifact + completion status)
 *   GET  /api/skills          → { skills: [...] }  (browse the IT Audit skill library)
 *   GET  /api/skills/:name    → { name, title, markdown }
 *   POST /api/skills/improve  → SSE stream of { text }  (self-generate/improve a reference
 *                               grounded in publicly available resources via web search)
 *   POST /api/skills/save     → { ok, name, refs }  (persist an approved reference)
 *
 * The IT Audit skill lives in ./.claude/skills/it-auditor/ — the SAME skill Claude Code
 * loads for this repo. Its reference files are read at startup and injected into the
 * system prompt so Claude answers with real control references, test procedures, and
 * terminology. The Skill Studio can research public sources and write new/updated
 * references back into that directory, so the skill improves itself over time.
 */
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { marked } from 'marked';
import ExcelJS from 'exceljs';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType,
} from 'docx';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SKILL_DIR = path.join(ROOT, '.claude', 'skills', 'it-auditor');
const REF_DIR = path.join(SKILL_DIR, 'references');
const PORT = process.env.PORT || 3000;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
const API_KEY = process.env.ANTHROPIC_API_KEY;

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(ROOT, 'public')));
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

const client = API_KEY ? new Anthropic({ apiKey: API_KEY }) : null;

/* ==================================================================
   0. Authentication, authorization, and rate limiting
   ------------------------------------------------------------------
   - AUTH_PASSWORD gates all generation / skill APIs behind a login.
   - ADMIN_PASSWORD (optional) reserves Skill Studio writes for admins.
   - SKILL_WRITE controls whether the skill can be modified at all.
   - express-rate-limit caps the expensive endpoints per IP.
   Sessions are signed HMAC cookies — no extra dependency, no server state.
   ================================================================== */
const AUTH_PASSWORD  = process.env.AUTH_PASSWORD || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const AUTH_REQUIRED  = !!AUTH_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
/* Skill writes: allowed by default only when auth is configured (safe-by-default).
   In open mode they stay OFF unless SKILL_WRITE=true is set explicitly. */
const SKILL_WRITE = process.env.SKILL_WRITE
  ? /^(1|true|yes|on)$/i.test(process.env.SKILL_WRITE)
  : AUTH_REQUIRED;
const TRUST_PROXY = process.env.TRUST_PROXY || '';
if (TRUST_PROXY) {
  const n = Number(TRUST_PROXY);
  app.set('trust proxy', /^(1|true)$/i.test(TRUST_PROXY) ? true : (Number.isNaN(n) ? TRUST_PROXY : n));
}
const COOKIE = 'itav_session';

const b64url = buf => Buffer.from(buf).toString('base64url');
const sign = data => crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
function makeToken(role) {
  const payload = b64url(JSON.stringify({ role, exp: Date.now() + SESSION_TTL_MS }));
  return `${payload}.${sign(payload)}`;
}
function verifyToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, mac] = token.split('.');
  const expect = sign(payload);
  if (!mac || mac.length !== expect.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expect))) return null;
  try {
    const obj = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!obj.exp || obj.exp < Date.now()) return null;
    return obj;
  } catch { return null; }
}
function parseCookies(req) {
  const out = {};
  const h = req.headers.cookie;
  if (!h) return out;
  for (const part of h.split(';')) {
    const i = part.indexOf('=');
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function pwEqual(a, b) {
  const ba = Buffer.from(String(a)), bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}
function cookieHeader(req, token, maxAgeSec) {
  const https = req.secure || req.headers['x-forwarded-proto'] === 'https';
  return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAgeSec}${https ? '; Secure' : ''}`;
}

/* Resolve the caller's role on every request.
   Open mode (no AUTH_PASSWORD): callers are treated as admin only when writes
   are enabled, else as read/generate users. Auth mode: role comes from the cookie. */
app.use((req, _res, next) => {
  if (!AUTH_REQUIRED) {
    req.authed = true;
    req.role = SKILL_WRITE ? 'admin' : 'user';
  } else {
    const tok = verifyToken(parseCookies(req)[COOKIE]);
    req.authed = !!tok;
    req.role = tok ? tok.role : null;
  }
  next();
});

function capabilities(req) {
  const canWrite = SKILL_WRITE && req.role === 'admin';
  return {
    live: !!client,
    model: client ? MODEL : null,
    refs: Object.keys(SKILL.refs).length,
    authRequired: AUTH_REQUIRED,
    authed: AUTH_REQUIRED ? req.authed : true,
    role: req.role,
    canWrite,
    skillWriteEnabled: SKILL_WRITE,
  };
}

function requireAuth(req, res, next) {
  if (!AUTH_REQUIRED || req.authed) return next();
  res.status(401).json({ error: 'Sign in to continue.' });
}
function requireWrite(req, res, next) {
  if (!SKILL_WRITE) return res.status(403).json({ error: 'Skill Studio is read-only on this server.' });
  if (AUTH_REQUIRED && !req.authed) return res.status(401).json({ error: 'Sign in to continue.' });
  if (req.role === 'admin') return next();
  res.status(403).json({
    error: AUTH_REQUIRED
      ? 'Admin access is required to change the skill library.'
      : 'Skill writing is disabled. Set SKILL_WRITE=true (and preferably AUTH_PASSWORD) to enable it.',
  });
}

const mkLimiter = (max, msg) => rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(max) > 0 ? Number(max) : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: msg },
});
const generateLimiter = mkLimiter(process.env.RATE_LIMIT_GENERATE || 30, 'Rate limit reached. Please wait a few minutes and try again.');
const improveLimiter  = mkLimiter(process.env.RATE_LIMIT_IMPROVE  || 10, 'Skill Studio research rate limit reached. Please wait a few minutes.');
const loginLimiter    = mkLimiter(process.env.RATE_LIMIT_LOGIN    || 10, 'Too many sign-in attempts. Please wait a few minutes.');

/* Cumulative token usage this process, for the "watch your usage" cost guidance. */
const USAGE = { in: 0, out: 0, calls: 0 };

/* ==================================================================
   1. Load the IT Audit skill (re-loadable — Skill Studio writes to it)
   ================================================================== */
const SKILL = { refs: {}, core: '' };

function loadSkill() {
  const refs = {};
  if (fs.existsSync(REF_DIR)) {
    for (const f of fs.readdirSync(REF_DIR)) {
      if (f.endsWith('.md')) refs[f.replace(/\.md$/, '')] = fs.readFileSync(path.join(REF_DIR, f), 'utf8');
    }
  } else {
    console.warn(`⚠  No skill references found at ${REF_DIR}. Output will be generic.`);
  }
  const skillMd = path.join(SKILL_DIR, 'SKILL.md');
  SKILL.refs = refs;
  SKILL.core = fs.existsSync(skillMd) ? fs.readFileSync(skillMd, 'utf8') : '';
  console.log(`✓ Loaded IT Audit skill: ${Object.keys(refs).length} reference files`);
  return SKILL;
}
loadSkill();

/* Human-friendly title + one-line summary for each reference (for the Skill Studio browser). */
function refTitle(md, name) {
  const h1 = md.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function refSummary(md) {
  // first non-empty, non-heading paragraph
  const lines = md.split('\n');
  const buf = [];
  for (const l of lines) {
    const t = l.trim();
    if (!t || t.startsWith('#') || t.startsWith('---') || t.startsWith('|')) {
      if (buf.length) break;
      continue;
    }
    buf.push(t);
    if (buf.join(' ').length > 220) break;
  }
  return buf.join(' ').replace(/\*\*/g, '').slice(0, 260);
}

/* Which references each artifact always needs. */
const BASE_REFS = {
  announcement: ['audit-lifecycle', 'engagement-documents'],
  planning:     ['audit-lifecycle', 'engagement-documents', 'deliverable-templates'],
  rfi:          ['audit-lifecycle', 'engagement-documents'],
  observation:  ['audit-lifecycle', 'engagement-documents', 'deliverable-templates'],
  report:       ['audit-lifecycle', 'engagement-documents', 'deliverable-templates'],
  rcm:          ['audit-lifecycle', 'itgc', 'deliverable-templates'],
  program:      ['audit-lifecycle', 'itgc', 'deliverable-templates', 'itac-and-ipe'],
  walkthrough:  ['audit-lifecycle', 'itgc', 'itac-and-ipe'],
  gap:          ['audit-lifecycle', 'deliverable-templates', 'gap-assessment', 'frameworks'],
  interview:    ['interview-prep', 'audit-lifecycle', 'itgc', 'itac-and-ipe'],
  resume:       ['interview-prep', 'audit-lifecycle'],
  tpra:         ['audit-lifecycle', 'third-party-risk-audit', 'itac-and-ipe', 'frameworks'],
  training:     ['training', 'audit-lifecycle'],
};

/* Keyword → reference routing. Mirrors the skill's own routing table. */
const ROUTES = [
  [/\bsap\b|s\/4|hana|abap/i,                         'sap-audit'],
  [/oracle\s*(ebs|e-business|erp|fusion|cloud)/i,     'oracle-erp-audit'],
  [/active directory|windows|domain controller|group policy/i, 'active-directory-audit'],
  [/\bAD\b/,                                          'active-directory-audit'],
  [/mainframe|z\/os|racf|acf2|top secret/i,            'mainframe-audit'],
  [/pci|cardholder|\bcde\b|card data/i,               'pci-dss-audit'],
  [/cmmc|800-171|800-172|\bcui\b|\bfci\b|dib\b/i,      'cmmc-audit'],
  [/fedramp|800-53|\b20x\b|\bksi\b|oscal/i,           'fedramp-audit'],
  [/\bai\b|artificial intelligence|\bllm\b|iso[\s/]*42001|ai rmf|eu ai act|machine learning/i, 'ai-audit'],
  [/aws|azure|\bgcp\b|cloud|vmware|virtualiz/i,        'cloud-and-emerging'],
  [/siem|splunk|log management|security monitoring/i,  'siem-and-logging-audit'],
  [/database|oracle db|sql server|linux|unix|firewall|network|operating system/i, 'infrastructure-audit'],
  [/sdlc|secure development|\bsdl\b|threat model|sast|dast/i, 'secure-development-sdl'],
  [/implementation|go-live|erp rollout|cutover/i,      'software-implementation-audit'],
  [/nist csf|cybersecurity framework|identify.*protect.*detect/i, 'nist-csf-audit'],
  [/disaster recovery|\bdr\b|backup|physical security|third[- ]party|vendor risk|tprm|hipaa/i, 'sdlc-dr-physical-tprm'],
  [/soc\s*[12]|trust services|\btsc\b|ipe|application control|\bitac\b/i, 'itac-and-ipe'],
  [/sox|itgc|icfr|general control/i,                   'itgc'],
  [/cobit|iso\s*27001|hitrust|framework|standard/i,    'frameworks'],
  [/gap assessment|readiness|control mapping|crosswalk|maturity assessment|current[- ]state|target[- ]state/i, 'gap-assessment'],
  [/third[- ]party|vendor|supplier|service provider|tprm|supply chain|\bcsa\b|\bccm\b|caiq|\bstar\b|\bvsa\b|\bsig\b|shared assessments|27036|800-161/i, 'third-party-risk-audit'],
];

/* Certification-domain routing for training. Certification-study requests often name an exam
   domain rather than a platform (e.g. "CISA Domain 4: IS Operations and Business Resilience"),
   which the platform ROUTES above would never match — so the references those domains actually
   need (infrastructure, SIEM, DR, ITGC, …) would be absent from the prompt. This mirrors the
   certification mapping in training.md and is applied only to the training artifact. */
const CERT_ROUTES = [
  [/cisa[^.]*(domain\s*1\b|auditing process)|information systems auditing process/i,
    ['audit-lifecycle', 'deliverable-templates', 'engagement-documents', 'itac-and-ipe']],
  [/cisa[^.]*(domain\s*2\b|governance)|governance (and|&|and management) of it/i,
    ['frameworks', 'nist-csf-audit', 'software-implementation-audit', 'sdlc-dr-physical-tprm']],
  [/cisa[^.]*(domain\s*3\b|acquisition)|acquisition, development|development (and|&) implementation/i,
    ['software-implementation-audit', 'secure-development-sdl', 'sdlc-dr-physical-tprm']],
  [/cisa[^.]*(domain\s*4\b)|is operations|business resilience|operations (and|&) business resilience/i,
    ['infrastructure-audit', 'siem-and-logging-audit', 'sdlc-dr-physical-tprm', 'itgc']],
  [/cisa[^.]*(domain\s*5\b)|protection of information assets/i,
    ['itgc', 'infrastructure-audit', 'active-directory-audit', 'pci-dss-audit', 'siem-and-logging-audit', 'cloud-and-emerging']],
  [/\bcrisc\b/i, ['audit-lifecycle', 'gap-assessment', 'third-party-risk-audit', 'frameworks']],
  [/\bcism\b/i,  ['frameworks', 'siem-and-logging-audit', 'secure-development-sdl']],
  [/\bcia\b(?![a-z])/i, ['audit-lifecycle', 'engagement-documents']],
];

/* Fields that belong only to the training artifact. The client posts the whole global form
   state on every generation, so a training topic/level/duration entered earlier would otherwise
   leak into an RCM/report/RFI prompt (and its reference routing) even though the field is hidden.
   Strip them for every other artifact. */
const TRAINING_ONLY = ['topic', 'level', 'duration'];
function scrubInputs(artifact, inputs) {
  if (artifact === 'training' || !inputs) return inputs || {};
  const out = { ...inputs };
  for (const k of TRAINING_ONLY) delete out[k];
  return out;
}

function pickRefs(artifact, inputs) {
  const picked = new Set(BASE_REFS[artifact] || ['audit-lifecycle']);
  const hay = [inputs.platform, inputs.framework, inputs.scope, inputs.domains, inputs.notes, inputs.jd,
    inputs.applications, inputs.os, inputs.database, inputs.vendor, inputs.topic, inputs.level]
    .filter(Boolean).join(' \n ');
  for (const [re, ref] of ROUTES) if (re.test(hay)) picked.add(ref);
  if (artifact === 'training') {
    for (const [re, refs] of CERT_ROUTES) if (re.test(hay)) for (const r of refs) picked.add(r);
  }
  // Training modules may legitimately need more domain references than a single workpaper.
  const cap = artifact === 'training' ? 8 : 6;
  return [...picked].filter(r => SKILL.refs[r]).slice(0, cap);
}

/* ==================================================================
   2. Prompt construction — audit artifacts
   ================================================================== */
const HOUSE_STYLE = `
HOUSE STYLE (non-negotiable)
- Board- and external-auditor-grade tone: precise, objective, no hedging, no marketing language.
- Use standard audit vocabulary exactly: control objective, control activity, test of design (TOD),
  test of operating effectiveness (TOE), IPE, PBC, period of intended reliance, population, sample,
  exception, observation, deficiency, remediation, action plan, control owner, residual risk.
- Ground every substantive claim in the reference material supplied. Use REAL control references,
  commands, parameters, and test procedures from it. Never invent a control reference.
- Findings use the five-attribute structure: Condition, Criterion, Cause, Effect/Risk, Recommendation.
- Rate findings High / Medium / Low; pair each with a recommendation and a management action plan
  placeholder (owner + target date).
- Never leave "[insert here]". Where a value is genuinely unknown, use a clearly-labelled realistic
  placeholder such as MM/DD/YY or [Control Owner].
- Output GitHub-flavoured Markdown. Use tables for anything tabular (RCM, RFI, gap matrices).
- Do not add commentary before or after the artifact. Output the artifact only.
`.trim();

const TASKS = {
  announcement: `Produce an AUDIT ANNOUNCEMENT / COMMENCEMENT MEMO. Follow the template in
engagement-documents.md §1: a To/From/Date/Re block, then numbered sections — Purpose, Objective,
Scope, Approach, Audit Team & Contacts, Indicative Timeline, What We Need From You. Keep it to about
one page. Courteous and collaborative in tone.`,

  planning: `Produce an AUDIT PLANNING DOCUMENT / MEMO. Follow engagement-documents.md §2: header block
(title, ref, prepared by, reviewed/approved), then: 1 Background & Context, 2 Audit Objective,
3 Scope (with explicit exclusions), 4 Risk Assessment (a markdown table of Key Risk | Inherent Rating |
Relevant Control Objective(s)), 5 Planned Approach & Control Areas to be Tested, 6 Materiality /
Sampling Approach, 7 Team Roles & Budget, 8 Timeline & Milestones (table), 9 Logistics, 10 Deliverables.
Every planned test must trace to a risk.`,

  rfi: `Produce a REQUEST FOR INFORMATION (RFI / PBC list). Start with the short preamble from
engagement-documents.md §3 (system-generated evidence preferred; note how completeness and accuracy
can be confirmed). Then a markdown table with columns:
# | Information / Evidence Requested | System | Period | Format | Control Ref | Owner / Contact | Date Needed By | Status.
Produce 20-30 rows, grouped logically by control domain, specific to the systems in scope. Each row must
be specific about the system, the report/query, and the period.`,

  observation: `Produce an AUDIT OBSERVATION MEMO. Follow engagement-documents.md §4: a To/From/Date/Re
block, a short purpose paragraph, a summary table of observations (# | Title | Rating | Control Ref),
then each observation in full: Title, Rating, Control Reference, then Condition, Criterion, Cause,
Effect/Risk, Recommendation, followed by blank Management Response / Action Plan / Owner / Target Date
fields for the auditee to complete. Condition must be factual and non-accusatory and quantify the
exception (x of n). Criterion must cite the most specific applicable standard.`,

  report: `Produce an AUDIT REPORT. Follow engagement-documents.md §5: header (title, ref, date,
distribution), Covering Memo, 1 Executive Summary (overall opinion + a summary table of observations),
2 Background & Objective, 3 Scope & Approach, 4 Detailed Findings (each in full Condition / Criterion /
Cause / Effect / Recommendation form with rating and management action plan), 5 Conclusion, then
Appendices (rating & opinion definitions). Nothing in the report should be a surprise: findings mirror
the observation memo.`,

  rcm: `Produce a RISK & CONTROL MATRIX. Start with a short header block (Audit, Framework, Systems,
Audit Period, Sample Period). Then a markdown table with columns:
Ctrl Ref | Control Domain | Control Objective | Key Risk Addressed | Framework Ref | Control Activity |
Type (P/D) | Nature (M/A) | Risk (H/M/L) | Conclusion on Operating Effectiveness | Exception Details.
Group rows under domain sub-headings. Produce 20-30 control activities. Map each to the named framework
(e.g., SOC 2 TSC like CC6.1, PCI requirement numbers, NIST control IDs, or ITGC refs like IT5.04).
Default "Conclusion" to "TBD – Control has not been tested".`,

  program: `Produce a DETAILED AUDIT PROGRAM. For each control: a line giving the Control Objective and
the Risk, then the control ref, control activity, framework ref, risk rating, and the testing procedures
written as a numbered sequence following the pattern in itgc.md:
  1. Interview — who to interview and what to inquire about.
  2. Test of Control — the concrete procedures, including obtaining a SYSTEM-GENERATED population and
     IPE-testing it, the specific commands/queries/navigation for the named platform, and the sampling.
  3. Conclusion — conclude on design and operating effectiveness; describe what constitutes an exception.
Also state the Evidence / IPE required. Cover 15-25 controls. Be platform-specific: use the real
commands, tables, transaction codes, or console paths from the reference material.`,

  walkthrough: `Produce a WALKTHROUGH / TEST OF DESIGN workpaper. For each in-scope control area:
the risk, the control objective, a narrative of how the control operates end-to-end (as gathered by
inquiry, inspection, observation, and reperformance), the specific evidence inspected, and a design
conclusion (Design Effective / Design Deficient) with rationale. Note where design deficiencies mean
operating effectiveness cannot be relied upon.`,

  gap: `Produce a COMPLIANCE GAP ASSESSMENT against the named framework/standard, in TWO parts, per
gap-assessment.md. The FRAMEWORK is the anchor; the platform, applications, operating system, and
database (when given) sharpen the questions and control references — do not require them.
Begin with a short SCOPING section: the assessment boundary (the systems in scope where given), the
target framework and — if it has levels/baselines — the target level, and explicit exclusions with
reasons.

PART 1 — ASSESSMENT QUESTIONNAIRE. A markdown table of assessment questions derived from the framework's
own requirement structure (e.g., PCI's 12 requirements, the NIST 800-171 families, SOC 2 TSC, ISO 27002
themes, CSF functions/categories). Columns:
# | Domain / Requirement Ref | Assessment Question | What Good Looks Like | Evidence to Request | Response (Yes/No/Partial/N/A) | Notes.
Produce 25-40 questions grouped by domain, made specific to the named platform/applications/OS/database
where relevant.

PART 2 — CONTROL / GAP MATRIX. A markdown table using the gap-assessment.md columns:
Requirement Ref | Requirement / Control Objective | In-Scope Process/System | Current Control(s) | Status (Met/Partially Met/Not Met/N/A) | Maturity (Current->Target) | Evidence Reviewed | Gap Description | Risk (H/M/L) | Remediation | Priority | Owner | Target Date.
Map each row to the framework's specific requirement IDs; use the multi-framework crosswalk in
gap-assessment.md to note equivalent references where useful. Default Status to "Not Met - to be
validated" and Owner/Target Date to placeholders.

Finish with a short REMEDIATION ROADMAP grouped by priority. Cover the framework's actual requirement
structure; be specific to the systems in scope.`,

  tpra: `Produce a THIRD-PARTY / VENDOR RISK ASSESSMENT for the named vendor/service against the chosen
framework, in TWO parts, per third-party-risk-audit.md. Begin with a SCOPING section: the vendor/service
and what data/process it supports, an INHERENT-RISK TIER (Critical/High/Medium/Low) with rationale, and
the assessment basis (CSA CAIQ/CCM, Vendor Security Alliance VSAQ, Shared Assessments SIG, SOC 2
reliance, ISO 27001/27036, NIST 800-161).

PART 1 — VENDOR SECURITY ASSESSMENT QUESTIONNAIRE grounded in CSA CAIQ / VSA / SIG and mapped to the
chosen framework. Columns:
# | Domain (CCM domain) | Assessment Question | Framework Ref | Evidence to Request | Response (Yes/No/Partial/N/A) | Notes.
Produce 25-40 questions across the vendor-risk domains (governance; identity & access incl. privileged/
MFA; data protection & encryption/key management; secure SDLC & change; vulnerability & patch mgmt &
pentest; logging, monitoring & detection; incident response & breach notification; BC/DR; subservice/
fourth-party & concentration; physical; HR & awareness; compliance & certifications).

PART 2 — VENDOR RISK & CONTROL MATRIX. Columns:
Ctrl Ref | Control Domain | Control Objective | Key Risk Addressed | Framework Ref (CCM/ISO/SOC 2/NIST) | Expected Control Activity | Questionnaire Ref | Type (P/D) | Nature (M/A) | Risk (H/M/L) | Conclusion | Evidence / IPE.
Use the TPR1-TPR9 control scheme from third-party-risk-audit.md; cover 15-25 controls grouped by domain;
default Conclusion to "TBD - not yet validated".

Finish with residual-risk commentary and recommended ongoing monitoring (SOC 2 refresh + bridge letter,
reassessment cadence by tier, CSA STAR/registry checks). Ground the questions and control language in
third-party-risk-audit.md; do not invent certification names.`,

  interview: `Produce an IT AUDIT INTERVIEW PREP PACK from the job description (and resume if given),
per interview-prep.md. Structure:
1. Profile & Strategy — detected role level/type, domains and frameworks the JD emphasizes, strengths to
   lead with (from the resume), and gaps to prepare for.
2. Then questions grouped by category: Introductory/Fit; Audit Methodology; Technical/Domain-Specific
   (the bulk — 2-4 questions for each domain the JD names, using that domain's real specifics);
   Frameworks & Standards; Behavioral/Situational (STAR); Scenario/Case; Certification-linked.
For each question give a concise model answer that could be spoken in 60-90 seconds, and for the
important ones a one-line "What good looks like".
3. Close with Questions to Ask the Interviewer and Prep Tips.
NEVER fabricate the candidate's experience or certifications. Where a personal specific is needed and
the resume does not supply it, use a bracketed placeholder and coach what to insert.`,

  training: `Produce a DETAILED IT AUDIT TRAINING MODULE on the requested topic, in a typical IT-audit
training style, per training.md. Ground it in the domain reference material supplied — use REAL control
references, commands, parameters, transaction codes, console paths, and framework requirement IDs, and
explain the WHY (risk and control objective), not just the what. Adapt depth to the audience level if
given (Foundational / Intermediate / Advanced / Exam prep) and to the duration.
Structure (use the training.md module template):
1. Module header — title, audience level, estimated duration, prerequisites, and the skill area it covers.
2. Learning objectives — 4-8 measurable outcomes ("By the end, the participant can ...").
3. Why it matters — the risk and business/ICFR context.
4. Key concepts & terminology — precise definitions with the real specifics from the references.
5. Deep dive — risk -> control objective -> control activity (type/nature/risk) -> test procedures in the
   Interview -> Test of Control (TOD/TOE) -> Conclusion pattern, with the platform/framework specifics.
6. Worked example / walkthrough — a realistic end-to-end scenario (obtain population, IPE-test, sample,
   test, document the exception, conclude).
7. Common pitfalls & exam/interview traps.
8. Exercise / case study — 2-3 hands-on tasks or a mini-case with a defined deliverable.
9. Knowledge check — 5-8 questions (mix of MCQ and short answer) WITH an answer key and a one-line
   rationale each.
10. Summary & further study — key takeaways, which skill reference(s) to study next, and the CISA/CISM
    domain(s) it maps to.
If the topic is broad (e.g., "the audit lifecycle" or "PCI DSS for auditors"), cover it as a coherent
module at the right altitude; if narrow (e.g., "testing terminated-user access on Active Directory"),
go deep with the specific procedure.`,

  resume: `Produce an IT AUDIT RESUME / CV targeted at the supplied job description, built ONLY from the
candidate's real background as supplied. Structure: header (name/contact placeholders if unknown), a
3-4 line Professional Summary tuned to the JD, Certifications, Core Competencies (a compact keyword
block mirroring the JD's language where truthful), Professional Experience (reverse-chronological;
each role with 4-6 achievement bullets in the form "Action verb + what + how + measurable result",
using real audit vocabulary — ITGC domains, TOD/TOE, IPE, RCM, populations and sample sizes), Education,
and Tools & Technologies.
Do NOT invent employers, dates, certifications, or results. Where the candidate's input is thin, write
the bullet with a bracketed placeholder for the metric, e.g. "[x of n samples]". After the resume,
add a short "Tailoring notes" section listing JD keywords covered and the gaps the candidate should
address.`,
};

function buildSystem(artifact, inputs) {
  const refNames = pickRefs(artifact, inputs);
  const refBlocks = refNames
    .map(n => `<reference name="${n}">\n${SKILL.refs[n]}\n</reference>`)
    .join('\n\n');

  return `You are an experienced IT Auditor / IT Assurance professional producing a client-ready work
product. You have deep expertise across ITGC, SOX, application controls, and platform-specific auditing.

${HOUSE_STYLE}

You have been given authoritative reference material from an IT audit knowledge base. It is the source
of truth for control references, test procedures, commands, and terminology. Use it. Do not contradict
it, and do not invent control identifiers that do not appear in it or in the named framework.

<reference_material>
${refBlocks}
</reference_material>

TASK
${TASKS[artifact] || 'Produce the requested audit artifact to workpaper standard.'}`;
}

function buildUser(artifact, artifactName, inputs) {
  const L = (k, label) => (inputs[k] && String(inputs[k]).trim())
    ? `${label}:\n${String(inputs[k]).trim()}\n` : '';
  return [
    `Generate: ${artifactName}`,
    '',
    L('topic',     'Training topic'),
    L('level',     'Audience level'),
    L('duration',  'Duration'),
    L('platform',  'Platform / technology'),
    L('framework', 'Framework / standard'),
    L('vendor',    'Vendor / service provider'),
    L('applications', 'Applications'),
    L('os',        'Operating system'),
    L('database',  'Database'),
    L('scope',     'Scope & systems'),
    L('entity',    'Organization'),
    L('period',    'Audit period'),
    L('auditRef',  'Audit reference'),
    L('domains',   'Control domains to cover'),
    L('findings',  'Findings / exceptions observed'),
    L('opinion',   'Overall opinion'),
    L('jd',        'JOB DESCRIPTION'),
    L('resume',    'CANDIDATE RESUME / BACKGROUND'),
    L('notes',     'Additional context'),
    '',
    'Output the artifact in Markdown. No preamble, no closing commentary.',
  ].filter(Boolean).join('\n');
}

/* ==================================================================
   3. SSE helper + streaming
   ================================================================== */
function openSSE(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  return obj => res.write(`data: ${JSON.stringify(obj)}\n\n`);
}

async function streamDemo(send, text) {
  for (const chunk of text.match(/[\s\S]{1,90}/g) || []) {
    send({ text: chunk });
    await new Promise(r => setTimeout(r, 10));
  }
}

/* Run a Claude message and collect the full result.
   Uses the LOW-LEVEL streaming iterator (`messages.create({stream:true})`) rather than the
   high-level `messages.stream()` helper: the helper's internal message-accumulator has thrown
   "Invalid array length" (a RangeError) on some tool/thinking block sequences, so we accumulate
   the blocks ourselves — plain, defensive, and independent of SDK-version quirks.
   Returns { text, usage, sources }. `onText`, if given, is called per text delta (for live SSE). */
async function streamClaude({ system, user, tools, maxTokens = 8000, onText }) {
  const params = {
    model: MODEL,
    max_tokens: maxTokens,
    // Disable extended thinking: these are fast, interactive drafting/research calls
    // grounded in supplied references — thinking adds latency without materially
    // improving structured output, and Sonnet-tier models default it on.
    thinking: { type: 'disabled' },
    // Cache the large, reference-laden system prompt so repeat generations with the
    // same artifact/platform/framework reuse it — big latency + cost win.
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: user }],
    stream: true,
  };
  if (tools) params.tools = tools;

  const stream = await client.messages.create(params);

  let text = '';
  const blocks = [];          // reconstruct content blocks for source extraction
  let inTok = 0, outTok = 0, cacheRead = 0, cacheWrite = 0;

  for await (const ev of stream) {
    if (!ev || typeof ev !== 'object') continue;
    switch (ev.type) {
      case 'message_start': {
        const u = ev.message?.usage;
        if (u) { inTok = u.input_tokens || 0; cacheRead = u.cache_read_input_tokens || 0; cacheWrite = u.cache_creation_input_tokens || 0; }
        break;
      }
      case 'content_block_start': {
        // Server-tool results (e.g. web_search) arrive as a complete block here.
        blocks[ev.index] = ev.content_block ? { ...ev.content_block } : {};
        break;
      }
      case 'content_block_delta': {
        const d = ev.delta || {};
        const b = blocks[ev.index] || (blocks[ev.index] = {});
        if (d.type === 'text_delta' && typeof d.text === 'string') {
          text += d.text;
          b.text = (b.text || '') + d.text;
          onText?.(d.text);
        } else if (d.type === 'citations_delta' && d.citation) {
          (b.citations || (b.citations = [])).push(d.citation);
        }
        break;
      }
      case 'message_delta': {
        if (ev.usage?.output_tokens != null) outTok = ev.usage.output_tokens;
        break;
      }
      default:
        break;
    }
  }

  if (inTok || outTok) {
    USAGE.in += inTok;
    USAGE.out += outTok;
    USAGE.calls += 1;
    console.log(`  usage: in=${inTok} out=${outTok} cache_read=${cacheRead} cache_write=${cacheWrite} · session total in=${USAGE.in} out=${USAGE.out} over ${USAGE.calls} call(s)`);
  }

  return { text, usage: { input_tokens: inTok, output_tokens: outTok }, sources: extractSources({ content: blocks }) };
}

/* Pull cited URLs out of a finalMessage that used the web_search tool. */
function extractSources(finalMsg) {
  const urls = new Set();
  if (!finalMsg?.content) return [];
  for (const block of finalMsg.content) {
    if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
      for (const r of block.content) if (r?.url) urls.add(r.url);
    }
    if (block.type === 'text' && Array.isArray(block.citations)) {
      for (const c of block.citations) if (c?.url) urls.add(c.url);
    }
  }
  return [...urls].slice(0, 25);
}

/* ==================================================================
   3b. Office export — Markdown → Word (.docx) / Excel (.xlsx)
   ------------------------------------------------------------------
   Document-style artifacts (memos, reports, prep packs) export to Word;
   tabular artifacts (RCM, RFI, gap assessment) export to Excel. The
   default per artifact is below; the client may override the format.
   ================================================================== */
const EXPORT_FMT = { rcm: 'xlsx', rfi: 'xlsx', gap: 'xlsx', tpra: 'xlsx' };

function splitTableRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|')
    .map(c => c.trim().replace(/\\\|/g, '|').replace(/\*\*/g, '').replace(/`/g, ''));
}
/* Pull every GitHub-flavoured pipe table out of the markdown, tagged with its
   nearest preceding heading (used to name Excel worksheets). */
function extractTables(md) {
  const lines = md.split('\n');
  const out = [];
  let heading = '';
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^#{1,6}\s+(.*)$/);
    if (h) { heading = h[1].trim().replace(/[*_`]/g, ''); continue; }
    if (/^\s*\|.*\|\s*$/.test(lines[i]) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const header = splitTableRow(lines[i]);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(splitTableRow(lines[i])); i++; }
      i--;
      out.push({ heading, header, rows });
    }
  }
  return out;
}

/* Markdown -> Word using the `docx` library (deterministic OOXML — reliably opens in Word). */
const HEADINGS = [null, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4];
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
const CELL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };

/* Convert marked inline tokens to docx TextRuns, carrying bold/italic/code styling. */
function inlineRuns(tokens, base = {}) {
  const runs = [];
  const walk = (toks, style) => {
    for (const t of toks || []) {
      if (t.type === 'strong') walk(t.tokens, { ...style, bold: true });
      else if (t.type === 'em') walk(t.tokens, { ...style, italics: true });
      else if (t.type === 'codespan') runs.push(new TextRun({ text: t.text || '', font: 'Consolas', ...style }));
      else if (t.type === 'br') runs.push(new TextRun({ break: 1 }));
      else if (t.type === 'link') walk(t.tokens, style);
      else if (t.type === 'text' || t.type === 'escape') {
        if (t.tokens && t.tokens.length) walk(t.tokens, style);
        else runs.push(new TextRun({ text: t.text || '', ...style }));
      } else if (t.tokens && t.tokens.length) walk(t.tokens, style);
      else if (t.text) runs.push(new TextRun({ text: t.text, ...style }));
    }
  };
  walk(tokens, base);
  if (runs.length === 0) runs.push(new TextRun({ text: '', ...base }));
  return runs;
}
function cellParagraph(cell, base = {}) {
  const toks = cell && cell.tokens && cell.tokens.length ? cell.tokens : [{ type: 'text', text: (cell && cell.text) || '' }];
  return new Paragraph({ children: inlineRuns(toks, base) });
}
function tokensToDocx(tokens) {
  const out = [];
  for (const tk of tokens) {
    switch (tk.type) {
      case 'heading':
        out.push(new Paragraph({ heading: HEADINGS[Math.min(tk.depth, 4)] || HeadingLevel.HEADING_4, children: inlineRuns(tk.tokens), spacing: { before: 160, after: 80 } }));
        break;
      case 'paragraph':
        out.push(new Paragraph({ children: inlineRuns(tk.tokens), spacing: { after: 120 } }));
        break;
      case 'list': {
        let idx = Number(tk.start) > 0 ? Number(tk.start) : 1;
        for (const item of tk.items) {
          const toks = item.tokens && item.tokens.length ? item.tokens : [{ type: 'text', text: item.text || '' }];
          if (tk.ordered) {
            out.push(new Paragraph({ indent: { left: 360 }, children: [new TextRun({ text: `${idx}. ` }), ...inlineRuns(toks)] }));
            idx++;
          } else {
            out.push(new Paragraph({ bullet: { level: 0 }, children: inlineRuns(toks) }));
          }
        }
        break;
      }
      case 'table': {
        const header = new TableRow({
          tableHeader: true,
          children: tk.header.map(c => new TableCell({
            shading: { fill: 'F0F0F0' }, borders: CELL_BORDERS, children: [cellParagraph(c, { bold: true })],
          })),
        });
        const rows = tk.rows.map(row => new TableRow({
          children: row.map(c => new TableCell({ borders: CELL_BORDERS, children: [cellParagraph(c)] })),
        }));
        out.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { ...CELL_BORDERS, insideHorizontal: CELL_BORDER, insideVertical: CELL_BORDER },
          rows: [header, ...rows],
        }));
        out.push(new Paragraph({ text: '', spacing: { after: 120 } }));
        break;
      }
      case 'code':
        for (const line of String(tk.text || '').split('\n')) {
          out.push(new Paragraph({ children: [new TextRun({ text: line, font: 'Consolas', size: 18 })] }));
        }
        break;
      case 'blockquote':
        out.push(new Paragraph({ indent: { left: 360 }, children: inlineRuns(tk.tokens || [{ type: 'text', text: tk.text || '' }], { italics: true }) }));
        break;
      case 'hr':
        out.push(new Paragraph({ text: '', border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC', space: 1 } } }));
        break;
      case 'space':
        break;
      default:
        if (tk.text) out.push(new Paragraph({ children: [new TextRun({ text: String(tk.text) })] }));
    }
  }
  return out;
}
async function markdownToDocx(md, title) {
  const doc = new Document({
    creator: 'ITAuditVault',
    title: title || 'ITAuditVault',
    styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
    sections: [{
      properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      children: tokensToDocx(marked.lexer(md || '')),
    }],
  });
  return await Packer.toBuffer(doc);
}

async function markdownToXlsx(md, title) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'ITAuditVault';
  const used = new Set();
  const name = (base, i) => {
    let n = String(base || `Sheet ${i + 1}`).replace(/[\\/?*[\]:]/g, ' ').trim().slice(0, 28) || `Sheet ${i + 1}`;
    let out = n, k = 2;
    while (used.has(out.toLowerCase())) out = `${n} ${k++}`.slice(0, 31);
    used.add(out.toLowerCase());
    return out;
  };
  const tables = extractTables(md);
  if (tables.length === 0) {
    const ws = wb.addWorksheet(name(title, 0));
    String(md).split('\n').forEach(line => ws.addRow([String(line)]));
    ws.getColumn(1).width = 110;
    ws.getColumn(1).alignment = { wrapText: true, vertical: 'top' };
  } else {
    tables.forEach((t, i) => {
      const ws = wb.addWorksheet(name(t.heading || title, i));
      const hr = ws.addRow(t.header.map(h => String(h ?? '')));
      hr.font = { bold: true };
      hr.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } };
      t.rows.forEach(r => ws.addRow(r.map(c => String(c ?? ''))));
      t.header.forEach((h, ci) => {
        let max = String(h).length;
        t.rows.forEach(r => { max = Math.max(max, String(r[ci] ?? '').length); });
        ws.getColumn(ci + 1).width = Math.min(60, Math.max(10, max + 2));
        ws.getColumn(ci + 1).alignment = { wrapText: true, vertical: 'top' };
      });
      ws.views = [{ state: 'frozen', ySplit: 1 }];
    });
  }
  return Buffer.from(await wb.xlsx.writeBuffer());
}

/* ==================================================================
   4. Routes — health, extract, generate
   ================================================================== */
/* Public — the app shell / login screen reads this to learn its capabilities. */
app.get('/api/health', (req, res) => res.json(capabilities(req)));

app.post('/api/login', loginLimiter, (req, res) => {
  if (!AUTH_REQUIRED) return res.json({ ok: true, ...capabilities(req) });
  const password = (req.body && req.body.password) || '';
  let role = null;
  if (ADMIN_PASSWORD && pwEqual(password, ADMIN_PASSWORD)) role = 'admin';
  else if (AUTH_PASSWORD && pwEqual(password, AUTH_PASSWORD)) role = ADMIN_PASSWORD ? 'user' : 'admin';
  if (!role) return res.status(401).json({ error: 'Incorrect password.' });
  res.setHeader('Set-Cookie', cookieHeader(req, makeToken(role), Math.floor(SESSION_TTL_MS / 1000)));
  req.role = role; req.authed = true;
  res.json({ ok: true, ...capabilities(req) });
});

app.post('/api/logout', (req, res) => {
  res.setHeader('Set-Cookie', cookieHeader(req, '', 0));
  res.json({ ok: true });
});

app.post('/api/extract', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  const name = req.file.originalname.toLowerCase();
  try {
    let text = '';
    if (name.endsWith('.txt') || name.endsWith('.md')) {
      text = req.file.buffer.toString('utf8');
    } else if (name.endsWith('.pdf')) {
      const { default: pdfParse } = await import('pdf-parse');
      text = (await pdfParse(req.file.buffer)).text;
    } else if (name.endsWith('.docx')) {
      const mammoth = await import('mammoth');
      text = (await mammoth.extractRawText({ buffer: req.file.buffer })).value;
    } else {
      return res.status(415).json({ error: 'Unsupported file type. Use .txt, .md, .pdf, or .docx.' });
    }
    res.json({ text: text.replace(/\n{3,}/g, '\n\n').trim().slice(0, 60000) });
  } catch (err) {
    console.error('extract failed:', err);
    res.status(500).json({ error: 'Could not read that file. Paste the text instead.' });
  }
});

/* Build a short, high-level completion summary from generated markdown — this is what the
   screen shows instead of the full artifact (the artifact itself goes straight to the file). */
function describe(artifact, name, inputs, markdown) {
  const md = String(markdown || '');
  const h1 = md.match(/^#\s+(.+)$/m);
  const title = (h1 ? h1[1] : (name || artifact)).replace(/[*_`]/g, '').trim();
  const sections = (md.match(/^#{2,3}\s+/gm) || []).length;
  const tables = extractTables(md);
  const tableRows = tables.reduce((n, t) => n + (t.rows?.length || 0), 0);
  const words = md.split(/\s+/).filter(Boolean).length;
  const ctx = [];
  const i = inputs || {};
  if (i.framework) ctx.push(i.framework);
  if (i.platform) ctx.push(i.platform);
  if (i.vendor) ctx.push(i.vendor);
  if (i.topic) ctx.push(i.topic);
  if (i.scope) ctx.push(i.scope);
  return {
    title,
    context: [...new Set(ctx)].slice(0, 4).join(' · '),
    sections,
    tables: tables.length,
    tableRows,
    words,
  };
}

app.post('/api/generate', requireAuth, generateLimiter, async (req, res) => {
  const { artifact, artifactName, inputs: rawInputs = {} } = req.body || {};
  if (!artifact || !TASKS[artifact]) return res.status(400).json({ error: 'Unknown artifact type.' });

  // Drop training-only fields the client may have carried over from a prior artifact.
  const inputs = scrubInputs(artifact, rawInputs);
  const format = EXPORT_FMT[artifact] || 'docx';
  try {
    let markdown;
    if (!client) {
      markdown = demoArtifact(artifact, artifactName, inputs);
    } else {
      const result = await streamClaude({
        system: buildSystem(artifact, inputs),
        user: buildUser(artifact, artifactName, inputs),
        maxTokens: 8000,
      });
      markdown = result.text;
    }
    if (!String(markdown || '').trim()) {
      return res.status(502).json({ error: 'No content was returned. Check the server logs and try again.' });
    }
    res.json({
      ok: true,
      artifact,
      artifactName: artifactName || artifact,
      format,
      markdown,
      summary: describe(artifact, artifactName, inputs, markdown),
      demo: !client,
    });
  } catch (err) {
    console.error('generate failed:', err);
    res.status(500).json({ error: err?.message || 'Generation failed.' });
  }
});

/** Export already-generated markdown as Word (.docx), Excel (.xlsx), or raw Markdown. */
app.post('/api/export', requireAuth, async (req, res) => {
  const { artifact = '', artifactName = '', markdown = '', format } = req.body || {};
  if (!String(markdown).trim()) return res.status(400).json({ error: 'Nothing to export.' });
  const fmt = ['docx', 'xlsx', 'md'].includes(format) ? format : (EXPORT_FMT[artifact] || 'docx');
  const base = (artifact || 'itauditvault').replace(/[^a-z0-9-]/gi, '-').slice(0, 40) || 'itauditvault';
  const stamp = new Date().toISOString().slice(0, 10);
  const fname = `${base}-${stamp}.${fmt}`;
  const title = artifactName || artifact || 'ITAuditVault';
  try {
    let buf, type;
    if (fmt === 'xlsx') {
      buf = await markdownToXlsx(String(markdown), title);
      type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (fmt === 'docx') {
      buf = await markdownToDocx(String(markdown), title);
      type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      buf = Buffer.from(String(markdown), 'utf8');
      type = 'text/markdown; charset=utf-8';
    }
    // .docx/.xlsx are ZIP packages — verify the "PK" magic so a corrupt build never
    // reaches the browser as an unopenable file. Fail loudly instead.
    if ((fmt === 'xlsx' || fmt === 'docx') && !(buf && buf.length > 4 && buf[0] === 0x50 && buf[1] === 0x4b)) {
      throw new Error('Generated an invalid Office file.');
    }
    res.setHeader('Content-Type', type);
    res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
    res.setHeader('Content-Length', buf.length);
    res.end(buf);
  } catch (err) {
    console.error('export failed:', err);
    res.status(500).json({ error: 'Could not build the file. Try the .md download instead.' });
  }
});

/* ==================================================================
   5. Routes — Skill Studio (browse + self-improve the skill)
   ================================================================== */
const SLUG = /^[a-z0-9][a-z0-9-]{1,60}$/;

app.get('/api/skills', requireAuth, (_req, res) => {
  const skills = Object.entries(SKILL.refs)
    .map(([name, md]) => ({
      name,
      title: refTitle(md, name),
      summary: refSummary(md),
      words: md.split(/\s+/).filter(Boolean).length,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
  res.json({ skills, core: !!SKILL.core });
});

app.get('/api/skills/:name', requireAuth, (req, res) => {
  const name = req.params.name;
  if (name === 'SKILL') return res.json({ name: 'SKILL', title: 'SKILL.md', markdown: SKILL.core || '' });
  if (!SKILL.refs[name]) return res.status(404).json({ error: 'No such reference.' });
  res.json({ name, title: refTitle(SKILL.refs[name], name), markdown: SKILL.refs[name] });
});

const IMPROVE_STYLE = `
You are the maintainer of an IT-audit knowledge base used to generate client-ready workpapers.
Each file is a dense, practitioner-grade reference for one domain. When you write or update one:
- Match the existing library's register: precise, objective, standard audit vocabulary (control
  objective, control activity, TOD, TOE, IPE, PBC, population, sample, exception, deficiency,
  remediation, residual risk). No marketing tone.
- Use REAL, current specifics from authoritative public sources: control/requirement identifiers,
  framework references, system commands, configuration parameters, table/transaction names, console
  paths, report names. Prefer primary sources (NIST, ISO, PCI SSC, AICPA, CIS, cloud-provider docs,
  vendor security guides, ISACA/COBIT). Do NOT invent control identifiers.
- Structure as GitHub-flavoured Markdown: an H1 title, a short orienting paragraph, then sections with
  tables where the material is tabular (RCM rows, requirement matrices, command tables).
- Keep it self-contained and directly usable as reference material fed to an audit-drafting model.
- End with a "## Sources" section listing the public URLs you relied on.
Output ONLY the Markdown file content — no preamble, no explanation before or after.
`.trim();

app.post('/api/skills/improve', requireWrite, improveLimiter, async (req, res) => {
  const { name, topic, instructions = '' } = req.body || {};
  const existing = name && SKILL.refs[name] ? SKILL.refs[name] : null;
  const subject = (existing ? refTitle(existing, name) : (topic || name || '')).trim();
  if (!subject) return res.status(400).json({ error: 'Provide a reference name or topic.' });

  const send = openSSE(res);

  if (!client) {
    await streamDemo(send, demoImprove(subject, !!existing));
    send({ done: true, sources: ['https://www.nist.gov/', 'https://www.pcisecuritystandards.org/', 'https://www.iso.org/'] });
    return res.end();
  }

  const system = IMPROVE_STYLE;
  const user = [
    existing
      ? `Update and strengthen the following IT-audit reference on "${subject}". Research authoritative public sources for the latest control references, requirements, commands, and procedures, then produce an improved, more complete version. Preserve what is correct; correct anything outdated; fill gaps.`
      : `Create a new IT-audit reference on "${subject}" for the knowledge base. Research authoritative public sources, then produce a complete, practitioner-grade reference.`,
    instructions ? `\nMaintainer instructions:\n${instructions.trim()}` : '',
    existing ? `\nCURRENT VERSION (improve this):\n<current>\n${existing}\n</current>` : '',
    '\nUse web search to ground the content in current, publicly available resources. Output only the Markdown file.',
  ].filter(Boolean).join('\n');

  try {
    const result = await streamClaude({
      system,
      user,
      maxTokens: 16000,
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 6 }],
      onText: t => send({ text: t }),
    });
    send({ done: true, sources: result.sources });
    res.end();
  } catch (err) {
    console.error('improve failed:', err);
    send({ error: err?.message || 'Skill research failed.' });
    res.end();
  }
});

app.post('/api/skills/save', requireWrite, (req, res) => {
  const { name, markdown } = req.body || {};
  if (!name || !SLUG.test(name)) {
    return res.status(400).json({ error: 'Invalid reference name. Use lowercase letters, digits, and hyphens.' });
  }
  if (!markdown || !String(markdown).trim()) {
    return res.status(400).json({ error: 'Nothing to save.' });
  }
  // Confine strictly to the references directory (no traversal).
  const target = path.join(REF_DIR, `${name}.md`);
  if (path.dirname(path.resolve(target)) !== path.resolve(REF_DIR)) {
    return res.status(400).json({ error: 'Invalid path.' });
  }
  try {
    fs.mkdirSync(REF_DIR, { recursive: true });
    const created = !fs.existsSync(target);
    fs.writeFileSync(target, String(markdown).trim() + '\n', 'utf8');
    loadSkill(); // hot-reload so the new/updated reference is immediately usable for generation
    res.json({ ok: true, name, created, refs: Object.keys(SKILL.refs).length });
  } catch (err) {
    console.error('save failed:', err);
    res.status(500).json({ error: 'Could not write the reference file.' });
  }
});

/* Fallback so client-side deep links still serve the app. */
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(ROOT, 'public', 'index.html')));

/* ==================================================================
   6. Demo output (used when ANTHROPIC_API_KEY is absent)
   ================================================================== */
function demoBanner(what) {
  return `> **Demo mode.** No \`ANTHROPIC_API_KEY\` is configured, so this is a fixed sample — not generated from your inputs. Set the key and restart to produce a real ${what}.\n\n`;
}

function demoArtifact(artifact, name, i) {
  const fw = i.framework || 'SOX ITGC';
  const pf = i.platform || 'Oracle EBS';
  const banner = demoBanner(name.toLowerCase());

  if (artifact === 'rcm') return banner + `# Risk & Control Matrix — ${fw}

**Systems:** ${i.scope || pf}  **Audit Period:** ${i.period || 'MM/DD/YY – MM/DD/YY'}

### Information Security

| Ctrl Ref | Control Objective | Key Risk Addressed | Framework Ref | Control Activity | Type | Nature | Risk | Conclusion |
|---|---|---|---|---|---|---|---|---|
| IT5.04 | Authentication settings enforce strong credentials. | Weak passwords allow credential compromise. | CC6.1 | Password length, complexity, history, and lockout are enforced per standard. | P | A | High | TBD – Control has not been tested |
| IT5.06 | Privileged access is restricted. | Excess admin access enables control bypass. | CC6.1, CC6.3 | Administrative access is restricted to appropriate administrators and justified. | P | A | High | TBD – Control has not been tested |
| IT6.07 | Access is removed on termination. | Terminated users retain access to financial data. | CC6.2 | Access is disabled within the defined SLA of the HR termination event. | P | M | High | TBD – Control has not been tested |

### System Change Control

| Ctrl Ref | Control Objective | Key Risk Addressed | Framework Ref | Control Activity | Type | Nature | Risk | Conclusion |
|---|---|---|---|---|---|---|---|---|
| IT8.04 | Changes are tested before release. | Untested changes cause errors or outages. | CC8.1 | Changes are tested prior to production release; findings are addressed. | P | M | High | TBD – Control has not been tested |
| IT8.06 | Developers cannot deploy to production. | No segregation of duties in migration. | CC8.1 | Developers do not have access to migrate changes to production. | P | A | High | TBD – Control has not been tested |
`;

  if (artifact === 'announcement') return banner + `**MEMORANDUM**

**To:** [Process Owner], [Title]
**From:** [Lead Auditor], Internal Audit
**Date:** MM/DD/YY
**Re:** Commencement of ${fw} Audit — ${pf} (Audit Ref: ${i.auditRef || '26-014'})

## 1. Purpose
This memorandum confirms the commencement of the ${fw} audit over ${i.scope || pf}, scheduled as part of the current audit plan.

## 2. Objective
To provide independent assurance over the design and operating effectiveness of the controls supporting ${fw}.

## 3. Scope
The review covers ${i.scope || pf} for the period ${i.period || 'MM/DD/YY – MM/DD/YY'}.

## 4. Approach
A risk-based approach comprising walkthroughs to assess control design (Test of Design) and sample-based testing of operating effectiveness (Test of Operating Effectiveness). Evidence will be requested via the accompanying Request for Information; system-generated extracts are preferred and will be subject to completeness and accuracy (IPE) validation.

## 5. Audit Team & Contacts
- Lead Auditor: [Name, Title, email]
- Auditee primary contact requested: please nominate a single point of contact.

## 6. Indicative Timeline
- Kickoff meeting: MM/DD/YY (proposed)
- Fieldwork: MM/DD/YY to MM/DD/YY
- Draft report: MM/DD/YY · Final report: MM/DD/YY

## 7. What We Need From You
- A primary point of contact and the relevant control owners.
- Timely provision of requested evidence, preferably system-generated.
- Availability for interviews and walkthroughs during fieldwork.
`;

  if (artifact === 'interview') return banner + `# IT Audit Interview Prep Pack

## 1. Profile & Strategy
**Detected role:** Senior IT Auditor — SOX / ITGC focus.
**Strengths to lead with:** hands-on ITGC execution; IPE testing; RCM and test program development.
**Gaps to prepare for:** name any platform in the JD you have not audited, and prepare a transferable-skills answer.

## 2. Audit Methodology

**Q1. Explain how you perform an audit, end to end.**

*Model answer:* "I follow three phases. **Planning** — after the engagement memo I confirm scope, objective and timeline with the auditee, obtain policies and the system landscape, assess inherent risk, build the risk-and-control matrix and test program, and issue the evidence request. **Fieldwork** — I assess design through walkthroughs combining inquiry, inspection, observation and reperformance, then test operating effectiveness on a sample over the period, discussing exceptions as they arise. **Reporting** — I draft the report and opinion, agree wording and action plans with the auditee, issue the final report, and track remediation."

*What good looks like:* the three-phase framing, TOD vs TOE, and "discuss issues as they arise".

**Q2. What is IPE and how do you test it?**

*Model answer:* "Information Produced by the Entity — any report I rely on to test a control. Before relying on it I validate the source system, the report logic, and its completeness and accuracy — reconciling counts, re-running or observing the report, and checking for filters that could conceal items such as terminated-but-active users. Without completeness and accuracy, no conclusion drawn from that evidence is reliable."

## 3. Questions to Ask the Interviewer
- How is the IT audit universe scoped, and how many key applications are in scope?
- What does success look like for this role in the first 6–12 months?
`;

  return banner + `# ${name}

This is placeholder demo content for **${name}** (${fw}${i.platform ? ' · ' + i.platform : ''}).

Configure \`ANTHROPIC_API_KEY\` in \`.env\` and restart the server. ITAuditVault will then load the IT Audit skill's reference files, select the ones matching your platform and framework, and generate a full ${name.toLowerCase()} grounded in real control references and test procedures.
`;
}

function demoImprove(subject, existing) {
  return demoBanner(`research-grounded ${existing ? 'update' : 'reference'}`) + `# ${subject}

${existing ? 'Updated' : 'New'} IT-audit reference (demo sample). With an API key configured, ITAuditVault uses Claude with the **web_search** tool to research authoritative public sources — NIST, ISO, PCI SSC, AICPA, CIS, and vendor security documentation — and drafts a practitioner-grade reference in the library's house style.

## Scope
State what this domain covers, the systems in scope, and the frameworks it maps to.

## Key Risks
- Risk 1 — the specific threat to confidentiality, integrity, availability, or compliance.
- Risk 2 — a second material risk to the objective.

## Controls & Test Procedures
| Ctrl Ref | Control Objective | Control Activity | Test of Design | Test of Operating Effectiveness |
|---|---|---|---|---|
| REF-01 | Objective of the control. | What management does. | Walkthrough via inquiry/inspection/observation. | Sample over the period; obtain a system-generated population and IPE-test it. |

## Sources
- https://www.nist.gov/
- https://www.pcisecuritystandards.org/
- https://www.iso.org/
`;
}

app.listen(PORT, () => {
  console.log(`\n  ITAuditVault running → http://localhost:${PORT}`);
  console.log(`  Mode: ${client ? `LIVE (${MODEL})` : 'DEMO (set ANTHROPIC_API_KEY for live generation)'}`);
  console.log(`  Skill references loaded: ${Object.keys(SKILL.refs).length}`);
  if (AUTH_REQUIRED) {
    console.log(`  Auth: ENABLED${ADMIN_PASSWORD ? ' (admin password set — Skill Studio writes are admin-only)' : ''}`);
    if (!process.env.SESSION_SECRET) console.log(`  ⚠  SESSION_SECRET not set — a random one was generated; sessions reset on restart.`);
  } else {
    console.log(`  ⚠  Auth: DISABLED — anyone who can reach this server can spend your API budget. Set AUTH_PASSWORD to require login.`);
  }
  console.log(`  Skill Studio writes: ${SKILL_WRITE ? (AUTH_REQUIRED ? 'enabled (admins)' : 'ENABLED for all — set AUTH_PASSWORD or SKILL_WRITE=false') : 'read-only'}\n`);
});
