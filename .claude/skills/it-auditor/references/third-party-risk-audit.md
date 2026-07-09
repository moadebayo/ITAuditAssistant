# Third-Party / Vendor Risk Audit & Assessment

The dedicated reference for **third-party / vendor / supply-chain assurance**: assessing and auditing
the security and control posture of vendors, service providers, SaaS/cloud providers, and their own
subservice ("fourth-party") providers. Use it for a **vendor risk assessment / questionnaire**, a
**vendor gap assessment**, or a full **third-party audit** (RCM, audit program, observation memo,
report). It complements the TPRM summary in `sdlc-dr-physical-tprm.md` (§4) with the common
vendor-assurance frameworks and questionnaires and the full deliverable set.

Read this for anything naming a **vendor, supplier, service provider, third party, TPRM, supply chain,
CSA / CCM / CAIQ / STAR, Vendor Security Alliance (VSA), Shared Assessments SIG, SOC 2 reliance, ISO
27036, or NIST 800-161**. Combine with `itac-and-ipe.md` (SOC 1/SOC 2 review), `gap-assessment.md`
(method + crosswalk), and the relevant platform reference (e.g., `cloud-and-emerging.md` for a cloud
vendor).

## Why third-party risk

A third party can process, store, or transmit the entity's data, or connect to its network, yet sits
outside its direct control. Third parties are involved in a large share of breaches, so the entity
remains **accountable** for risk it has **outsourced but not transferred**. Regulatory drivers:
OCC 2013-29 / interagency third-party risk guidance (2023), FFIEC outsourcing guidance, HIPAA/HITECH
Business Associate requirements, PCI DSS Req 12.8/12.9, GDPR Art. 28 (processors), and NIST SP 800-161
(C-SCRM). The objective: obtain assurance that each vendor's controls, by design and operation, protect
the entity's data and the availability of the outsourced service commensurate with its risk.

## Common frameworks, standards & questionnaires

- **CSA Cloud Controls Matrix (CCM v4)** — the cloud control framework: **197 control objectives across
  17 domains** (e.g., IAM, Data Security & Privacy Lifecycle (DSP), Cryptography Encryption & Key Mgmt
  (CEK), Threat & Vulnerability Mgmt (TVM), Logging & Monitoring (LOG), Security Incident Mgmt (SEF),
  Business Continuity (BCR), Supply Chain (STA), Application & Interface Security (AIS), Governance
  (GRC)). Mapped to ISO 27001/27002/27017/27018, NIST 800-53, PCI DSS, SOC 2, and more.
- **CSA CAIQ (Consensus Assessments Initiative Questionnaire)** — the yes/no questionnaire form of the
  CCM; the standard cloud-vendor self-assessment.
- **CSA STAR** — the assurance registry: **Level 1** (self-assessment: CAIQ published to the STAR
  registry), **Level 2** (third-party audit — STAR Certification against ISO 27001, or STAR Attestation
  against SOC 2 + CCM), **Level 3** (continuous). Checking the STAR registry is a due-diligence step.
- **Vendor Security Alliance (VSA)** — the **VSAQ** questionnaires: **VSA-Core** (a focused annual
  baseline) and **VSA-Full** (comprehensive). Used to standardize vendor security reviews.
- **Shared Assessments** — the **SIG (Standardized Information Gathering)** questionnaire (SIG Core /
  SIG Lite, scoped by risk tier) and the **SCA (Standardized Control Assessment)** procedures for
  on-site/validation testing.
- **SOC 1 / SOC 2 (AICPA)** — the most common vendor-provided attestation. Rely on a **SOC 2 Type II**
  where available; review scope, period, opinion, exceptions, **CUECs (complementary user-entity
  controls)**, and subservice organizations (carve-out vs. inclusive). Use a **bridge/gap letter** to
  cover the gap between the SOC period end and the entity's reliance date. Full method in
  `itac-and-ipe.md`.
- **ISO/IEC 27001 / 27002** — vendor ISMS certification; **ISO/IEC 27036** — information security for
  **supplier relationships**; **ISO 27017/27018** — cloud and cloud-PII controls.
- **NIST SP 800-161 (C-SCRM)** and **NIST CSF 2.0 GV.SC** — cyber supply-chain risk management program
  criteria.
- **Security ratings** — BitSight, SecurityScorecard, and similar provide continuous outside-in ratings
  used to prioritize and monitor vendors (corroborating, not sufficient on their own).

## TPRM lifecycle (what to test / assess)

1. **Governance & program** — a TPRM policy defining board/management roles, risk appetite, and a
   central vendor inventory; a defined assessment methodology and RACI.
2. **Inherent-risk tiering** — classify each vendor **before** diligence by data sensitivity (PII/PHI/
   CHD), business criticality, access (network/privileged), volume, and regulatory exposure into
   **Critical / High / Medium / Low**. Tier drives questionnaire depth (SIG Core vs. SIG Lite; VSA-Full
   vs. Core), evidence required, and reassessment cadence.
3. **Due diligence & onboarding** — collect and review the assessment questionnaire (CAIQ/VSA/SIG),
   attestations (**SOC 2**, ISO 27001, PCI AOC), financial/reputational checks, and a data-flow/scope
   confirmation; validate the STAR registry entry for cloud vendors.
4. **Contracting** — security & privacy schedule, **right-to-audit** clause, breach-notification SLA,
   data-handling/return/destruction, **subservice/fourth-party** flow-downs, service levels, and — for
   healthcare — a **Business Associate Agreement (BAA)**; for EU personal data, an **Art. 28 DPA**.
