# Frameworks, Standards & Compliance References

When to cite each, what it covers, and how to use it as audit criteria. In a workpaper, the framework
is often the **criterion** a condition is measured against.

## COBIT (COBIT 2019 / COBIT 5)
- **What**: ISACA's framework for the **governance and management of enterprise IT**. Organizes IT
  into governance & management objectives (COBIT 2019: 40 objectives across 5 domains — EDM, APO, BAI,
  DSS, MEA).
- **Use it for**: IT governance maturity, aligning IT to business goals, structuring an IT audit
  universe, and as the umbrella framework for ITGC. Cite COBIT for governance/process-level criteria.

## NIST SP 800-53
- **What**: a comprehensive **control catalog** (Rev 5) for U.S. federal information systems,
  organized into control families (AC, AU, CM, IA, IR, SC, SI, etc.). Basis for FISMA/FedRAMP.
- **Use it for**: detailed technical/operational control criteria, especially government or FedRAMP
  contexts. Map ITGC/security findings to specific families (e.g., access control = AC, audit = AU).

## NIST Cybersecurity Framework (CSF 2.0)
- **What**: a voluntary, outcome-based framework organized around functions: **Govern, Identify,
  Protect, Detect, Respond, Recover** (Govern added in 2.0).
- **Use it for**: assessing cybersecurity posture and program maturity, and as a common language for
  vendor/TPRM assessments. Higher-level than 800-53; often used to structure a security program audit.
- **To actually run a CSF-based audit** (functions -> categories -> subcategories with testing steps and
  COBIT 5 / ISO 27001 mappings), see `nist-csf-audit.md`.

## ISO/IEC 27001 (and 27002)
- **What**: the international standard for an **ISMS (Information Security Management System)**; a
  **certifiable** standard. Annex A controls (ISO 27002:2022 has 93 controls in 4 themes:
  organizational, people, physical, technological).
- **Use it for**: information security program audits, certification readiness, and vendor assurance.
  Cite Annex A controls as criteria.

## PCI DSS
- **What**: mandatory standard for entities handling payment card data (12 requirements). Not a
  general-purpose framework — it's a compliance mandate for the cardholder data environment.
- **Use it for**: any card-data scope. See `pci-dss-audit.md` for the full requirements and testing.

## HITRUST CSF
- **What**: a **certifiable** framework that harmonizes many standards (HIPAA, ISO 27001, NIST, PCI,
  etc.) into control specifications across 14 control categories. Widely used in **healthcare** to
  demonstrate HIPAA Security Rule compliance and for vendor assurance.
- **Use it for**: healthcare organizations and their vendors; HIPAA compliance demonstration.

## SOC framework (AICPA) — see also `itac-and-ipe.md`
- **SOC 1** (ICFR, SSAE 18), **SOC 2** (Trust Services Criteria: Security, Availability, Processing
  Integrity, Confidentiality, Privacy), **SOC 3** (public summary). Type I (design, point in time) vs.
  Type II (operating effectiveness over a period).
- **Use it for**: reliance on service organizations; SOC 2 is the common vendor-assurance report.

## Other references you may encounter
- **CMMC (Cybersecurity Maturity Model Certification)** — DoD program requiring defense contractors to
  certify implementation of NIST SP 800-171 (Level 2) / 800-172 (Level 3) to protect FCI/CUI. See
  `cmmc-audit.md`.
- **FedRAMP** — U.S. government program authorizing cloud services to host federal data, based on NIST
  800-53 Rev 5 baselines (transitioning to the automated "20x" model). See `fedramp-audit.md`.
- **AI governance — NIST AI RMF, ISO/IEC 42001, EU AI Act** — the three anchor frameworks for auditing
  AI systems and AI management. NIST AI RMF (Govern/Map/Measure/Manage, voluntary) is the operating
  playbook; ISO 42001 is the certifiable AI management system; the EU AI Act is risk-tiered mandatory
  law. See `ai-audit.md`.
- **CIS Benchmarks / CIS Controls** — prescriptive **hardening baselines** per platform (Windows,
  Linux, AWS, Azure, databases, etc.) and a prioritized set of security controls. Excellent, concrete
  **criteria** for infrastructure/cloud config testing.
- **CSA Cloud Controls Matrix (CCM)** — cloud-specific control framework and the CAIQ questionnaire;
  useful for cloud and cloud-vendor assessments.
- **FFIEC IT Handbook** — U.S. financial-institution IT examination guidance (incl. outsourcing/TPRM).
- **COSO** — enterprise internal control framework (the "I" in ICFR); ITGC supports the COSO control
  environment for financial reporting.
- **GDPR / CCPA / HIPAA / GLBA / SOX** — laws that drive audit scope; know which applies to the client.
- **ITIL** — IT service management good practice (change, incident, problem management) — useful when
  auditing operational IT processes.

## Choosing a framework to cite
- Financial reporting / SOX → COSO + COBIT for structure; ITGC control refs for specifics.
- Government / FedRAMP → NIST 800-53.
- General security program / board reporting → NIST CSF or ISO 27001.
- Card data → PCI DSS. Healthcare → HIPAA Security Rule + HITRUST.
- Infrastructure/cloud config → CIS Benchmarks as the hardening criterion.
- Vendor assurance → SOC 2, ISO 27001, PCI, CSA CCM.

Cite the **most specific** applicable criterion in a finding (e.g., "CIS Windows Benchmark 1.1.1
requires minimum password length of 14" beats a vague "industry best practice").
