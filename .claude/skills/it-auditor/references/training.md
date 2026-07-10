# IT Audit Training — Curriculum & Module Generator

The reference for building **IT audit training**: a single detailed **training module** on any topic, a
full **curriculum / onboarding program**, or **certification (CISA/CISM/CRISC/CIA) study material**.
It is written to span the **entire** IT Audit skill — every domain reference and framework — so training
is grounded in the same real control references, commands, and test procedures the skill uses for
workpapers, not generic slideware.

**Typical IT-audit training style** (what "detailed and practitioner-grade" means here): objectives-led;
concept → **real** control reference / command / framework requirement → **walkthrough** of how an
auditor executes it → hands-on **exercise / case study** → **knowledge check with an answer key**.
Always explain the *why* (the risk and the objective), not just the *what*. Use the exact vocabulary
from `audit-lifecycle.md` (control objective/activity, TOD/TOE, IPE, PBC, population, sample, exception,
deficiency).

## How to use this reference

- **Generate one training module on a topic** → use the *Module template* below, grounded in the
  topic's domain reference(s) (routing table in `SKILL.md`). Level and duration are optional; default to
  the audience implied by the topic.
- **Design a full program / onboarding path** → use the *Curriculum map* and *Onboarding path*.
- **Certification study** → use the *Certification mapping* to pull the right references per exam domain.

## Module template (use for any topic)

1. **Module header** — title; audience level (Foundational / Intermediate / Advanced / Exam prep);
   estimated duration; prerequisites; the skill reference(s) it draws on.