5. **Ongoing monitoring** — periodic reassessment by tier, annual SOC 2 refresh + bridge letter,
   security-rating trending, SLA/incident review, and re-tiering on scope change.
6. **Offboarding / exit** — data return/destruction attestation, access revocation, and exit/continuity
   provisions; test that offboarding actually occurred.

## Assessment questionnaire (deliverable 1)

Derive questions from CSA CAIQ / VSA / SIG, scoped to the vendor's inherent-risk tier, and map each to a
framework reference. Columns:

`# | Domain (e.g., CCM IAM / DSP / TVM) | Assessment Question | Framework Ref (CCM / ISO / SOC 2 TSC /
NIST) | Evidence to Request | Response (Yes / No / Partial / N/A) | Notes / Gap`

Cover the vendor-risk domains: governance & risk; identity & access (incl. privileged and SSO/MFA);
data protection & encryption (in transit/at rest, key management); secure SDLC & change; vulnerability
& patch management and penetration testing; logging, monitoring & threat detection; incident response &
**breach notification**; business continuity & DR; **subservice/fourth-party** management and
concentration risk; physical & environmental; HR security & awareness; and compliance & certifications
(SOC 2, ISO 27001, PCI, STAR). "What good looks like" and "evidence to request" make each question
testable rather than a yes/no checkbox.

## Vendor Risk & Control Matrix (deliverable 2)

One row per control activity, grouped by domain, with the vendor-control reference scheme below.
Columns: `Ctrl Ref | Control Domain | Control Objective | Key Risk Addressed | Framework Ref (CCM/ISO/
SOC 2/NIST) | Expected Control Activity (at the vendor) | Questionnaire Ref | Type (P/D) | Nature (M/A) |
Risk (H/M/L) | Conclusion (default "TBD – not yet validated") | Evidence / IPE`.

Control reference scheme (adapt as needed):

| Ref | Domain | Example control objective |
|---|---|---|
| TPR1 | Governance & program | A TPRM program governs vendor risk end-to-end with defined ownership. |
| TPR2 | Inherent-risk tiering & due diligence | Vendors are risk-tiered and assessed proportionate to risk before onboarding. |
| TPR3 | Contracts & SLAs | Contracts include security, privacy, right-to-audit, breach-notification, and exit terms. |
| TPR4 | Vendor access & data protection | Vendor access to entity data/systems is least-privilege; data is encrypted in transit and at rest. |
| TPR5 | Vendor security controls (via SOC 2 / questionnaire) | The vendor operates effective access, change, ops, and monitoring controls (evidenced by SOC 2 Type II / assessment). |
| TPR6 | Subservice / fourth-party | The vendor manages its own subservice providers; CUECs and carve-outs are addressed. |
| TPR7 | Incident & breach notification | The vendor detects, responds to, and notifies the entity of incidents within the SLA. |
| TPR8 | Business continuity, DR & exit | The vendor can recover service; data return/destruction on exit is assured. |
| TPR9 | Ongoing monitoring & compliance | Vendors are periodically reassessed; certifications (SOC 2, ISO, PCI, STAR) are current. |

## Audit program (test procedures)

For each control, follow the skill's Interview → Test of Control → Conclusion pattern:
1. **Interview / Inquiry** — the vendor manager and control owner: how vendors are tiered, assessed,
   contracted, and monitored.
2. **Test of Control** — obtain a **system-generated, complete vendor inventory** and IPE-test it
   (completeness/accuracy); select a risk-based sample of vendors (weighted to Critical/High tiers) and,
   per vendor, inspect: the completed **CAIQ/VSA/SIG**, the **SOC 2 Type II** (scope, period, opinion,
   **exceptions**, **CUECs**, subservice treatment) and **bridge letter**, the executed contract for the
   required clauses (right-to-audit, breach SLA, BAA/DPA where applicable), evidence of the
   inherent-risk tiering, and the most recent monitoring/reassessment. For a **direct vendor audit**
   under a right-to-audit clause, reperform selected control tests at the vendor.
3. **Conclusion** — conclude on whether each control is designed and (where testable) operating
   effectively; a CUEC the entity has not implemented, an expired/qualified SOC 2, a missing BAA, or an
   untiered critical vendor are exceptions.

Evidence / IPE: the vendor inventory, the change/access populations underlying a direct audit, and any
report relied on must pass completeness/accuracy validation.

## Engagement deliverables

Produce these using the standard templates, with third-party specifics from this reference:
- **RCM** — the Vendor Risk & Control Matrix above (Excel). See `deliverable-templates.md` §1.
- **Assessment questionnaire** — deliverable 1 above (Excel/Word).
- **Audit program** — the test procedures above (Excel/Word). See `deliverable-templates.md` §2.
- **Observation memo & audit report** — CCCER findings and the report, with vendor-risk criteria (CCM/
  ISO/SOC 2). See `engagement-documents.md` §4–§5.
- **RFI / PBC** — request the vendor inventory, tiering, questionnaires, SOC 2s + bridge letters,
  contracts, and monitoring evidence. See `engagement-documents.md` §3.

## Common findings

Critical vendors not risk-tiered; no SOC 2 obtained (or expired/qualified, or no bridge letter) for a
critical vendor; **CUECs** identified in a SOC 2 not implemented by the entity; missing right-to-audit
or breach-notification clause; no BAA for a PHI vendor / no DPA for EU personal data; vendor inventory
incomplete (shadow SaaS); subservice/fourth-party and concentration risk not considered; reassessment
overdue; offboarding not evidenced (access or data not removed).
