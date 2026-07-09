# Deliverable Templates

Exact structures for the documents an IT auditor produces. Use these verbatim (adapt labels to the
user's house style if they have one).

**Note:** the five engagement *written* deliverables — **audit commencement memo, audit planning
document, request for information (RFI), audit observation memo, and audit report** — have full,
detailed templates and drafting guidance in `engagement-documents.md`. Read that file for any of those.
This file covers the tabular workpapers (RCM, audit program) and the reusable finding/rating blocks.

## 1. Risk & Control Matrix (RCM) — Excel

A header block, then one row per **control activity**, grouped by domain and control objective.

**Header block (top rows):**
- Audit Description: IT General Controls (ITGCs) [or the relevant audit]
- System: [system name / TBD]
- Audit Period: MM/DD/YY – MM/DD/YY
- Sample Period: MM/DD/YY – MM/DD/YY

**Columns (in order):**
1. Control Objective Ref. (e.g., IT1)
2. Control Objective Description
3. Key Risk(s) — Risk(s) Addressed by the Control Objective
4. Control Objective Assertions (Completeness, Accuracy, Validity, Cut-off, Presentation, Recording,
   Valuation — as applicable; for SOX map to FS assertions)
5. Control Activity Ref. (e.g., IT1.02)
6. Control Activity Description
7. Control Type — Preventive / Detective
8. Control Nature — Manual / Automated
9. Control Risk — High / Medium / Low
10. Conclusion on Operating Effectiveness — Effective / Ineffective (default: "TBD – Control has not
    been tested")
11. Exception Details
12. (optional) Applies to System(s) — one column per in-scope app/DB/OS, marked where the control
    applies
13. (optional) Control Owner
14. (optional) Testing Reference / Workpaper Ref

Group rows under section headers: "Information Systems Operations", "Information Security", "System
Change Control". Populate control activities from `itgc.md`.

## 2. Audit Program — Excel (or Word)

One block per control objective, then per control activity the test procedures.

**Columns:**
1. Control Activity Ref.
2. Control Activity Description
3. Control Type (P/D)
4. Control Nature (M/A)
5. Control Risk (H/M/L)
6. Testing Procedures — the numbered steps (Interview → Test of Control → Conclusion)
7. Evidence / IPE required
8. Sample Size
9. Tester / Date
10. Result — Effective / Ineffective / N/A
11. Workpaper Reference

Precede each objective's controls with two rows: "Control Objective ITn: [text] (Assertions: …)" and
"Risk: [text]". Test procedures follow the Interview / Test of Control / Conclusion pattern in
`itgc.md`.

## 3. Finding / Observation, Planning, RFI, Commencement Memo, Report

These are in `engagement-documents.md` with full templates:
- **Audit Commencement Memo** — engagement kickoff notification.
- **Audit Planning Document** — internal plan (background, risk assessment, scope, approach, timeline).
- **Request for Information (RFI) / PBC list** — evidence request tracker.
- **Audit Observation Memo** — findings communicated to the auditee (CCCER structure).
- **Audit Report** — final deliverable (executive summary + opinion + detailed findings).

The single **finding (CCCER) structure** — reused across the observation memo and the report — is:
Condition (what is) → Criterion (what should be) → Cause (why) → Effect/Risk (so what) →
Recommendation, plus a Rating (High/Medium/Low) and a Management Action Plan (response, owner, target
date). Keep Condition factual and non-accusatory; cite the most specific applicable criterion.

## 4. Rating / opinion definitions block (reusable appendix)

- **Finding ratings**: **High** = material weakness / significant risk / could enable misstatement or
  breach; **Medium** = important but compensating controls or limited exposure exist; **Low** = minor /
  best-practice improvement.
- **Overall opinion**: Good (controls well designed & operating) / Satisfactory (minor issues) /
  Needs Improvement (several issues, some significant) / Not Satisfactory (pervasive/serious control
  weaknesses) / No Opinion (insufficient scope/evidence).
- **SOX deficiency severity**: Control Deficiency / Significant Deficiency / Material Weakness.
- **SOC/attestation opinions**: Unqualified / Qualified / Adverse / Disclaimer.
