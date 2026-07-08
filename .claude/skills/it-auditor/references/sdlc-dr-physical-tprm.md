# SDLC, Disaster Recovery, Physical Security, Third-Party Risk & HIPAA

Grouped operational-audit domains. Combine with `itgc.md` and `deliverable-templates.md`.

## 1. SDLC / Project audit
Risk: systems developed/implemented without adequate governance, requirements, testing, or security →
unreliable processing, cost/schedule overruns, insecure systems.

Audit by SDLC phase:
- **Project management / governance**: business case and approval; steering committee/oversight;
  budget/schedule tracking; documented methodology (waterfall/agile); risk & issue logs.
- **Initiation / requirements**: business & functional requirements documented, prioritized, and
  **approved** by business owners; security & control requirements included from the start.
- **Detailed design & coding**: design reviewed/approved; secure coding standards; code review; data
  conversion/migration approach defined; environments separated (DEV/TEST/PROD).
- **Testing**: test plans and cases with **expected results** prepared by business owners; unit /
  system / integration / performance / security testing; **UAT** performed and signed off; defects
  triaged and resolved; test data doesn't expose production sensitive data (masking).
- **Implementation / go-live**: implementation & **rollback** plan; go/no-go approval; data-conversion
  reconciliation; production access granted appropriately; training/documentation; **post-
  implementation review** confirms objectives met.

Tie SDLC controls back to change management (IT8/IT9) for financially-significant systems.

## 2. Disaster Recovery (DR) & Backup audit
Risk: inability to recover systems/data within business tolerances after a disruption.
- **BIA (Business Impact Analysis)**: critical systems identified with **RTO** (recovery time
  objective) and **RPO** (recovery point objective) defined and approved.
- **DR plan**: documented, current, roles assigned, includes call trees, recovery procedures, and
  dependencies; alternate/recovery site (hot/warm/cold) or cloud DR appropriate to RTO.
- **DR testing**: tested at least annually (tabletop and/or failover); results documented; gaps
  remediated; test demonstrates RTO/RPO can be met.
- **Backups** (ties to IT3): scheduled per policy; monitored for success; **restore testing** performed
  periodically (a backup you can't restore is not a control); off-site/immutable copies; retention per
  policy and regulation; backup media/repositories access-restricted and encrypted.
- **Resilience**: redundancy (power, network), failover, and monitoring.

## 3. Physical & environmental security audit (ties to IT4)
Risk: unauthorized physical access, theft, or environmental damage to processing facilities.
- **Physical access control**: badge/biometric entry to data center; access granted with IT management
  approval and least privilege; **access revoked on separation**; visitor logging/escort; access list
  reviewed/recertified periodically.
- **Access logging & monitoring**: entry logged; CCTV; logs reviewed for unauthorized access to
  sensitive areas; access to administer the badge system restricted.
- **Fire, electrical & environmental controls**: fire detection & suppression (e.g., clean-agent);
  UPS + generator (tested); redundant HVAC/cooling; temperature/humidity monitoring; water/leak
  detection; raised floors/cable management; no combustible storage.
- **Equipment**: secure disposal of media/hardware (wipe/destroy); asset tracking.

## 4. Third-Party Risk Management (TPRM) audit
Risk: third parties introduce compliance, strategic, operational, transactional, and reputational risk
(41–63% of breaches involve third parties). Regulatory drivers include OCC 2013-29 / OCC guidance,
HIPAA/HITECH (HHS), and state data-breach laws.

Vendor lifecycle controls to test:
- **Policy & governance**: TPRM policy defining board/management responsibilities, the vendor
  lifecycle, risk assessment, due diligence, contract standards, and monitoring; regulatory
  requirements addressed.
- **Planning**: inherent risk of the relationship identified; strategic purpose, complexity (volume,
  subcontractors, technology), risk/benefit, legal/regulatory impact, and security implications
  assessed before onboarding.
- **Due diligence & selection**: before onboarding, evidence of review of financial condition;
  information security, IR, DR, and change management; incident history; reputation; risk-management
  practices and **third-party reports (SOC 2, ISO 27001, PCI DSS)**; HR practices (background checks);
  reliance on subcontractors (4th parties); insurance.
- **Contracts**: scope/SLAs; **right-to-audit** clause; compliance with laws; data ownership/
  confidentiality/integrity; business resumption/contingency; insurance & liability limits;
  breach/incident notification; subcontractor/4th-party terms; NDAs; termination/exit.
- **Ongoing monitoring**: **vendor tiering** by criticality/data sensitivity; assessment framework
  (NIST CSF, ISO 27001, VSA, CSA, FFIEC); annual assessment plan; obtain key artifacts (contracts,
  SOC 2/PCI/ISO, DR/IR test results, pen-test reports); assess controls against the framework;
  identify & classify exceptions; quantify **residual risk**; agree action plans and track; management
  chooses risk treatment (**accept, transfer/share, mitigate, avoid**).

## 5. HIPAA Security audit
Scope: protection of **electronic Protected Health Information (e-PHI)** under the HIPAA Security Rule —
confidentiality, integrity, availability. Three safeguard categories:

- **Administrative safeguards**: security management process (risk analysis & risk management);
  assigned security responsibility (a named Security Officer); workforce security & training;
  information access management (role-based, least privilege); periodic evaluation of policies.
- **Physical safeguards**: facility access controls; workstation & device security (password
  protection, automatic logoff); device & media controls (secure disposal/re-use of media holding
  e-PHI).
- **Technical safeguards**: access control (unique IDs, emergency access, auto-logoff, encryption/
  decryption); **audit controls** (log & monitor e-PHI activity); **integrity controls** (protect
  e-PHI from improper alteration/destruction); **authentication**; **transmission security**
  (encryption in transit).

Method: document review (policies vs. HIPAA requirements) + system inspection (config vs. policy) +
interviews (staff awareness/training) + physical inspection; report vulnerabilities and non-compliance
with recommendations; re-audit to confirm remediation. HIPAA maps well to HITRUST CSF (a certifiable
framework covering the HIPAA Security Rule — see `frameworks.md`).

## Common findings across these domains
Requirements/UAT not signed off by business; developers implementing to production; no DR test or no
restore test; RTO/RPO undefined; physical access not revoked on separation and not recertified; no
generator/UPS test; missing right-to-audit clause and no SOC 2 obtained for critical vendors; no vendor
tiering; HIPAA risk analysis stale; e-PHI not encrypted in transit/at rest; no audit logging of e-PHI.
