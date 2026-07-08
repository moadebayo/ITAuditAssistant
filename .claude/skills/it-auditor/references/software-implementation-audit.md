# Software / ERP Implementation Audit (Project Assurance)

Audit of a software or ERP **implementation project** — a "controls-by-phase" review that assures
controls are adequately **designed, built/tested, and implemented** as a new system goes live. This is
distinct from ongoing ITGC (which tests a steady-state environment): here you embed with the project
and assess control readiness across the project lifecycle. Common as pre- and post-go-live assurance
for SAP/Oracle/other ERP rollouts. Combine with `sap-audit.md` / `oracle-erp-audit.md` (target
platform), `itgc.md`, and `secure-development-sdl.md`.

## Structure: Project Phases × Control Areas
The audit is a matrix. **Phases** run left to right; within each phase you assess the same set of
**control areas**. Each procedure is either **Key** (control-critical) or **Value-Added** (advisory).

### Project phases
1. **Plan** — gather, analyze, and validate business, user, and functional/non-functional
   requirements. Gain understanding of the project, governance, and scope.
2. **Design** — develop architecture and design elements consistent with requirements; evaluate the
   **adequacy of control design** in each control area (this is the design-effectiveness pass).
3. **Build / Develop / Test** — confirm through testing in the dev/test environment that controls were
   **built as designed and adequately tested** (test cases, results, defect resolution).
4. **Go-Live / Deploy** — confirm the solution was **implemented as designed** in production and
   provide implementation and post-implementation support (UAT sign-off, cutover, data conversion
   completion, production access).

At each phase the questions shift: Design = "is the control adequately designed?"; Build/Test = "was it
built as designed and adequately tested?"; Go-Live = "was it implemented as designed and does it
operate?".

### Control areas (assessed in each phase)
- **Project Management & Control** — governance, plan, milestones, risk/issue management, steering
  oversight, monitoring of the implementation.
- **Change Management & Control** — implementation plan followed; software adequately tested; migration/
  cutover controlled; change mechanisms established.
- **Access Security & Segregation of Duties** —
  - *Access security*: governance over access controls; role design; provisioning; privileged access;
    generic/vendor IDs; authentication — designed, tested (test cases/results/defects), and implemented.
  - *SoD*: SoD rules defined and built in the system; evaluate conflicts at **role level** (roles built
    to meet SoD rules), **end-user level** (assignments don't create conflicts), and **cross-
    application** level; conflicts remediated or mitigated. (See the SoD rulesets in `sap-audit.md` /
    `oracle-erp-audit.md`.)
- **Business Process Controls** — automated application controls (configurable/inherent) and any
  affected manual controls built as designed; business practices re-aligned to system functionality.
  (See `itac-and-ipe.md` for the control types.)
- **Interface & Data Conversion** —
  - *Interfaces*: integration diagram reviewed; interface controls designed, tested, and operating to
    ensure completeness, accuracy, and timeliness of data between systems.
  - *Data conversion/migration*: migration control techniques and data-quality procedures; validation
    plan and mock conversions; complete, valid, timely, accurate conversion; reconciliation; defect
    resolution; **independent validation** of converted data.
- **IT — Logical Security Controls** — the ITGC logical-security techniques that the new system will
  rely on (authentication, vendor/generic IDs, privileged access) — designed, tested, and implemented
  consistent with what was approved in UAT.
- **IT — Physical Security Controls** — physical access to equipment and authority to change physical
  access mechanisms — designed, tested, and implemented.
- **Infrastructure Security** *(Value-Added)* — enterprise/technical infrastructure to support the
  implementation; vulnerability assessment; hardening.
- **Privacy & Data Protection** *(Value-Added)* — compliance with applicable laws (PCI, breach
  notification, international privacy laws); privacy controls designed, tested, and implemented.
- **Business Continuity & Disaster Recovery** — rollback/failover procedures; backup and recovery of
  application data, programs, and system files — designed and tested (noting most BCP/DR controls can
  only be fully tested after implementation).

## How to run an implementation audit
1. Build the **phase × control-area matrix**; mark each cell Key or Value-Added based on risk.
2. In **Design**, evaluate control design adequacy per area (documentation, walkthroughs).
3. In **Build/Test**, obtain test strategy, test cases, results, and defect logs; confirm controls were
   built as designed and tested; confirm a **separate test environment** and restricted access.
4. In **Go-Live**, confirm UAT sign-off, cutover/implementation per plan, data-conversion completion and
   reconciliation, and that production access & controls match what was approved.
5. Report by control area, flagging design gaps early (before build) so they can be fixed cheaply.

## Deliverable
Use a matrix workpaper: columns = Project Phase | Phase Overview | Process/Control Area | Type
(Key/Value-Added) | Audit Procedure | Testing Details/Ref | Conclusion (Effective/Ineffective) | Tested
By | Tested On. Precede detailed SoD/access work with the per-area control-design & operating-
effectiveness sub-tabs (Control Objective | Control Activity | Type | Design procedures | Conclusion on
design | Deficiencies | Operating-effectiveness procedures | Conclusion).

## Common implementation-audit findings
Control design gaps found only after build (expensive rework); SoD rules not built into the target
system; data conversion not independently validated or not reconciled; interfaces lacking completeness/
accuracy controls; developers retaining production access at go-live; UAT sign-off missing; rollback/
backup not tested before cutover; privacy/PCI requirements not designed in.
