# Gap Assessment — Entity Risk, Process & Controls vs. Frameworks & Standards

A **gap assessment** measures an entity's current state — its risks, processes, and controls —
against a **target state** defined by one or more frameworks or standards, and reports the gaps and a
remediation roadmap. It is the standard deliverable for **readiness** work (SOC 2 readiness, ISO 27001
certification readiness, PCI DSS pre-assessment, CMMC readiness, FedRAMP readiness) and for
**maturity / posture assessments** (NIST CSF, COBIT).

Read this whenever the user asks to "assess," "benchmark," "map," or "check readiness/compliance" of an
entity, process, or control set **against a framework** — then also read the reference for each named
framework (`frameworks.md` for the catalog; `nist-csf-audit.md`, `pci-dss-audit.md`, `cmmc-audit.md`,
`fedramp-audit.md`, `ai-audit.md`, `itgc.md`, `itac-and-ipe.md` for the domain substance).

## Gap assessment vs. audit — know the difference

| | Gap assessment / readiness | Audit / examination (TOD + TOE) |
|---|---|---|
| Question | Do controls **exist and, by design, meet** the requirement? What is missing? | Are controls **designed and operating effectively** over a period? |
| Evidence depth | Inquiry + inspection of design; limited/no sampling over a period | Walkthrough (TOD) **and** sample/full-population testing over the period of reliance (TOE) |
| Output | Requirement-by-requirement **status + gap + remediation roadmap**, often with a **maturity** rating | Findings (CCCER), conclusion per control, and an **opinion** |
| Independence/assurance | Advisory; no formal assurance opinion | Independent assurance / attestation |

A gap assessment concludes on **design and coverage**, not operating effectiveness. Do not express an
audit opinion or claim controls are "effective" from a gap assessment — say "designed to meet" /
"partially meets" / "not addressed." (Method vocabulary — TOD/TOE, control objective/activity,
IPE — is in `audit-lifecycle.md`.)

## The method (risk → process → control → requirement → gap → remediation)

Ground every gap in the same chain the rest of the skill uses, extended to a framework criterion:

1. **Scope the entity & target.** Define the assessment boundary (entities, business processes,
   systems, data, locations) and the **target framework(s)/standard(s)** and — where the framework has
   levels/baselines — the target level (PCI SAQ type or ROC; CMMC Level 1/2/3; FedRAMP Low/Moderate/High;
   ISO 27001 full ISMS; SOC 2 which Trust Services Categories).
2. **Build/confirm the entity risk register.** For each in-scope process, state the risks to
   confidentiality, integrity, availability, or compliance (and, for ICFR scope, risk of misstatement).
   Risks drive relevance — mark requirements N/A only when a risk genuinely does not apply.
3. **Map current controls to requirements.** For each framework requirement (or control-domain, when
   assessing several frameworks at once via the crosswalk below), identify the entity's existing
   control activity(ies), the owner, and the evidence reviewed.
4. **Assess status.** Rate each requirement (status + maturity scales below), citing the **most
   specific** applicable criterion.
5. **Describe the gap.** Factual and specific: what the requirement expects vs. what exists; whether the
   gap is design (control missing/inadequate) or implementation (control exists but not deployed
   entity-wide / not evidenced).
6. **Recommend remediation** and set **priority, owner, and target date**; group into a roadmap.
7. **Evidence & IPE.** Even at readiness depth, any population listing relied on (user lists, asset
   inventories, change logs) must be source-verified for completeness and accuracy — see
   `itac-and-ipe.md`. Note where a conclusion rests on inquiry only.

## Rating scales

**Status (compliance) — per requirement:**
- **Met** — control exists, is designed to satisfy the requirement, and is deployed across the scope.
- **Partially Met** — control exists but has a design gap, coverage gap, or lacks evidence/documentation.
- **Not Met** — no control, or the control does not address the requirement.
- **N/A** — the requirement does not apply to the scope (state why; N/A must be justified, not a dodge).

