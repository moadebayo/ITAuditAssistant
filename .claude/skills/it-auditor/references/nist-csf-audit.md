# NIST Cybersecurity Framework (CSF) — IS Audit / Assurance Program

A cybersecurity audit program structured on the **NIST Cybersecurity Framework** (the ISACA IS Audit/
Assurance Program approach). Use to audit an organization's cybersecurity posture end-to-end. The
framework organizes controls into functions → categories → subcategories; each subcategory is a control
to test, and each maps to **COBIT 5** processes and **ISO/IEC 27001** Annex A controls (cite these as
criteria). CSF 2.0 adds a sixth **Govern** function; the classic five below come from the source
program — add Govern where the client uses 2.0.

## Workpaper columns (per subcategory)
Process Sub-Area | Ref. Risk | Control Objective | Control (subcategory) | Control Type (automated/
technical, manual/administrative, physical) | Control Classification (preventive/detective/corrective)
| Control Frequency | Testing Step | NIST→COBIT 5 ref | Additional COBIT 5 ref | Framework/Standard ref
(ISO) | Workpaper ref | Pass/Fail | Comments. Use the same structure for a multi-year coverage view
(which function was audited in which year) if tracking an audit universe.

## The functions, categories, and what to test

### IDENTIFY — understand the organization, assets, and risk
- **Asset Management** — inventory of hardware/devices, software platforms & applications; data flows
  mapped; external information systems cataloged; resources prioritized by classification/criticality/
  business value; cybersecurity roles/responsibilities (incl. third parties) established. *Test*: obtain
  inventories and confirm completeness, ownership, and criticality ranking.
- **Business Environment** — the org's role in the supply chain and critical infrastructure identified;
  mission/objectives/stakeholders prioritized; dependencies and critical functions for service delivery
  established (from BCP/DR/BIA and risk assessments).
- **Governance** — security policy established; roles/responsibilities aligned with internal/external
  requirements; legal/regulatory requirements understood; governance/risk processes address cyber risk.
- **Risk Assessment** — asset vulnerabilities identified; threat intelligence received; threats
  (internal/external) identified; business impact and likelihood determined; risks prioritized.
- **Risk Management Strategy** — risk management processes established, managed, and agreed; risk
  tolerance defined; tolerance informed by role in critical infrastructure.

### PROTECT — safeguard delivery of services
- **Access Control** — identities/credentials managed for authorized devices/users; **physical access**
  managed/protected; **remote access** managed; access permissions enforced with **least privilege** and
  **separation of duties**; **network integrity** protected (segregation/segmentation — VLAN/DMZ).
- **Awareness & Training** — all users informed and trained; **privileged users**, **third parties**,
  **senior executives**, and **physical/information-security personnel** understand their roles.
- **Data Security** — data-at-rest and data-in-transit protected; assets managed through removal/
  transfer/disposition; capacity adequacy; protection against data leaks; integrity-checking; separate
  development/test/production environments.
- **Information Protection Processes & Procedures** — baseline configuration/hardening; SDLC; change-
  control; backups; policy/regulatory compliance for the physical environment; data destruction;
  continuous improvement; response/recovery plans in place; incident/DR plans tested.
- **Maintenance** — remote and on-site maintenance performed, logged, and approved with controls.
- **Protective Technology** — audit/log records determined, documented, implemented, and reviewed;
  removable media protected; least-functionality (deny-by-default); communications/control networks
  protected.

### DETECT — identify cybersecurity events
- **Anomalies & Events** — a **baseline** of network operations/expected data flows established;
  detected events analyzed (attack targets/methods); event data **aggregated & correlated** from
  multiple sources/sensors (SIEM — see `siem-and-logging-audit.md`); event impact determined; **alert
  thresholds** established.
- **Security Continuous Monitoring** — network, **physical environment**, and **personnel activity**
  monitored; **malicious code** and **unauthorized mobile code** detected; external service-provider
  activity monitored; monitoring for unauthorized users/devices/software; vulnerability scans performed.
- **Detection Processes** — roles/responsibilities for detection defined; detection activities comply
  with requirements; detection tested; event detection communicated; processes continuously improved.

### RESPOND — take action on detected incidents
- **Response Planning** — the incident response plan is executed during/after an event.
- **Communications** — personnel know their roles and order of operations; events reported per criteria;
  information shared per plans; coordination with stakeholders; voluntary information sharing for broader
  situational awareness.
- **Analysis** — detection notifications investigated; incident impact understood; **forensics**
  performed; incidents categorized per the plan.
- **Mitigation** — incidents contained and mitigated; newly identified vulnerabilities mitigated or
  documented as accepted risks.
- **Improvements** — response plans incorporate lessons learned; response strategies updated.

### RECOVER — restore capabilities/services
- **Recovery Planning** — the recovery plan is executed during/after an event.
- **Improvements** — recovery plans incorporate lessons learned; recovery strategies updated.
- **Communications** — public relations managed; reputation repaired after an event; recovery activities
  communicated to internal stakeholders, executives, and management.

## How to run a CSF-based cybersecurity audit
1. Scope which functions/categories are in play; build the subcategory workpaper.
2. For each subcategory, capture the control, its type/classification/frequency, and write the testing
   step (inspect policy/config, observe, interview, sample evidence).
3. Cite the mapped **COBIT 5** process and **ISO 27001** Annex A control as criteria.
4. Record Pass/Fail per subcategory and roll up to a function-level posture view; track multi-year
   coverage if maintaining an audit universe.

## Common CSF findings
Incomplete asset inventory / no criticality ranking; least-privilege and SoD not enforced; no network
segmentation; awareness training missing for privileged users/executives; no baseline for anomaly
detection; event data not correlated (SIEM gaps); incident response plan untested; no forensics
capability; recovery plans not updated with lessons learned.
