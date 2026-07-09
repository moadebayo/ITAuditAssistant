# Secure Development Lifecycle (SDL) Audit

Audit of a secure software development lifecycle, based on the Microsoft SDL structure (the most widely
adopted model; maps cleanly to OWASP SAMM, BSIMM, and NIST SSDF / SP 800-218). Use when auditing how
securely an organization builds software, reviewing an application development shop, or assessing SDLC
security as part of change management. Combine with `sdlc-dr-physical-tprm.md` (general SDLC/project
audit) and `itgc.md` (change management).

The SDL has **seven practice areas** in sequence. For each, confirm the practice is defined, performed,
and evidenced; sample projects/releases and inspect artifacts.

## 1. Training (Practice 1.x)
A training program keeps development teams current on security and privacy basics, technical issues,
and trends.
- **1.1 Core security training** — all members of development teams receive appropriate security
  training covering (at minimum) secure design, threat modeling, secure coding, security testing, and
  privacy. *Test*: obtain the training curriculum and completion records; confirm coverage and
  currency.

## 2. Requirements (Practice 2.x)
Security and privacy are considered "up front," when requirements are defined.
- **2.1 Establish security requirements** — trustworthiness requirements defined at project initiation.
  - **2.1.1 Assign security experts** — a named **security advisor** is the team's point of contact.
  - **2.1.2 Define minimum security criteria** — minimum security requirements for the app in its
    planned operational environment.
  - **2.1.3 Bug/work tracking tool** — a security vulnerability/work-item tracking system to assign,
    sort, filter, and track security bugs to completion.
- **2.2 Quality gates / bug bars** — minimum acceptable security & privacy quality levels defined at
  project start (severity thresholds that must be met to proceed/ship).
- **2.3 Security & privacy risk assessment (SRA/PRA)** — mandatory assessments identifying functionality
  requiring deep review, privacy impact, and the parts of the project needing threat models.

## 3. Design (Practice 3.x)
- **3.1 Establish security design requirements** — security/privacy design specs; spec review; minimal
  cryptographic requirements.
  - **3.1.1 Security design review** with the security advisor (risk-scaled; low-risk components may not
    need a detailed review).
  - **3.1.2 Privacy design review** for high-privacy-impact projects (driven by the PRA).
  - **3.1.3 Minimum cryptographic requirements** — e.g., use vetted algorithms (AES for symmetric,
    RSA/ECC at adequate key lengths, SHA-2+); no home-grown crypto; proper key management.
- **3.2 Analyze attack surface** — minimize and manage the attack surface (least privilege / run as
  non-admin, careful firewall exceptions, correct use of platform security features).
- **3.3 Complete threat models** — threat models for all functionality on the attack surface (the
  highest-value SDL practice); typically using STRIDE, covering all code exposed on the attack surface.

## 4. Implementation (Practice 4.x)
- **4.1 Approved tools** — define/publish a list of approved compilers/linkers/tools with required
  security checks (compiler/linker flags and warnings).
- **4.2 Deprecate unsafe functions** — analyze APIs/functions; ban unsafe ones; enforce the banned list.
- **4.3 Static code analysis (SAST)** — periodic static analysis of source code to enforce secure-coding
  policy at scale.

## 5. Verification (Practice 5.x)
The software is functionally complete and tested against the security/privacy goals from requirements
and design.
- **5.1 Dynamic code analysis (DAST)** — run-time verification (memory-corruption, privilege issues,
  etc.).
- **5.2 Fuzz testing** — inject malformed/random input to induce failures, scaled to the app's intended
  use and input surface.
- **5.3 Attack surface review** — re-review the attack surface, since implementations drift from the
  design; update threat models accordingly.

## 6. Release (Practice 6.x)
- **6.1 Incident response plan** — every release has an IR plan (contacts, on-call, servicing plan) —
  even releases with no known vulnerabilities can face new threats.
- **6.2 Final Security Review (FSR)** — the security advisor examines all security activities performed
  before release; outcome gates the release (Passed / Passed with exceptions / Escalate).
- **6.3 Archive release data** — RTM/RTW is conditional on completing the SDL; archive all pertinent
  data (specs, threat models, test results, FSR) for post-release servicing.

## 7. Response (post-release)
Execute the incident response plan; feed lessons learned back into the SDL.

## How to audit an SDL
1. Confirm the SDL (or equivalent) is documented and mandated.
2. Sample recent projects/releases across risk levels.
3. For each, trace the artifacts by phase: training records → security requirements & bug bar → SRA/PRA
   → threat models & design review → approved tools & SAST → DAST/fuzz/attack-surface review → FSR &
   archived data → IR plan.
4. Confirm quality gates/bug bars were enforced (security bugs above the bar were fixed before ship).
5. Conclude on whether security is built in throughout the lifecycle, not bolted on.

## Common SDL findings
No/stale security training; security requirements and bug bars not defined up front; threat modeling
skipped or superficial; no SAST/DAST or results not actioned; no fuzzing of high-risk input surfaces;
FSR not performed or exceptions shipped without approval; no per-release incident response plan;
release artifacts not archived for servicing.