**Maturity — per domain or control (use when the target is posture/maturity, e.g., NIST CSF, COBIT):**
a 0–5 scale — **0 Non-existent · 1 Initial/Ad-hoc · 2 Repeatable but intuitive · 3 Defined
(documented & standardized) · 4 Managed & measurable (metrics/KPIs) · 5 Optimized (continuous
improvement)**. NIST CSF also uses **Tiers 1–4 (Partial → Risk-Informed → Repeatable → Adaptive)**;
CMMI/COBIT 2019 uses process capability levels. Pick one scale and apply it consistently; record both a
**current** and a **target** rating so the gap is the delta.

## Multi-framework control crosswalk

Assess a control **once** against a control **domain**, then read across to every framework in scope.
Use this to run a single assessment against several standards, and to cite the most specific criterion
per framework in the gap matrix. Codes are family/requirement/category anchors — drill into the named
domain reference for the specific control text.

| Control domain | COBIT 2019 | NIST CSF 2.0 | NIST 800-53 R5 | ISO/IEC 27002:2022 | PCI DSS v4.0 | SOC 2 TSC | CIS v8 | NIST 800-171 | HIPAA Security Rule |
|---|---|---|---|---|---|---|---|---|---|
| Governance, policy & risk management | EDM01-05, APO01, APO12, APO13 | GV.OC, GV.RM, GV.RR, GV.PO; ID.RA | PM, RA, PL | Cl.4-10; A.5.1-A.5.8 | Req 12 | CC1, CC2, CC3, CC5 | (program-level) | 3.11, 3.12 | §164.308(a)(1) |
| Asset management | BAI09 | ID.AM | CM-8, PM-5 | A.5.9-A.5.14 | Req 2, 9.5 | CC6.1 | 1, 2 | 3.4 | §164.310(d) |
| Access control & identity | DSS05, APO01 | PR.AA | AC, IA | A.5.15-A.5.18, A.8.2-A.8.5 | Req 7, 8 | CC6.1-CC6.3 | 5, 6 | 3.1, 3.5 | §164.312(a),(d); §164.308(a)(4) |
| Change & configuration management | BAI06, BAI07, BAI10 | PR.PS; ID.AM | CM, SA | A.8.9, A.8.32 | Req 6 | CC8.1 | 4, 16 | 3.4 | §164.308(a)(8) |
| Data protection & cryptography | DSS05, DSS06 | PR.DS | SC, MP | A.8.10-A.8.12, A.8.24 | Req 3, 4 | CC6.1; C1.1-C1.2 | 3 | 3.8, 3.13 | §164.312(a)(2)(iv),(e) |
| Network & communications security | DSS05 | PR.IR, PR.DS | SC-7, AC-4 | A.8.20-A.8.23 | Req 1 | CC6.6 | 12, 13 | 3.13 | §164.312(e)(1) |
| Vulnerability & patch management | DSS05, BAI03 | ID.RA, PR.PS | RA-5, SI-2 | A.8.8 | Req 6, 11 | CC7.1 | 7, 18 | 3.11, 3.14 | §164.308(a)(1)(ii) |
| Logging, monitoring & detection | DSS01, MEA01 | DE.CM, DE.AE | AU, SI-4 | A.8.15, A.8.16 | Req 10, 11 | CC7.1-CC7.2 | 8, 13 | 3.3 | §164.312(b) |
| Incident response | DSS02, DSS03 | RS, DE.AE | IR | A.5.24-A.5.28 | Req 12.10 | CC7.3-CC7.5 | 17 | 3.6 | §164.308(a)(6) |
| Business continuity, backup & DR | DSS04, DSS01 | RC; PR.IR | CP | A.5.29-A.5.30, A.8.13 | Req 12.10 | A1.1-A1.3 | 11 | §164.308(a)(7) |
| Physical & environmental security | DSS05 | PR.AA, PR.IR | PE | A.7.1-A.7.14 | Req 9 | CC6.4 | (n/a) | 3.10 | §164.310 |
| HR security, awareness & training | APO07 | PR.AT | AT, PS | A.6.1-A.6.8 | Req 12.6 | CC1.4, CC2.2 | 14 | 3.2, 3.9 | §164.308(a)(5) |
| Secure development (SDLC) | BAI03, BAI07 | PR.PS | SA, SI | A.8.25-A.8.31 | Req 6 | CC8.1 | 16 | 3.4, 3.13 | §164.308(a)(1) |
| Third-party / supply-chain risk | APO09, APO10 | GV.SC | SR, SA-9 | A.5.19-A.5.23 | Req 12.8, 12.9 | CC9.2 | 15 | 3.12 | §164.308(b), §164.314 |
| Application & processing-integrity controls | APO11, DSS06 | PR.DS | SI-10, SC | A.8.26 | Req 6.2 | PI1.1-PI1.5 | 16 | 3.14 | §164.312(c) |

