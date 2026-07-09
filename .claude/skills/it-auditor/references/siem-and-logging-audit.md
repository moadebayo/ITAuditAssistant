# SIEM & Security Logging/Monitoring Audit

Audit of an enterprise Security Information and Event Management (SIEM) capability and the underlying
security log management across systems. Combine with `itgc.md` (IT5.08/IT5.09 logging/monitoring) and
`frameworks.md` (NIST CSF Detect function). This domain has three layers: **governance**, **log
management at the source systems**, and the **SIEM tool itself**.

## What a SIEM does (so you can test whether it does it)
A SIEM **collects, aggregates, normalizes, and archives** security event logs from across the
environment, and provides **correlation, real-time alerting, forensic analysis, and reporting**. The
audit assesses whether logs are complete and reliable at the source, whether the SIEM is deployed and
configured to actually detect and escalate events, and whether security events are handled.

## Layer 1 — Security Event Governance
- **Policies, standards & procedures**: security event management is supported by documented standards,
  processes, and procedures; risk principles drive what is logged and how events are handled. Without
  these, monitoring is inconsistent and gaps go undetected.
- **Asset prioritization / risk analysis**: business and IT risk analysis is performed periodically to
  prioritize information assets (data, applications, servers, databases, OS) by value and criticality
  and by regulatory requirements (e.g., PCI, data-privacy laws). Logging scope should follow this
  prioritization. *Test*: obtain the documented asset inventory/criticality ranking and confirm the
  in-scope log sources map to the critical assets.

## Layer 2 — Security Log Management (at the source systems)
Each critical log source should have **documented logging procedures**, be **configured to log
security events** in line with policy and regulation, and have **access to the log files restricted**
so logs can't be tampered with. Test coverage across source types:
- **Critical servers** — OS-level security event logging enabled and protected.
- **Critical business applications** — application security/audit logging enabled and protected.
- **Anti-virus / anti-malware** — logs captured and reviewed regularly; suspicious activity
  investigated and resolved.
- **Network devices — firewalls, routers, switches, IDS/IPS** — configured to log security events;
  log-file access restricted.
For each: confirm the logging procedure exists, sample the configuration to confirm logging is on and
captures the right events, confirm log integrity/access restriction, and confirm review where the
control relies on review. IPE-test any log extract used as evidence.

## Layer 3 — SIEM Tool Implementation & Management
- **Deployment & configuration**: the SIEM is deployed to collect/aggregate/normalize/archive logs from
  the prioritized sources, with correlation rules, alerting, and reporting configured. *Test*: obtain
  the list of onboarded log sources and reconcile to the critical-asset inventory (completeness of
  coverage); review correlation/alert rule configuration; confirm real-time alerting works (sample
  alerts).
- **Access to the SIEM (IT8.03)**: logical access to the SIEM tool and its configuration is restricted
  to authorized security administrators to prevent unauthorized changes and protect sensitive data.
  *Test*: obtain the SIEM admin/user listing (IPE-test) and confirm least privilege.
- **Event handling (IT8.04)**: security events are identified, escalated, and remediated per the
  security-event-handling policy. *Test*: obtain the population of security events/alerts in the
  period; sample; trace each through triage → escalation → resolution against SLA.
- **SIEM server hardening & patching (IT8.05)**: SIEM servers hardened and patched per policy (see
  `infrastructure-audit.md` for baseline testing).
- **Staff competency (IT8.06)**: personnel responsible for the SIEM are appropriately trained.
- **Log retention & backup (IT8.07)**: security event logs are periodically backed up, kept offline,
  and retained per the data-retention policy and regulatory requirements (PCI DSS requires ≥12 months,
  with ≥3 months immediately available; data-privacy laws may impose more).

## Time synchronization (cross-cutting)
All log sources and the SIEM must use synchronized time (**NTP** from authoritative sources) so events
correlate correctly and timestamps are reliable evidence. Confirm NTP is configured consistently.

## How to run a SIEM audit
1. Obtain the security-event governance policies/standards and the asset criticality inventory.
2. Reconcile SIEM-onboarded sources to critical assets → identify **coverage gaps** (the most common
   and material SIEM finding).
3. For each source type, confirm logging config, protection, and review.
4. Test SIEM access, correlation/alerting, event handling (end-to-end on a sample), hardening,
   retention, and staff training.
5. Conclude on whether the organization can reliably detect, escalate, and respond to security events.

## Common SIEM findings
Critical assets not onboarded to the SIEM (incomplete coverage); log sources not configured to capture
required security events; log-file access not restricted (tamper risk); alerts generated but not
triaged/escalated within SLA; SIEM admin access too broad; logs not retained for the required period;
no periodic asset-criticality/risk analysis driving logging scope; inconsistent time synchronization.
