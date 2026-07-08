# Engagement Documents — Memos, Planning, RFI, Observations, Report

Full templates and drafting guidance for the five core written deliverables of an audit engagement, in
lifecycle order:

1. **Audit Commencement Memo** (a.k.a. engagement/announcement/notification memo) — issued at kickoff.
2. **Audit Planning Document** — the internal plan governing the engagement.
3. **Request for Information (RFI)** — the evidence/PBC request to the auditee.
4. **Audit Observation Memo** — issued during/after fieldwork to communicate findings.
5. **Audit Report** — the final deliverable.

General rules for all five:
- Board- and management-grade tone: precise, objective, professional, no hedging or marketing language.
- Fill every field with the user's specifics. Where a value is genuinely unknown, use a clearly-labelled
  realistic placeholder (e.g., "MM/DD/YY", "[Process Owner]") — never leave "[insert]" in a final doc.
- Use standard audit vocabulary consistently (scope, objective, period of intended reliance, control
  owner, observation, rating, root cause, remediation, action plan, owner, due date).
- **Output format**: these are formal written deliverables — default to **Word (.docx)** generated with
  `python-docx` when the user wants something sendable; the RFI can also be **Excel (.xlsx)** (openpyxl)
  as a tracker.
  Draft inline only if the user just wants the text. Honor the user's house style (e.g., navy/gold).
- Ask for (or infer from context) the essentials before drafting: audit title, auditee/area, objective,
  scope & systems, period, key contacts/owners, team & dates. If most are missing, produce the document
  with labelled placeholders and note what to fill in.

---

## 1. Audit Commencement Memo

Purpose: formally notify the auditee that the audit is starting, establish scope/objective/timing, name
the team and contacts, and set expectations (kickoff meeting, evidence requests, availability). Short —
usually one page.

```
MEMORANDUM

To:        [Auditee lead / Process owner], [Title]; [cc: relevant stakeholders]
From:      [Lead Auditor / Head of Internal Audit], Internal Audit
Date:      [MM/DD/YY]
Re:        Commencement of [Audit Title] (Audit Ref: [YY-NNN])

1. Purpose
   This memo confirms the commencement of the [Audit Title], scheduled as part of the
   [FY/quarter] audit plan. The purpose of this engagement is to [one-sentence objective].

2. Objective
   [1-3 sentences on what the audit will assess and why — e.g., independent assurance over the
   design and operating effectiveness of IT general controls supporting financial reporting.]

3. Scope
   The review will cover [processes/systems in scope], for the period [MM/DD/YY - MM/DD/YY].
   [Note key exclusions if relevant.] In-scope systems: [app / database / OS / directory].

4. Approach
   The audit will follow a risk-based approach, including walkthroughs, control design assessment,
   and testing of operating effectiveness. We will request supporting documentation (see the
   accompanying Request for Information) and conduct interviews with relevant personnel.

5. Audit Team & Contacts
   - Lead Auditor: [Name, Title, contact]
   - Team members: [Names]
   - Auditee primary contact requested: [role — please confirm]

6. Timeline (indicative)
   - Kickoff meeting: [date/time — proposed]
   - Fieldwork: [start] to [end]
   - Draft report: [date]     - Final report: [date]

7. What we need from you
   - A primary point of contact and relevant control/process owners.
   - Timely provision of requested evidence (see Request for Information).
   - Availability for interviews and walkthroughs during fieldwork.

We look forward to working with your team. Please contact [name] with any questions or to
confirm the kickoff meeting.
```

Drafting notes: keep it courteous and collaborative; the tone sets the relationship for the whole
engagement. Reference (and usually attach) the RFI. Give a concrete proposed kickoff date rather than
asking open-endedly.

---

## 2. Audit Planning Document

Purpose: the auditor's internal blueprint — captures understanding of the area, the risk assessment,
scope decisions, the controls to be tested, resourcing, and logistics. More detailed than the
commencement memo and usually not sent to the auditee in full (though scope/objective/timeline are
shared). This is the document a reviewer/manager signs off before fieldwork.