Notes: CSF 2.0 functions are **GV, ID, PR, DE, RS, RC**; 800-171 families are the fourteen **3.x**
groups; SOC 2 common criteria are **CC1-CC9** plus category criteria **A / C / PI / P**. For AI scope,
crosswalk to **NIST AI RMF (Govern/Map/Measure/Manage), ISO/IEC 42001, and the EU AI Act** — see
`ai-audit.md`. HITRUST CSF already harmonizes HIPAA/ISO/NIST/PCI, so where HITRUST is the target, map
domains to its 14 control categories and use HITRUST as the single crosswalk spine.

## The assessment questionnaire (deliverable 1) — Excel/Word

A gap assessment is commonly delivered as **two artifacts**: an **assessment questionnaire** the entity
(or a vendor) answers, and the **control/gap matrix** that records the resulting gaps. Derive the
questionnaire directly from the target framework's requirement structure so every question traces to a
criterion. Columns: `# | Domain / Requirement Ref | Assessment Question | What Good Looks Like |
Evidence to Request | Response (Yes / No / Partial / N/A) | Notes / Gap`. Group by the framework's own
structure and make questions specific to the in-scope platform, applications, OS, and database where
given (e.g., "Is MFA enforced for all administrative access to the Oracle EBS application and the
Oracle 19c database?"). The questionnaire feeds the matrix: each "No/Partial" becomes a gap row.

## The gap assessment matrix (the deliverable 2) — Excel

One row per requirement (or per control-domain × framework), grouped by domain or by the framework's
own structure (PCI's 12 requirements, the 800-171 families, SOC 2 CC/A/C/PI, ISO 27002 themes, CSF
functions/categories). Columns:

1. Ref # (domain / group)
2. Requirement Ref (the framework's own ID — e.g., PCI 8.3.6, ISO A.8.5, CC6.1, AC-2, 3.1.1, GV.SC-04)
3. Requirement / Control Objective (what the framework expects)
4. Entity Process / System in scope
5. Current Control(s) in place
6. **Status** — Met / Partially Met / Not Met / N/A
7. **Maturity** — Current → Target (0-5 or CSF Tier), when maturity-rated
8. Evidence Reviewed (and IPE note)
9. **Gap Description** — design gap vs. coverage/implementation gap
10. Risk if Unremediated (H/M/L) — tie to the entity risk register
11. Recommendation / Remediation
12. **Priority** — P1/P2/P3 (or Quick win / Short / Medium / Long term)
13. Owner
14. Target Date
15. (optional) Cross-references — the other frameworks this row also satisfies (from the crosswalk)

Precede the matrix with a short **scoping section** (boundary, target framework & level, exclusions and
why, assessment date and method) and follow it with a **summary dashboard** (counts and % Met /
Partially Met / Not Met by domain; average maturity vs. target) and a **remediation roadmap**.

## Remediation roadmap

Group gaps by priority and sequence them; each item carries owner, target date, dependency, and the
requirement(s) it closes. Prioritize by **risk × effort**:
- **P1 / Quick wins & critical** — high risk, low effort, or a hard compliance blocker (e.g., MFA on
  admin access, disable shared accounts, enable audit logging).
- **P2 / Short-term** — high/medium risk needing project effort (formalize change management, deploy a
  SIEM use case, complete access recertification).
- **P3 / Medium-to-long-term** — foundational/program maturity (ISMS documentation, DR test program,
  vendor risk program build-out).

State residual risk after planned remediation, and note which gaps are **certification/authorization
blockers** for a certifiable/authorizable target (ISO 27001, PCI ROC, CMMC, FedRAMP) versus
maturity-improvement items.

## Framework-specific notes

- **SOC 2 readiness** — assess against the selected **Trust Services Categories** (Security is
  mandatory; add Availability/Confidentiality/Processing Integrity/Privacy as scoped); confirm CUECs
  the entity relies on from its own subservice organizations. See `itac-and-ipe.md`.
- **ISO 27001 readiness** — assess **both** the ISMS clauses (4-10: context, leadership, planning,
  support, operation, performance evaluation, improvement) **and** Annex A (27002:2022) controls; a
  Statement of Applicability with justified inclusions/exclusions is a required artifact.
- **PCI DSS** — first **scope the CDE** and confirm SAQ type vs. ROC before assessing the 12
  requirements; segmentation reduces scope. See `pci-dss-audit.md`.
- **CMMC / 800-171** — score against the **SPRS** methodology (110 practices, weighted deductions);
  document the SSP and POA&M. See `cmmc-audit.md`.
- **FedRAMP** — assess against the **NIST 800-53 Rev 5 baseline** for the impact level; define the
  authorization boundary; SSP/SAR/POA&M. See `fedramp-audit.md`.
- **NIST CSF / COBIT** — posture/maturity oriented: rate current vs. target profile by
  category/objective and report the maturity delta. See `nist-csf-audit.md`.
- **AI systems** — assess governance and system controls against **NIST AI RMF / ISO 42001 / EU AI
  Act** and classify EU AI Act risk tier. See `ai-audit.md`.
- **Third-party / vendor gap assessment** — assess a **vendor/service provider** against the entity's
  control expectations and the chosen standard using a vendor questionnaire — **CSA CAIQ/CCM, Vendor
  Security Alliance (VSA/VSAQ), or Shared Assessments SIG** — corroborated by the vendor's **SOC 2
  Type II** (scope, exceptions, CUECs, bridge letter), ISO 27001, or CSA STAR entry. Tier the vendor by
  inherent risk first (that sets questionnaire depth), and treat unimplemented CUECs and missing
  contractual/BAA terms as gaps. Full method, control refs (TPR1–TPR9), questionnaire, and audit
  program are in `third-party-risk-audit.md`.

## Common pitfalls

- **Marking "Met" from inquiry alone** — a gap assessment still inspects design evidence; do not accept
  "we have a policy" without seeing it deployed. Distinguish *policy exists* from *control operates*.
- **Unjustified N/A** — every N/A must have a scoping reason tied to the entity's risk/architecture.
- **Design vs. coverage gaps conflated** — a control that exists in one business unit but not others is
  a *coverage* gap, not a design gap; remediation differs.
- **Citing a vague criterion** — cite the specific requirement ID from the crosswalk, not "best
  practice."
- **Claiming operating effectiveness** — a gap assessment does not test over a period; recommend a
  follow-on audit/examination for TOE where assurance is needed.

## Output format

- The **gap matrix** is inherently tabular → **Excel (.xlsx)**, one sheet per framework/domain.
- A **readiness report** (scope, method, summary dashboard, roadmap, per-domain narrative) for a
  sponsor → **Word (.docx)**.
- Quick "where are the gaps vs. X" answers → inline table.
See "Choosing the output format" in `SKILL.md`.