2. **Learning objectives** — 4–8 measurable outcomes ("By the end, the participant can obtain a
   system-generated user listing, IPE-test it, and conclude on the access control").
3. **Why it matters** — the risk and business/ICFR context; what goes wrong without the control.
4. **Key concepts & terminology** — define the vocabulary precisely, with the **real** control
   references, parameters, transaction codes, commands, or framework requirement IDs from the source
   reference.
5. **Deep dive** — the substance: risk → control objective → control activity (type/nature/risk) →
   **test procedures** in the Interview → Test of Control (TOD/TOE) → Conclusion pattern, using the
   platform/framework specifics. Show the actual query/command/console path where the domain has one.
6. **Worked example / walkthrough** — a realistic end-to-end scenario (obtain the population, IPE-test
   it, sample, test, document the exception, conclude).
7. **Common pitfalls & exam/interview traps** — e.g., inquiry-only evidence, accepting a screenshot as a
   population, testing operating effectiveness before design.
8. **Exercise / case study** — 2–3 hands-on tasks or a mini-case with a defined deliverable (e.g., "here
   is a redacted user listing and an HR termination list — identify terminated-but-active users").
9. **Knowledge check** — 5–8 questions (mix of multiple-choice and short answer) **with an answer key**
   and a one-line rationale each.
10. **Summary & further study** — key takeaways; which skill reference(s) to read next; the CISA/CISM
    domain(s) this maps to.

Deliver a module as an **inline lesson** for a quick request, or a **Word document** for a formal
handout/workbook (see "Choosing the output format" in `SKILL.md`).

## Curriculum map — the full program (covers every reference)

A tiered program. Each module names the skill reference(s) that supply its substance.

**Level 0 — Foundations of IT audit & assurance**
- The audit lifecycle & core method (risk → control objective → control activity → test → conclusion;
  TOD vs. TOE; sampling; audit opinions; SOX concepts) → `audit-lifecycle.md`.
- Frameworks & standards landscape (COBIT, NIST 800-53, NIST CSF, ISO 27001, PCI DSS, HITRUST, SOC, CIS,
  COSO) — what each is and when to cite it → `frameworks.md`.

**Level 1 — ITGC core (the backbone)**
- Information security / logical access; change management; IT operations (batch, backup) — the full RCM
  (IT1–IT10) and audit program → `itgc.md`.
- Building the workpapers — RCM and audit-program structure → `deliverable-templates.md`.

**Level 1.5 — Application controls & evidence**
- IT application controls (input/processing/output/audit trail), IPE testing, and SOC 1 / SOC 2 report
  review → `itac-and-ipe.md`.

**Level 2 — Platform deep dives (system-specific execution)**
- SAP (SoD, critical authorizations, basis, transports, SAP_ALL, table logging) → `sap-audit.md`.
- Oracle ERP — EBS & Fusion (responsibilities, SoD, SYSADMIN, profile options, UMX) →
  `oracle-erp-audit.md`.
- Active Directory / Windows (account policies, privileged groups, OU delegation, audit policy) →
  `active-directory-audit.md`.
- Mainframe z/OS — RACF / ACF2 / Top Secret (dataset/resource access, SPECIAL/OPERATIONS, APF, SMF) →
  `mainframe-audit.md`.
- Infrastructure — Windows, Linux/Unix, Oracle & SQL Server, firewall/network → `infrastructure-audit.md`.
- SIEM & security logging (event governance, source log management, retention) →
  `siem-and-logging-audit.md`.
- Cloud & virtualization — AWS, Azure, GCP, VMware, shared responsibility, CIS benchmarks →
  `cloud-and-emerging.md`.

**Level 3 — Programs, frameworks & compliance**
- NIST CSF posture/maturity assessment → `nist-csf-audit.md`.
- PCI DSS v4.0 (CDE scoping, 12 requirements, SAQ vs. ROC) → `pci-dss-audit.md`.
- CMMC / NIST 800-171 (FCI/CUI, levels, SPRS, SSP/POA&M) → `cmmc-audit.md`.
- FedRAMP (authorization boundary, 800-53 baselines, ConMon, 20x) → `fedramp-audit.md`.
- Gap / readiness assessment & the multi-framework crosswalk → `gap-assessment.md`.
- Third-party / vendor & supply-chain risk (CSA CCM/CAIQ & STAR, VSA, SIG, SOC 2 reliance, ISO 27036,
  NIST 800-161) → `third-party-risk-audit.md`.

**Level 3.5 — Secure & project assurance**
- Secure Development Lifecycle (SDL / OWASP SAMM / NIST SSDF; threat modeling; SAST/DAST) →
  `secure-development-sdl.md`.
- SDLC/project audit, disaster recovery & backup, physical/environmental security, TPRM summary, and the
  HIPAA Security Rule → `sdlc-dr-physical-tprm.md`.
- Software / ERP implementation assurance (phase × control-area, pre/post go-live) →
  `software-implementation-audit.md`.

**Level 4 — Emerging technology**
- AI systems, models & governance (NIST AI RMF, ISO/IEC 42001, EU AI Act; bias, drift, LLM risks,
  human oversight) → `ai-audit.md`.

**Level 5 — Reporting & engagement execution**
- The five engagement documents — commencement memo, planning document, RFI/PBC, observation memo, audit
  report → `engagement-documents.md`.
- Writing findings (CCCER), ratings, opinions, and management action plans; reusable finding/rating
  blocks → `deliverable-templates.md`.

**Career & certification**
- Interview preparation and answering technical questions → `interview-prep.md`.
- Certification study — see the mapping below.

## Suggested onboarding path (new IT auditor, first ~90 days)

1. Weeks 1–2: Level 0 (audit lifecycle + frameworks landscape). Deliverable: explain risk → control →
   test → conclusion and the four evidence techniques.
2. Weeks 3–5: Level 1 ITGC + workpaper templates. Deliverable: build an ITGC RCM and draft an audit
   program for one domain.
3. Weeks 6–7: Level 1.5 application controls & IPE. Deliverable: IPE-test a system-generated listing.
4. Weeks 8–10: one or two Level 2 platform modules matching the audit plan (e.g., Active Directory +
   the relevant ERP/database).
5. Weeks 11–12: Level 5 reporting — write a CCCER finding and an observation memo from a seeded exception.
6. Ongoing: Level 3/3.5/4 modules as engagements require; interview/cert study.

## Certification mapping

Use this to assemble exam-focused study material from the skill.

**CISA — the five job-practice domains:**
- **Domain 1 — Information Systems Auditing Process** → `audit-lifecycle.md`, `deliverable-templates.md`,
  `engagement-documents.md`, `itac-and-ipe.md` (IPE, sampling, evidence).
- **Domain 2 — Governance & Management of IT** → `frameworks.md` (COBIT), `nist-csf-audit.md`,
  `software-implementation-audit.md`, `sdlc-dr-physical-tprm.md` (TPRM).
- **Domain 3 — IS Acquisition, Development & Implementation** → `software-implementation-audit.md`,
  `secure-development-sdl.md`, `sdlc-dr-physical-tprm.md` (SDLC).
- **Domain 4 — IS Operations & Business Resilience** → `infrastructure-audit.md`,
  `siem-and-logging-audit.md`, `sdlc-dr-physical-tprm.md` (DR/backup), `itgc.md` (operations).
- **Domain 5 — Protection of Information Assets** → `itgc.md` (security), `infrastructure-audit.md`,
  `active-directory-audit.md`, `mainframe-audit.md`, `sap-audit.md`, `oracle-erp-audit.md`,
  `cloud-and-emerging.md`, `pci-dss-audit.md`, `siem-and-logging-audit.md`.

**Also:** CRISC → risk/controls emphasis (`audit-lifecycle.md`, `gap-assessment.md`,
`third-party-risk-audit.md`, `frameworks.md`); CISM → security program management (`frameworks.md`
ISO 27001/NIST CSF, `siem-and-logging-audit.md`, `secure-development-sdl.md`); CIA → the general
internal-audit process (`audit-lifecycle.md`, `engagement-documents.md`).

## Facilitation guidance (instructor notes)

- **Adult-learning "tell–show–do"**: state the concept, demonstrate on real (redacted) evidence, then
  have participants do it. IT audit is a skill — reading about IPE is not the same as reconciling a user
  listing.
- **Ground every module in real evidence**: use redacted user listings, change tickets, config exports,
  and a sample SOC 2. Labs beat lectures.
- **Time-box and level**: foundational modules 45–90 min; platform deep dives a half-day; run advanced
  content as workshops with a case.
- **Pre-reads**: assign the relevant skill reference before the session; use session time for the
  walkthrough and exercise.
- **Discussion prompts**: "what makes this evidence complete and accurate?", "is this a design or an
  operating deficiency?", "what is the most specific criterion to cite?".
- **Professional skepticism & independence** are themes in every module, not a separate lecture.

## Writing knowledge-check questions

Test **application**, not recall. Prefer scenario stems ("You obtain a user listing that omits
terminated-but-active users — what do you conclude about the evidence?") over definitions. Every
question needs an **answer key** with a one-line rationale, and MCQ distractors should be plausible
(common mistakes: relying on inquiry alone, accepting a screenshot as a population, concluding on
operating effectiveness before design). Mix 60% MCQ / 40% short-answer for a balanced check.

## Capstone assessment (spans the skill)

Give participants a scenario system and have them: (1) build an **RCM** for it (`itgc.md`,
`deliverable-templates.md`); (2) select and execute **one control** end to end — obtain a
system-generated population, **IPE-test** it, sample, test design and operating effectiveness
(`audit-lifecycle.md`, `itac-and-ipe.md`, the relevant platform reference); (3) write the exception as a
**CCCER finding** and draft the **observation memo** (`engagement-documents.md`,
`deliverable-templates.md`). This single capstone exercises planning, execution, evidence, and reporting
together.
