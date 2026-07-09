# IT Audit Interview Preparation (Q&A Generator)

Generate tailored interview questions **and** strong model answers for an IT auditor, based on a
**job description (JD)** the person uploads and, optionally, their **resume/CV**. This turns the whole
skill library into an interview coach: the domain references (`itgc.md`, `sap-audit.md`, `pci-dss-audit.md`,
`cmmc-audit.md`, `ai-audit.md`, etc.) supply the technical substance for accurate answers, and
`audit-lifecycle.md` + `engagement-documents.md` supply the methodology/process answers.

Use this whenever the person asks to prep for an IT audit / IT assurance / ISACA-type interview,
uploads a JD (with or without a resume), or asks "what questions might I get for this role" or "help me
answer this interview question."

## Inputs and how to handle them
- **JD only** → generate questions the role implies, plus model answers written generically (from the
  references) with clear placeholders where the candidate should insert their own experience
  (e.g., "[name a specific audit you performed]").
- **JD + resume** → tailor the answers to the candidate's actual background: pull real projects,
  tools, certifications, and domains from the resume into STAR-style answers, and flag any **gap**
  between the JD's requirements and the resume so the person can prepare for it.
- **Resume only** → infer likely target roles from the resume and generate questions/answers for them;
  note that a JD would sharpen the targeting.
- **A single pasted question** → just answer it well (see "Answer construction"), tailored to the
  resume if one is available.

If a file is uploaded but not yet read, read it first (JD and resume are usually short — read fully).
If neither is provided, ask the person to paste or upload the JD (and offer to proceed generically if
they only have the role title).

## Step 1 — Analyze the JD (and resume)
Extract and note:
- **Role level & type**: staff / senior / manager / director; internal audit vs. external/attestation
  vs. advisory vs. first/second-line (control owner). Level sets answer depth and leadership content.
- **In-scope domains & frameworks**: which of the skill's domains the JD names or implies — ITGC/SOX,
  ITAC, IPE, SOC 1/2, PCI DSS, SAP, Oracle ERP, Active Directory/Windows, mainframe, databases, OS,
  network/firewall, SIEM, cloud (AWS/Azure/GCP), virtualization, SDLC/SDL, DR/backup, physical, TPRM,
  HIPAA, NIST CSF, CMMC, FedRAMP, AI audit. Map each to its reference file for accurate answers.
- **Tools/tech**: named systems (e.g., "Oracle EBS", "RACF", "ServiceNow", "ACL/IDEA", "GRC/Archer"),
  scripting/data-analytics, cloud platforms.
- **Certifications**: CISA, CIA, CISSP, CRISC, CISM, CPA, cloud certs — expect questions probing these.
- **Soft/behavioral signals**: stakeholder management, "communicate findings", "work independently",
  "manage multiple audits" → behavioral questions.
- **Regulatory context**: SOX (public company), financial services (FFIEC/CBN etc.), healthcare
  (HIPAA), government/defense (FedRAMP/CMMC), card data (PCI).
- **From the resume**: concrete audits performed, domains of depth, tools, certs, years, industries —
  and **gaps vs. the JD** to prepare for.

## Step 2 — Choose the question mix
Aim for a balanced, role-appropriate set (default ~15–25 questions; scale to request). Categories:

1. **Introductory / fit** — "walk me through your background", "why this role". Answer = a crisp
   summary of the candidate's experience mapped to the JD.
2. **Audit methodology / process** — the audit lifecycle, TOD vs. TOE, risk-based approach, sampling,
   IPE, materiality, workpaper quality. Substance from `audit-lifecycle.md` and `itac-and-ipe.md`.
3. **Technical / domain-specific** — the heart of the interview. For every major domain the JD names,
   generate 2–4 questions at the right depth, with answers grounded in that domain's reference file
   (real control refs, commands, parameters). E.g., SAP → SoD/SAP_ALL; mainframe → SPECIAL/OPERATIONS,
   SETROPTS, APF; PCI → CDE scoping, the 12 requirements; cloud → shared responsibility, IAM/logging;
   SOX → the three ITGC domains, IPE, SOC reliance; CMMC → levels, 800-171, SPRS; AI → NIST AI RMF,
   bias/drift, ISO 42001.
