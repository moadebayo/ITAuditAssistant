# Cloud & Virtualization Audit (AWS, Azure, GCP, VMware)

Combine with `itgc.md` (control objectives) and `frameworks.md` (CSA CCM, CIS benchmarks). Cloud
shifts *how* controls are implemented, not the control objectives.

## Shared Responsibility Model (the anchor concept)
The cloud provider secures the cloud **infrastructure**; the customer secures what they put **in** the
cloud. The split shifts by service model:
- **IaaS** (e.g., EC2/VMs): customer owns OS, apps, data, IAM, network config, encryption. Most
  customer responsibility.
- **PaaS** (e.g., managed DB, app services): provider manages the OS/runtime; customer owns data,
  access, and app-level config.
- **SaaS**: provider manages almost everything; customer owns data, user access/identity, and config
  choices exposed to them.
Always establish the service model first — it determines which controls the customer (your auditee) is
even responsible for.

## Deployment models
Public / Private / Hybrid / Community. Note where regulated data resides and applicable data-residency
requirements.

## Cloud risk lenses
- **Compliance** (data residency, regulatory scope in the cloud), **Strategic** (lock-in, provider
  viability), **Operational** (availability, misconfiguration — the #1 cloud breach cause), **Market/
  finance** (cost, provider concentration). A **CASB** (Cloud Access Security Broker) can enforce
  visibility, DLP, and access policy across cloud services.

## Universal cloud audit areas (any provider)
1. **Governance** — cloud strategy/policy, account/subscription structure, ownership, tagging,
   guardrails (org-level policies), and a documented shared-responsibility understanding.
2. **Identity & access (IAM)** — least privilege; no use of the root/global-admin for daily work; MFA
   everywhere (especially admins/root); federation/SSO; key rotation; no long-lived access keys where
   avoidable; periodic access review.
3. **Network configuration** — segmentation (VPC/VNet), security groups/NSGs least-privilege (no
   0.0.0.0/0 to sensitive ports), no unintended public exposure, private endpoints, WAF/DDoS.
4. **Asset configuration** — hardened baselines (CIS Benchmarks), no public storage buckets, resource
   inventory, drift detection.
5. **Data protection** — encryption at rest (managed keys/KMS) and in transit (TLS); key management;
   data classification; backup.
6. **Logging & monitoring** — cloud-native audit logs enabled across all regions/accounts, centralized
   and protected, alerting, reviewed.
7. **Incident response** — cloud-aware IR plan, roles, and tested runbooks.
8. **Business continuity / DR** — multi-AZ/region as required; backup and restore tested.

## AWS specifics
- **Identity**: root account locked down (hardware MFA, no access keys, not used day-to-day); IAM
  users/roles least-privilege; prefer roles over long-lived keys; **IAM Access Analyzer**; enforce MFA;
  review with **Credential Report** and **IAM Access Advisor**.
- **Logging**: **CloudTrail** enabled in **all regions**, log-file validation on, delivered to a
  restricted S3 bucket + CloudWatch; **AWS Config** for configuration history/rules; **GuardDuty** for
  threat detection; **Security Hub** for CIS/standards posture.
- **Network**: Security Groups & NACLs least-privilege; no open management ports (22/3389) to
  0.0.0.0/0; VPC Flow Logs on.
- **Data**: **S3 Block Public Access** on; buckets encrypted (SSE-KMS) and not public; **KMS** key
  policies restricted and rotation on; EBS/RDS encryption on.
- **Governance**: **AWS Organizations** with **SCPs** (guardrails); billing/cost controls;
  multi-account structure.
- Evidence: AWS console, CLI (`aws iam get-credential-report`, `aws cloudtrail describe-trails`,
  `aws s3api get-public-access-block`, `aws configservice ...`), and Security Hub / Config findings.

## Azure specifics
- **Entra ID (Azure AD)**: Global Admins minimized; **Conditional Access** + MFA; **PIM** (Privileged
  Identity Management) for just-in-time admin; access reviews.
- **Logging**: Azure Monitor / **Activity Log**, **Microsoft Defender for Cloud** (secure score, CIS),
  **Microsoft Sentinel** (SIEM); diagnostic settings exported.
- **Network**: NSGs least-privilege; no management ports open to Internet; Private Endpoints; Azure
  Firewall/WAF.
- **Data**: Storage account public access disabled; encryption + **Key Vault** with restricted access
  policies/RBAC and soft-delete/purge protection.
- **Governance**: Management Groups + **Azure Policy** guardrails; subscription structure.

## GCP specifics
- **IAM**: minimize Owner/Editor at org/project; use predefined/custom least-privilege roles; service-
  account key hygiene (avoid user-managed keys); Organization Policy constraints; MFA/2SV enforced.
- **Logging**: **Cloud Audit Logs** (Admin Activity always on; enable Data Access logs), exported to a
  restricted sink; **Security Command Center** for posture/threats.
- **Network**: VPC firewall rules least-privilege; no default-allow; Private Google Access; no public
  IPs where avoidable.
- **Data**: Cloud Storage buckets not public (uniform bucket-level access + public access prevention);
  CMEK via Cloud KMS; encryption in transit.

## Virtualization audit (VMware vSphere / hypervisor)
- **Management access**: vCenter/ESXi admin access least-privilege and via unique accounts; **lockdown
  mode** on ESXi hosts; management network isolated; MFA/SSO for vCenter.
- **Hypervisor hardening**: apply VMware hardening/CIS baseline; disable unnecessary services;
  patch ESXi/vCenter timely; secure the console.
- **Segregation**: VM network segmentation; no mixing of security zones on the same host without
  controls; guest isolation.
- **Logging**: ESXi/vCenter logs forwarded to syslog/SIEM; NTP configured across hosts.
- **VM sprawl / snapshots**: control template/snapshot proliferation; ensure decommissioned VMs are
  removed; golden images hardened and change-controlled.
- **Storage/datastore** access controlled; VM encryption for sensitive workloads.

## Common cloud/virtualization findings
Root/Global-Admin used routinely or without MFA; public storage buckets; management ports open to the
Internet; audit logging not enabled in all regions/accounts or not centralized; long-lived access keys
never rotated; no least-privilege IAM; no guardrails (SCP/Azure Policy/Org Policy); ESXi lockdown mode
off; hypervisor/vCenter unpatched.