```
AUDIT PLANNING DOCUMENT

Audit Title:        [Audit Title]        Audit Ref: [YY-NNN]
Prepared by:        [Lead Auditor]       Date: [MM/DD/YY]
Reviewed/Approved:  [Audit Manager]      Date: [MM/DD/YY]

1. Background & Context
   [Overview of the auditee/area: what it does, why it's on the plan (risk assessment, regulatory
   driver, prior issues, first-year SOX, management request), and any relevant history including
   prior audit findings and their status.]

2. Audit Objective(s)
   [Clear objective statement(s) — what assurance the audit provides.]

3. Scope
   - Processes/functions in scope: [...]
   - Systems in scope (production technology summary): application(s), database(s), OS, directory
     services, ticketing/change tool.
   - Period of intended reliance / audit period: [MM/DD/YY - MM/DD/YY]; sample period: [...]
   - Explicit exclusions / scope limitations: [...]

4. Risk Assessment
   [Key risks to the objective and their inherent rating. For SOX: risks of financial misstatement
   or fraud; otherwise risks to confidentiality, integrity, availability, compliance. Note existing
   controls expected to mitigate each. Reference the RCM.]

   | Risk | Inherent Rating (H/M/L) | Relevant Control Objective(s) |
   |------|-------------------------|-------------------------------|

5. Planned Approach & Control Areas to be Tested
   [Reference the Risk & Control Matrix and audit program. List control domains/objectives to be
   covered and, at a high level, the testing method (TOD walkthroughs, TOE sampling). Note reliance
   on SOC 1/SOC 2 reports or other auditors' work, and any use of frameworks (COBIT/NIST/ISO/PCI).]

6. Materiality / Sampling Approach
   [Sampling methodology and baseline sample sizes by control frequency; how exceptions will be
   evaluated and rated.]

7. Team, Roles & Budget
   [Team members and roles; estimated hours/budget; independence confirmation.]

8. Timeline & Milestones
   | Milestone | Owner | Target Date |
   | Planning complete | | |
   | Kickoff meeting | | |
   | Fieldwork start / end | | |
   | Observations shared | | |
   | Draft report | | |
   | Final report | | |

9. Logistics
   [Key contacts and control/application owners; location/access; data-handling and confidentiality;
   communication cadence (e.g., weekly status).]

10. Deliverables
    [RFI, RCM, audit program, observation memos, draft & final report.]

Appendices: preliminary RCM; PBC/RFI list; prior-issue status.
```

Drafting notes: the risk assessment is the heart of the plan — every planned test should trace to a
risk. Keep scope decisions explicit so there's no ambiguity later. This document plus the RCM justifies
why the audit tests what it tests.

---

## 3. Request for Information (RFI) / PBC List

Purpose: the formal request for evidence the auditee must provide ("Provided By Client"). Make each item
specific about system, report/query, period, and format — **system-generated evidence is strongly
preferred** and every listing must be able to pass IPE testing (source, completeness, accuracy).

Best delivered as a **table/tracker** (Word table or Excel). Columns:

| # | Information / Evidence Requested | System | Period | Format (system-generated preferred) | Control Ref | Owner / Contact | Date Requested | Date Needed By | Date Received | Status |

Preamble to include above the table:
```
REQUEST FOR INFORMATION — [Audit Title] (Ref: [YY-NNN])
Date: [MM/DD/YY]   Please provide the items below by [date]. Where possible, provide
system-generated reports/exports (not screenshots) and note how completeness and accuracy can be
confirmed (source system, query/report logic, and any filters applied). Direct questions to [name].
```

Seed the list from the PBC items in `audit-lifecycle.md` and tailor to the in-scope systems. Typical
ITGC RFI items (adapt per engagement):
- Policies & procedures: information security, access management (provisioning/deprovisioning), change
  management, backup/retention, incident response.
- System-generated **complete** user listings for each in-scope app/DB/OS/directory, with roles/
  privileges, account status, and last logon.
- Listing of privileged/administrator accounts per system.
- HR listings for the period: new hires, terminations, transfers (with dates).
- Access recertification / user access review evidence.
- Complete population of production changes in the period (from the change/ticketing system) + a sample
  of change tickets with request, approval, test, and implementation evidence.
- Batch job schedule and monitoring/error evidence; backup schedule, monitoring, and restore-test
  evidence.
- Password/authentication configuration exports per system.
- SOC 1/SOC 2 reports for relevant service organizations; DR test results; patch-compliance reports.

Drafting notes: group by domain; assign each item an owner and a "needed by" date; keep the tracker
status current (Requested / Received / Outstanding / N/A) so follow-up is easy. Tie each item to the
control ref it supports so the auditee understands why it's needed.

---

## 4. Audit Observation Memo

Purpose: communicate one or more findings (observations) to the auditee during or at the end of
fieldwork, so issues are discussed and agreed before the report — never surprise management in the final
report. Each observation uses the **five-attribute (CCCER)** structure: Condition, Criterion, Cause,
Effect/Risk, Recommendation, plus a rating and a management action plan.

