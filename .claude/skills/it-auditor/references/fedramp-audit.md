# FedRAMP Audit / Assessment (Federal Risk and Authorization Management Program)

Audit and readiness assessment of a **cloud service offering (CSO)** seeking or maintaining FedRAMP
authorization to host U.S. federal data. Combine with `cloud-and-emerging.md` (cloud control testing),
`infrastructure-audit.md`, and `frameworks.md` (NIST 800-53). Relevant to CSPs selling to government and
to CMMC (CUI in the cloud generally needs FedRAMP Moderate equivalence — see `cmmc-audit.md`).

> Currency note (2026): FedRAMP is mid-transition. The legacy **Rev 5** path is based on **NIST SP
> 800-53 Rev 5** baselines (Low/Moderate/High) with narrative SSPs and annual 3PAO assessments.
> **FedRAMP 20x** (announced March 2025) replaces narrative controls with automated, machine-readable
> **Key Security Indicators (KSIs)** and continuous validation; the **Consolidated Rules for 2026
> (CR26)** launched **June 2026**, renaming baselines to **Certification Classes A–D** and setting the
> Rev 5 sunset (no new Rev 5 applications after **June 11, 2027**; existing Rev 5 authorizations sunset
> by **end of 2028**). Underlying security requirements still map to **NIST 800-53 Rev 5** — what
> changed is *how* compliance is proven. **Verify the current path, class names, and deadlines before
> finalizing**, as timelines have shifted repeatedly.

## Core concepts
- **CSP / CSO** — Cloud Service Provider / Cloud Service Offering (the thing being authorized).
- **Authorization boundary** — everything within the CSO that stores, processes, or transmits federal
  data, plus supporting components. Defining it correctly is the foundational step (like PCI CDE
  scoping).
- **3PAO** — Third-Party Assessment Organization (accredited to assess CSOs).
- **ATO / P-ATO** — Authorization to Operate (agency-issued) / Provisional ATO. **Authorization paths**:
  **Agency authorization** and the newer **Program Certification** path under 20x.
- **Impact levels (Rev 5)** — **Low, Moderate, High**, set per **FIPS 199** categorization of
  confidentiality/integrity/availability. Plus **LI-SaaS / Tailored Low** for low-impact SaaS. Under
  CR26 these become **Classes A (pilot), B (Low), C (Moderate), D (High)**.
- **Key artifacts (Rev 5)** — **SSP** (System Security Plan), **SAP** (Security Assessment Plan), **SAR**
  (Security Assessment Report), **POA&M**, and continuous monitoring (**ConMon**) deliverables. Note:
  CR26 is retiring narrative SSPs/POA&Ms in favor of machine-readable evidence.
- **OSCAL** — Open Security Controls Assessment Language; machine-readable format for packages
  (increasingly required).
- **KSIs (20x)** — Key Security Indicators: specific capabilities automatically validated against the
  running system (e.g., phishing-resistant MFA), grouped into themes (IAM, incident response, supply
  chain, etc.), replacing narrative control write-ups.

## Control basis: NIST SP 800-53 Rev 5
FedRAMP baselines are tailored sets of NIST 800-53 Rev 5 controls by impact level (Low ≈ 150+ controls;
Moderate ≈ 320+; High ≈ 400+ — verify current counts). Controls are grouped into families (AC, AU, CM,
IA, IR, SC, SI, CP, CA, RA, etc.). Assess each control against the FedRAMP baseline and parameters
(FedRAMP sets specific values for many control parameters).

## How to run a FedRAMP readiness/assessment
1. **Categorize (FIPS 199)** — determine the impact level / class based on the federal data's
   confidentiality, integrity, and availability sensitivity.
2. **Define the authorization boundary** — diagram all components, data flows, interconnections, and
   external services within scope; identify leveraged services (e.g., the CSO runs on a FedRAMP-
   authorized IaaS) and inherited controls.
3. **Assess controls / KSIs** —
   - *Rev 5*: evaluate each baseline control's implementation via examine / interview / test; validate
     the SSP describes actual implementation; verify FedRAMP parameter values are met.
   - *20x*: validate each KSI with machine-readable evidence from the running system; confirm continuous
     validation is operating.
4. **Test the high-impact areas** — IAM (phishing-resistant MFA, least privilege), encryption
   (FIPS-validated, at rest and in transit), boundary protection, vulnerability management and scanning
   cadence, logging/monitoring (SIEM — see `siem-and-logging-audit.md`), incident response, contingency
   planning/DR, and supply-chain/external-service risk.
5. **Document gaps** — POA&M (Rev 5) or remediation backlog; produce the SAR-equivalent findings.
6. **Continuous monitoring** — confirm ongoing scanning, POA&M management, and (under CR26) collaborative
   continuous monitoring and availability reporting.

## Cloud-provider-specific testing
The bulk of FedRAMP testing is cloud configuration and IAM — use `cloud-and-emerging.md` for AWS/Azure/
GCP specifics (root/global-admin control, MFA, logging in all regions, encryption/KMS, no public
storage, guardrails). FedRAMP layers federal-specific requirements on top: FIPS-validated cryptography,
US-person / data-residency requirements where applicable, and stricter parameters.

## Deliverables
FedRAMP readiness/gap report (control- or KSI-by-item status with evidence and gaps), SSP review notes,
POA&M, and a boundary/data-flow assessment. Use the finding/CCCER structure per gap, citing the specific
NIST 800-53 control (e.g., "IA-2(1) — MFA for privileged accounts") or KSI as criterion.

## Common FedRAMP findings
Authorization boundary poorly defined or excludes in-scope components; non-FIPS-validated encryption;
MFA gaps (especially privileged/remote); vulnerability scans not meeting cadence or with unremediated
highs; logging not centralized or retained per baseline; POA&M items overdue; inherited-control
responsibilities unclear (customer vs. provider vs. leveraged service); no OSCAL/machine-readable
package where now required; ConMon not operating; external services in the boundary lacking their own
authorization.