4. **Frameworks & standards** — COBIT, NIST 800-53/CSF, ISO 27001, PCI, HITRUST: what/when to cite.
5. **Behavioral / situational (STAR)** — pushback on findings, missed deadline, difficult auditee,
   disagreement with a manager, competing priorities, an audit you're proud of, an error you made.
6. **Scenario / case** — "You're assigned a first-year SOX ITGC audit over Oracle EBS on Linux — how do
   you scope and start?" Answer walks the method + platform specifics.
7. **Certification-linked** — probing CISA domains or whatever certs appear.
8. **Candidate's own questions to ask** — a short list of smart questions to ask the interviewer.

## Step 3 — Answer construction
Every model answer should sound like an experienced auditor and be technically correct.

- **Technical answers**: pull the actual substance from the relevant reference file — real terminology,
  control references, commands, parameters, test steps. Frame as **risk → control objective → control
  activity → test (TOD/TOE) → conclusion** where relevant; this is what distinguishes a real auditor's
  answer. Keep it tight; don't dump the whole reference.
- **Behavioral answers**: use **STAR** (Situation, Task, Action, Result). If a resume is provided, build
  the STAR around a real project from it; otherwise provide a realistic template with placeholders the
  candidate fills in, and coach what a strong answer contains.
- **Process answers**: mirror the real 3-phase framing — Planning (engagement memo, scope, risk
  assessment, RCM, PBC/RFI, kickoff), Fieldwork (walkthroughs, TOD via inquiry/inspection/observation/
  reperformance, TOE via sampling, discuss exceptions as they arise), Reporting (draft, agree wording &
  action plans, final, issue tracking). See `audit-lifecycle.md`.
- **Honesty**: answers must be accurate. Don't invent credentials or experience the resume doesn't
  support — for anything personal, use a placeholder and coach the candidate to supply the specifics.
- **Depth by level**: staff = execution detail; senior = ownership + judgment + reviewing others;
  manager/director = scoping, risk assessment, stakeholder management, team leadership, reporting to
  the audit committee.
- Add a brief **"why they're asking / what good looks like"** note to key questions so the person
  understands the intent, not just the script.

## Output format
Default to a clear, readable structure the person can study and take into the interview:
- A short **profile summary** (role level, domains detected, key frameworks, and — if a resume was
  given — strengths to lead with and gaps to prepare for).
- Questions grouped by the categories above; for each: the **question**, a concise **model answer**,
  and (for important ones) a one-line **"what good looks like."**
- A closing list of **questions to ask the interviewer** and a few **prep tips** (e.g., "be ready to
  go deep on any domain you claim").

Deliver **inline** for a handful of questions or a quick request. For a full prep pack (a dozen or more
Q&As the person will keep/print), offer to produce a **Word document** (generate with `python-docx`) or ask if
they'd prefer it inline. If they want to drill, offer to run a **mock interview** (ask one question at a
time, let them answer, then give feedback and a model answer).

## Quality bar / cautions
- Ground every technical claim in the skill's references — no hand-waving. If the JD names a domain the
  library covers, the answer should use that domain's real specifics.
- Keep answers concise enough to actually say out loud (roughly 30–90 seconds spoken for most; longer
  for "walk me through your process").
- Tailor to the JD's seniority and industry/regulatory context.
- Never fabricate the candidate's personal experience or certifications; use placeholders and coach.
- Encourage the candidate to be ready to expand on anything they mention — interviewers probe depth.

## Example question → answer (illustrative, ITGC/SOX)
**Q: "How would you test that terminated users' access is removed timely?"**
*Model answer:* "This maps to the logical-security ITGC around deprovisioning. The risk is that a
terminated employee retains access and could inappropriately access financially significant data. I'd
first obtain the complete population of terminations in the period from HR and IPE-test it for
completeness and accuracy, then reconcile it to a system-generated user listing. For a sample, I'd
compare each termination date to the date access was disabled and confirm it met the defined SLA. Any
account still active, or disabled late, is an exception — I'd quantify it (x of n), assess root cause,
and rate it, since it can also undermine reliance on other access-dependent controls." *(What good looks
like: names the risk, insists on IPE, tests the population not just a screenshot, and ties to impact.)*