```
AUDIT OBSERVATION MEMO

To:        [Process / Control Owner], [Title]
From:      [Lead Auditor], Internal Audit
Date:      [MM/DD/YY]
Re:        Observations from [Audit Title] (Ref: [YY-NNN])

Purpose: This memo communicates observations identified during fieldwork for your review and response.
Please provide management responses and action plans (with owners and target dates) by [date]. We are
available to discuss.

Summary of Observations
| # | Observation Title | Rating (H/M/L) | Control Ref | Status |

---------------------------------------------------------------------------------------------------
Observation 1: [Short descriptive title]
Rating: [High / Medium / Low]        Control Reference: [e.g., IT6.07]

Condition (what is):       [Factual state found, with specifics — system, sample size, number of
                           exceptions, dates. State facts, not conclusions about intent.]
Criterion (what should be):[The policy, standard, framework requirement, or control objective the
                           condition is measured against.]
Cause (why):               [Root cause — process gap, no automation, unclear ownership, etc.]
Effect / Risk (so what):   [Risk/impact if unaddressed — tie to CIA, compliance, or (for SOX)
                           financial misstatement / fraud.]
Recommendation:            [Specific, actionable remediation addressing the root cause.]

Management Response:       [To be completed by management]
Action Plan:               [To be completed by management]
Responsible Owner:         [Name / Role]        Target Remediation Date: [MM/DD/YY]
---------------------------------------------------------------------------------------------------
[Repeat for each observation.]
```

Rating guidance: **High** = significant risk / material weakness / could enable misstatement or breach;
**Medium** = important but compensating controls or limited exposure exist; **Low** = minor / best-
practice improvement.

Drafting notes: one observation per issue; keep Condition purely factual and non-accusatory; make sure
Criterion cites the *most specific* applicable standard (a named policy clause or framework control
beats "best practice"). Leave the Management Response / Action Plan fields for the auditee to complete.
Agree wording with management before it goes into the report.

---

## 5. Audit Report

Purpose: the final, formal deliverable summarizing objective, scope, approach, overall opinion, and
detailed findings with agreed action plans. Issue the final report within ~4 weeks of concluding
fieldwork. A draft is issued first for auditee review, then finalized.

```
[ORGANIZATION] INTERNAL AUDIT
[Audit Title] — [Draft / Final] Report
Audit Ref: [YY-NNN]        Report Date: [MM/DD/YY]        Distribution: [names/roles]

Covering Memo
   To / From / Date / Re. Brief note transmitting the report, the overall opinion, and next steps
   (management action tracking).

1. Executive Summary
   - Overall Audit Opinion: [Good / Satisfactory / Needs Improvement / Not Satisfactory / No Opinion]
   - Summary narrative: scope, key themes, and count of findings by rating (e.g., 1 High, 3 Medium,
     2 Low).
   - Summary table of observations:
     | # | Observation | Rating | Owner | Target Date |

2. Background & Objective
   [Why the audit was performed and what it aimed to assess.]

3. Scope & Approach
   - Scope: processes/systems in scope, period covered, explicit exclusions/limitations.
   - Approach: risk-based; walkthroughs (TOD) and testing of operating effectiveness (TOE); reliance
     on SOC reports/other work; frameworks referenced (COBIT / NIST / ISO / PCI as applicable).

4. Detailed Findings
   [Each finding in full CCCER structure — Condition, Criterion, Cause, Effect/Risk, Recommendation —
   with rating, and the agreed Management Action Plan (response, owner, target date).]

5. Conclusion
   [Restate the overall opinion and any thematic root causes; acknowledge remediation already
   underway where applicable.]

Appendices
   - A: Rating & opinion definitions.
   - B: Scope detail / systems list / RCM summary.
   - C: Status of prior-audit findings (if applicable).
   - D: Glossary (if needed).
```

Opinion and rating definitions (reusable appendix):
- **Overall opinion**: Good (controls well designed & operating) / Satisfactory (minor issues) / Needs
  Improvement (several issues, some significant) / Not Satisfactory (pervasive/serious weaknesses) /
  No Opinion (insufficient scope/evidence).
- **Finding ratings**: High / Medium / Low (as above).
- **SOX deficiency severity** (where relevant): Control Deficiency / Significant Deficiency / Material
  Weakness.
- **SOC/attestation opinions** (if applicable): Unqualified / Qualified / Adverse / Disclaimer.

Drafting notes: nothing in the report should be new to management — every finding should already have
been in an observation memo and agreed. Lead with the executive summary and the opinion. Keep detailed
findings consistent (same wording) with the observation memo. Ensure every finding has an owner and a
target date.

---

## Workflow: how these documents connect

Commencement Memo (announce) → Planning Document (plan, with RCM) → RFI (request evidence) → [fieldwork
+ testing] → Observation Memo(s) (communicate & agree findings) → Draft Report → Final Report → issue
tracking of action plans. Each document reuses content from the prior one (scope/objective flow through
verbatim; observations flow from the memo into the report unchanged). When a user asks for one, offer to
generate the adjacent documents too, since they share inputs.
