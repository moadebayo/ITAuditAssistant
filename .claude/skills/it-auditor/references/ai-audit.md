# AI Audit (AI Systems, Models & Governance)

Audit of artificial intelligence — both the **governance/management system** around AI and the
**AI systems/models** themselves (including generative AI/LLMs). Use for AI governance reviews, model
risk audits, AI controls assessments, ISO 42001 readiness, NIST AI RMF alignment, or EU AI Act
conformity. Combine with `frameworks.md`, `siem-and-logging-audit.md` (monitoring), and the finding/
report templates in `engagement-documents.md`. For financial-institution model risk, this complements
model risk management (e.g., SR 11-7) practices.

> Currency note (2026): This area is fast-moving. **EU AI Act** GPAI obligations took effect **Aug 2,
> 2025**; high-risk timelines are in flux (a 2026 "Digital Omnibus" proposed pushing some to 2027-2028)
> — treat specific dates as provisional and verify. **ISO/IEC 42001:2023** (AI management system) is
> certifiable; **ISO/IEC 42005:2025** covers AI impact assessment; **ISO/IEC 42006** covers auditor/
> certification-body requirements. **NIST AI RMF (AI 100-1)** plus the **Generative AI Profile (AI
> 600-1)** are voluntary but widely expected. Verify current versions/dates before finalizing.

## The three anchor frameworks (know which applies)
- **NIST AI RMF** — voluntary risk-management *methodology*. Four functions: **Govern, Map, Measure,
  Manage**. Use as the day-to-day operating playbook. The **Generative AI Profile (AI 600-1)** adds
  ~12 GenAI-specific risks (e.g., confabulation/hallucination, data privacy, harmful bias, information
  integrity, environmental impact, dangerous/CBRN information, obscene content). No certification.
- **ISO/IEC 42001** — certifiable **AI Management System (AIMS)** standard (structured like ISO 27001):
  leadership, policy, planning, risk & impact assessment, operation, performance evaluation,
  improvement, plus **Annex A controls (38 controls across 9 objectives)**. Two-stage certification
  audit (Stage 1 readiness, Stage 2 on-site) on a 3-year cycle with annual surveillance audits.
- **EU AI Act** — mandatory law, **risk-tiered**: **unacceptable** (banned, e.g., social scoring),
  **high-risk** (most obligations — risk management, data governance, technical documentation, logging,
  transparency, human oversight, accuracy/robustness/cybersecurity, conformity assessment),
  **limited-risk** (transparency duties), **minimal**. Distinguishes **providers** (build) vs.
  **deployers** (use). Applies extraterritorially to anyone whose AI output is used in the EU.

Most enterprises operate under all three: the Act sets the legal minimum, ISO 42001 makes governance
provable/certifiable, NIST AI RMF runs the engine. Published crosswalks let you assess once and map to
all three.

## Part 1 — AI governance / management-system audit
Assess whether the organization governs AI responsibly. Control areas:
- **Governance & accountability** — AI policy; a named owner/committee; roles & responsibilities;
  alignment to strategy and legal/regulatory obligations; AI literacy/training.
- **AI inventory & risk classification** — a complete inventory of AI systems (built and procured,
  including embedded/third-party and shadow AI); each classified by risk tier and use case; a cross-
  framework control register.
- **Risk & impact assessment** — AI risk assessments and **AI impact assessments (AIIA)** performed
  before deployment and periodically (bias, safety, privacy, fundamental rights, societal impact).
- **Data governance** — training/validation/test data provenance, quality, representativeness, consent/
  licensing, privacy (PII/DPIA), and bias in data.
- **Third-party / supply chain** — due diligence on AI vendors and foundation-model providers;
  contractual terms; use of others' models/APIs (see `sdlc-dr-physical-tprm.md` TPRM).
- **Transparency & human oversight** — disclosure that AI is in use; explainability appropriate to the
  use; meaningful human oversight and the ability to intervene/override; appeal/redress for affected
  individuals.
- **Lifecycle & change management** — model development, validation, approval, deployment, monitoring,
  retraining, and decommissioning under change control (see `secure-development-sdl.md`).
- **Monitoring & incident response** — post-deployment monitoring for drift and performance; AI incident
  logging and response; feedback loops.

## Part 2 — AI system / model audit (the technical layer)
For a specific AI/ML or GenAI system, test:
- **Purpose & validity** — the model is fit for its stated purpose; success metrics defined and met.
- **Data quality & bias** — training data representative and appropriate; **bias/fairness testing**
  across protected groups; documented mitigations. (Inadequate bias testing is one of the most common
  audit findings.)
- **Performance & robustness** — accuracy/precision/recall (or task-appropriate metrics) validated on
  held-out data; robustness to edge cases, adversarial inputs, and distribution shift; **drift
  monitoring** in production.
- **Explainability & documentation** — model cards / system documentation; feature importance or
  rationale appropriate to risk; decisions traceable and logged.
- **Human oversight** — humans can review, override, and are accountable for consequential decisions;
  automation bias considered.
- **Security of the AI system** — protect the model and pipeline: access control to models/data/
  endpoints; protection against **model theft, data poisoning, adversarial evasion, and prompt
  injection / jailbreaks** (for LLMs); output filtering; rate limiting; secrets and API-key management.
  (See NIST's work on securing AI systems and the OWASP LLM Top 10.)
- **GenAI/LLM-specific risks** — hallucination/confabulation controls (grounding, retrieval, citation);
  data leakage / training-data memorization; prompt-injection defenses; content safety (harmful,
  biased, or infringing output); privacy of prompts/outputs; guardrails and evaluation before release.
- **Privacy** — DPIA where personal data is processed; data-subject rights; minimization; retention.
- **Logging & auditability** — inputs/outputs and decisions logged sufficiently to investigate and to
  meet regulatory logging duties (EU AI Act requires record-keeping for high-risk systems).

## How to run an AI audit
1. Establish scope: which AI system(s)/use case(s), and which framework(s) apply (NIST / ISO 42001 /
   EU AI Act / sector rules).
2. Confirm the **AI inventory** is complete and each system's **risk classification**.
3. Assess governance controls (Part 1), then technical controls (Part 2) for in-scope systems.
4. For each control, examine documentation (policy, model cards, DPIAs, test results), interview owners/
   data scientists, and where possible reperform/inspect (e.g., review bias-test results, observe human-
   oversight workflow, test guardrails).
5. Map findings to the applicable framework control (ISO 42001 Annex A, NIST AI RMF subcategory, or
   EU AI Act article) as the criterion.
6. Report gaps with the CCCER structure; prioritize by AI risk tier and potential harm.

## Deliverables
AI governance/readiness report; AI system risk assessment; bias/fairness assessment; control-by-control
gap analysis mapped to the chosen framework(s); ISO 42001 readiness report where certification is the
goal.

## Common AI audit findings
Incomplete AI inventory (shadow AI / embedded third-party AI missed); risk assessments incomplete or not
performed before deployment; inadequate bias/fairness testing; missing AI impact assessments; no
post-deployment drift monitoring; weak human oversight (rubber-stamp rather than meaningful);
insufficient logging for high-risk systems; poor documentation/model cards; no controls against prompt
injection / data poisoning / model theft; training-data provenance and consent unclear; no AI-specific
incident response.
