# CMMC Audit / Assessment (Cybersecurity Maturity Model Certification)

Audit and readiness assessment against the DoD's CMMC program, which protects **Federal Contract
Information (FCI)** and **Controlled Unclassified Information (CUI)** across the Defense Industrial Base
(DIB). CMMC verifies implementation of the NIST SP 800-171 (and, at the top level, 800-172) security
requirements. Combine with `infrastructure-audit.md`, `frameworks.md` (NIST), and the finding/report
templates in `engagement-documents.md`.

> Currency note (early 2026): The CMMC **Program Rule** (32 CFR Part 170) took effect December 2024; the
> **Acquisition/Clause Rule** (48 CFR; DFARS 252.204-7021 clause and -7025 notice) became effective
> **November 10, 2025**, starting a phased rollout through **November 10, 2028**. Verify the current
> phase, level thresholds, and any rule updates before finalizing an assessment — this area is moving.

## Core concepts
- **FCI vs. CUI** — FCI is basic non-public contract information; CUI is more sensitive government
  information requiring safeguarding and marking. The type of data you handle drives the required level.
- **OSA / OSC** — Organization Seeking Assessment / Certification (the contractor being assessed).
- **C3PAO** — Certified Third-Party Assessment Organization (performs Level 2 certification
  assessments). **DIBCAC** — Defense Industrial Base Cybersecurity Assessment Center (performs Level 3).
- **SPRS** — Supplier Performance Risk System, where scores and annual affirmations of continuous
  compliance are posted. Each assessment gets a unique ID (UID) tied to the covered system(s).
- **SSP** — System Security Plan (documents how each requirement is implemented). **POA&M** — Plan of
  Action & Milestones (tracks gaps to remediate).
- **Flowdown** — prime contractors must flow the appropriate CMMC level down to subcontractors handling
  FCI/CUI.

## The three levels
- **Level 1 (Foundational)** — for **FCI**. The **15 basic safeguarding requirements** from FAR
  52.204-21. **Annual self-assessment** + annual affirmation in SPRS. **No POA&M permitted** — all
  requirements must be fully met at assessment.
- **Level 2 (Advanced)** — for **CUI**. The **110 requirements of NIST SP 800-171** (assessed per
  NIST SP 800-171A). Either an **annual self-assessment** or a **C3PAO assessment every 3 years**,
  depending on the contract. Limited POA&M allowed for certain requirements, remediated within **180
  days**.
- **Level 3 (Expert)** — for high-value CUI. All Level 2 requirements **plus 24 selected requirements
  from NIST SP 800-172**. Assessed by **DIBCAC**.

## NIST SP 800-171 requirement families (Level 2 backbone)
The 110 requirements sit in **14 families** — test each as a control area:
Access Control (AC); Awareness & Training (AT); Audit & Accountability (AU); Configuration Management
(CM); Identification & Authentication (IA); Incident Response (IR); Maintenance (MA); Media Protection
(MP); Personnel Security (PS); Physical Protection (PE); Risk Assessment (RA); Security Assessment (CA);
System & Communications Protection (SC); System & Information Integrity (SI).

These map closely to ITGC/infrastructure control areas — reuse the test techniques in
`infrastructure-audit.md` and `itgc.md`, measured against the specific 800-171 requirement as the
criterion.

## SPRS scoring (Level 2 self-assessment)
Level 2 uses the **DoD Assessment Methodology**: start at **110**, subtract weighted points (1, 3, or 5)
for each unmet requirement; the maximum score is 110 and can go negative. Some requirements are worth 5
points (highest risk). Report the score, the SSP, and the assessment date in SPRS. A perfect score
requires all 110 met; where a POA&M is allowed, the item still deducts until closed.

## How to run a CMMC readiness/gap assessment
1. **Define scope / identify FCI & CUI** — inventory all information systems that process, store, or
   transmit FCI or CUI; map CUI data flows; determine the **CMMC level** required by the contract(s).
   Scope the assessment boundary (in-scope assets, security protection assets, CUI enclaves, external
   service providers / cloud). A well-scoped CUI enclave reduces the assessed footprint.
2. **Benchmark controls** — assess implementation of each applicable requirement (15 for L1; 110 for L2;
   +24 for L3) against NIST SP 800-171A assessment objectives. For each requirement gather evidence:
   examine (policy/config), interview (personnel), and test (observe/reperform).
3. **Document** — produce/validate the **SSP** (every requirement's implementation) and a **POA&M** for
   gaps (noting L1 allows none, and L2 POA&M items must close within 180 days).
4. **Score & affirm** — compute the SPRS score (L2); confirm annual affirmation of continuous
   compliance and the SPRS UID per covered system.
5. **Flowdown** — verify subcontractors handling FCI/CUI hold the appropriate CMMC level.
6. **Cloud & external providers** — CUI in the cloud generally requires **FedRAMP Moderate (or
   equivalent)**; external service providers must meet applicable requirements. (See
   `fedramp-audit.md`.)

## Deliverables
CMMC readiness/gap report (requirement-by-requirement status: Met / Not Met / N/A with evidence and
gaps), SSP, POA&M, and an SPRS score summary. Use the finding/CCCER structure for each gap, citing the
specific 800-171 requirement (e.g., "3.5.3 — multifactor authentication") as the criterion.

## Common CMMC findings
CUI/FCI not inventoried or scoped; MFA not implemented for network/privileged access (3.5.3); missing
or stale SSP; incomplete audit logging (AU family); no FIPS-validated encryption for CUI at rest/in
transit; external cloud handling CUI without FedRAMP Moderate equivalence; POA&M items open beyond 180
days; no annual affirmation in SPRS; subcontractor flowdown not verified; incident response plan not
tested; separation-of-duties and least-privilege gaps (AC family).
