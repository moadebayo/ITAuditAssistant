# PCI DSS Audit / Assessment (v4.0 / v4.0.1)

PCI DSS = Payment Card Industry Data Security Standard, mandated for any entity that stores, processes,
or transmits cardholder data. Current version is **v4.0** (v4.0.1 is a minor errata update); v3.2.1
retired in 2024. Future-dated ("best practice") requirements became mandatory on **31 March 2025**.

## Core concepts

**Cardholder Data (CHD) vs. Sensitive Authentication Data (SAD)**
- **CHD**: Primary Account Number (PAN) + cardholder name, expiration date, service code.
- **SAD**: full track data, CAV2/CVC2/CVV2/CID, PINs/PIN blocks. **SAD must never be stored after
  authorization** — this is a hard rule.
- The **PAN** is the defining element; if PAN is present, PCI DSS applies. Stored PAN must be rendered
  unreadable (strong cryptography, truncation, tokenization, or one-way hashing of the full PAN).

**Cardholder Data Environment (CDE)** — the people, processes, and technology that store, process, or
transmit CHD/SAD, **plus** connected-to or security-impacting systems. Scoping the CDE correctly is
the single most important step; everything else follows from it.

**Segmentation** — isolating the CDE from the rest of the network to reduce scope. Segmentation is not
required, but if used to reduce scope it must be validated (and penetration-tested annually, or every
6 months for service providers).

## Validation path: SAQ vs. ROC
- **SAQ (Self-Assessment Questionnaire)** — for eligible merchants; several types by how cards are
  accepted (e.g., **A** = fully outsourced e-commerce, **A-EP** = e-commerce partially outsourced, **B**
  = imprint/standalone terminals, **B-IP** = IP-connected terminals, **C** = payment app on internet-
  connected system, **C-VT** = virtual terminal, **P2PE** = validated P2PE solution, **D** =
  merchants/service providers not covered by others; the catch-all).
- **ROC (Report on Compliance)** — required for Level 1 merchants and many service providers;
  performed/attested by a **QSA** (Qualified Security Assessor) or **ISA**.
- **AOC (Attestation of Compliance)** accompanies both. Merchant **levels** (1–4) are set by card
  brands based on annual transaction volume; Level 1 (highest volume) requires a ROC.

## The 12 requirements (6 goals)

**Build & maintain a secure network and systems**
1. Install and maintain network security controls (firewalls/NSCs); documented rules, reviewed at
   least every 6 months; deny-all default; restrict inbound/outbound to what's necessary.
2. Apply secure configurations to all components; **change vendor defaults** (passwords, SNMP strings,
   keys); remove unnecessary services/accounts; maintain hardening standards (e.g., CIS benchmarks).

**Protect account data**
3. Protect stored account data; **don't store SAD after authorization**; render PAN unreadable;
   document data retention/disposal; strong key management.
4. Protect CHD with strong cryptography during transmission over open/public networks (TLS; no weak
   protocols/ciphers); never send unprotected PAN by end-user messaging.

**Maintain a vulnerability management program**
5. Protect systems from malware; anti-malware deployed, current, and generating auditable logs;
   periodic evaluation of systems not commonly affected.
6. Develop and maintain secure systems/software; patch (critical within 1 month); secure SDLC; address
   OWASP-type vulnerabilities; WAF or automated technical solution for public-facing web apps.

**Implement strong access control measures**
7. Restrict access to system components and CHD by business **need-to-know**; default deny; documented
   access model; reviewed periodically.
8. Identify users and authenticate access; **unique IDs**; **MFA** for all access into the CDE and all
   remote/administrative access; strong password parameters (min length 12 in v4.0; complexity;
   lockout); no shared/generic accounts unless justified and controlled.
9. Restrict **physical** access to CHD; facility controls; media handling/destruction; device
   (POI/POS) inspection for tampering/skimming.

**Regularly monitor and test networks**
10. Log and monitor all access to system components and CHD; centralized logging; time synchronization
    (NTP); daily log review (or automated); retain logs ≥12 months (≥3 months immediately available).
11. Test security of systems/networks regularly; quarterly internal & external vulnerability scans
    (external by an **ASV** — Approved Scanning Vendor); annual penetration testing (network & app);
    segmentation testing; change/tamper detection (FIM); rogue wireless detection.

**Maintain an information security policy**
12. Support information security with organizational policies/programs; risk assessment; security
    awareness training; incident response plan (tested); **TPRM for service providers** (maintain a
    list, get their PCI status/AOC, define responsibilities via a matrix); targeted risk analyses
    (new in v4.0).

## Notable v4.0 changes to test for
- **Customized Approach** — entities may meet a requirement's stated **objective** with alternative
  controls (requires a documented Targeted Risk Analysis and QSA validation) instead of the "defined
  approach".
- **Targeted Risk Analysis (TRA)** — required to justify frequencies of certain periodic activities.
- Expanded **MFA** (into the CDE, not just remote/admin).
- Stronger **password** requirements (min 12 chars) and phishing-resistant considerations.
- **Anti-phishing / automated web-app protection** (client-side script integrity — reqs 6.4.3 and
  11.6.1 for payment page scripts).
- Enhanced roles/responsibilities documentation for each requirement.

## How to run a PCI assessment/gap review
1. **Scope the CDE** — data-flow diagrams (all card flows), network diagrams, inventory of all
   in-scope components; validate segmentation; identify connected/security-impacting systems and all
   service providers.
2. **Determine validation type** — merchant level / SAQ type or ROC.
3. **Assess each requirement** — for each sub-requirement, use the testing procedures: examine
   documentation/config, observe processes, interview personnel, and inspect evidence (scan reports,
   pen-test reports, change tickets, access listings, key-management docs).
4. **Document status** per sub-requirement: In Place / Not in Place / Not Applicable / In Place with
   CCW (Compensating Control Worksheet) / Customized Approach.
5. **Gaps → remediation plan**; retest; produce SAQ/ROC + AOC.

## Common PCI findings
Storing prohibited SAD; PAN not rendered unreadable; vendor defaults unchanged; missing MFA into the
CDE; weak TLS/ciphers; missing/inadequate quarterly ASV scans or annual pen tests; firewall rules not
reviewed every 6 months; logs not retained 12 months or not reviewed; service-provider AOCs not
obtained; segmentation not validated; unpatched public-facing systems.
