# Audit Lifecycle & Core Method

Read this for any audit task. It defines the stages, the vocabulary, and the reasoning that every
other reference builds on.

## Contents
1. Control objective vs. control activity vs. control
2. TOD vs. TOE (design vs. operating effectiveness)
3. Control classification (type / nature / risk)
4. Stages of an audit (planning → fieldwork → reporting → issue tracking)
5. PBC / evidence request lists
6. Sampling
7. SOX-specific concepts (testing periods, deficiency severity)
8. Audit opinions

---

## 1. Control objective vs. control activity vs. control

- **IT Control Objective**: the aim or purpose of control activities that mitigate an identified risk
  to information assets. One objective is usually supported by *several* control activities.
- **Control Activity**: the specific action management performs to meet the objective.
- A single control activity is only ever *part* of the objective — when testing one control, note the
  other controls that also support the objective so scope is honest.

**Example**
- Risk: application changes are unauthorized prior to implementation.
- Control Objective: changes to application code are identified, authorized, tested, approved,
  properly implemented, and documented.
- Control Activity (one of several): testing is performed to confirm the change meets the requirements
  in the change management documentation.

## 2. TOD vs. TOE

- **Test of Design (TOD)**: is the control, *if operating*, capable of meeting the objective? Method:
  a **walkthrough** combining **Inquiry, Inspection, Observation, and Reperformance**. A control is
  design-effective if its implementation meets the control objective.
- **Test of Operating Effectiveness (TOE)**: is the control *consistently performed as designed*?
  Method: full-population testing, sample/attribute testing, or reperformance over the period of
  intended reliance.
- Design failure is worse than operating failure: an ineffective design cannot be operating
  effectively. Always conclude on design before operating effectiveness.

The four evidence-gathering techniques, weakest → strongest assurance: **Inquiry** < **Observation**
< **Inspection** < **Reperformance**. Inquiry alone is never sufficient evidence for a conclusion.

## 3. Control classification

Every control activity is tagged three ways (these are RCM columns):
- **Control Type**: **Preventive** (stops the error/fraud before it happens, e.g., access
  restriction, approval before change) or **Detective** (finds it after, e.g., log review, access
  recertification, reconciliation).
- **Control Nature**: **Manual** (person performs it) or **Automated** (system enforces it; a
  configuration). Automated controls can be tested once + benchmarked if change management around them
  is effective.
- **Control Risk**: **High / Medium / Low** — drives sample size and testing rigor.

## 4. Stages of an audit

### Planning
- Issue the audit engagement memo.
- Discuss preliminary scope, objectives, and timeline with the auditee.
- Understand the area: interview the auditee; understand processes/systems; obtain policies,
  procedures, standards.
- Get auditee input on risk areas.
- Research outside sources (OEM guides/manuals, ISACA, vendor security baselines, CIS benchmarks).
- Perform a risk assessment of risks inherent to the process/system and identify mitigating controls.
- Define scope; prepare the **Risk & Control Matrix (RCM)** and **test steps (audit program)**.
- Prepare the **evidence request list (PBC list)** and send to the client.
- Develop the **audit planning memo**.
- Hold the **audit kick-off meeting**.

### Fieldwork (execution)
- Assign audit programs to auditors.
- Review evidence; determine whether the control is **designed** and **operating** effectively to
  mitigate the risk.
- Document conclusions for each control with adequate supporting documentation.
- Maintain a running list of potential concerns (exceptions / observations).
- Discuss potential issues with the client **as they arise** — do not wait until the end of fieldwork.
- At the end, give the auditee the list of observations and request their response / action plan.
- Agree with management on the observations and the wording; craft action plans that address root
  cause.

### Reporting & issuance
- Issue a **draft report** for auditee review.
- Agree on the draft; issue the **final report** (target: within 4 weeks of concluding fieldwork).
- Report elements: audit opinion; distribution list; covering memo; statement of audit scope;
  executive summary; list of issues with action plan, due date, and responsible parties.

### Issue tracking
- Obtain periodic status updates on action plans.
- Review completion evidence for executed action plans.
- Escalate to top management when action plans are delayed.

## 5. PBC / evidence request list

"PBC" = **Provided By Client** (a.k.a. evidence request list). Good PBC items are specific about:
system, report/query, period, and format (system-generated preferred). Typical ITGC PBC items:
- Policies & procedures (info security, change management, backup, access provisioning/deprovisioning).
- System-generated **complete** user listings for each in-scope app/DB/OS, with roles/privileges.
- List of privileged/administrator accounts per system.
- List of new hires, terminations, and transfers in the period (from HR system).
- Access recertification / user access review evidence.
- Population of changes to production in the period (from the change/ticketing system).
- Sample of change tickets with request, approval, test, and implementation evidence.
- Batch job schedule and monitoring/error evidence; backup schedule and restore-test evidence.
- Password/authentication configuration screenshots or config exports per system.
- SOC 1/SOC 2 reports for relevant service organizations.

## 6. Sampling

Use **attribute sampling** for TOE of manual controls. Sample size scales with control frequency and
control risk. Common frequency-based baseline sample sizes (adjust to firm methodology):

| Control frequency | Typical population | Common sample |
|---|---|---|
| Annual | 1 | 1 |
| Quarterly | 4 | 2 |
| Monthly | 12 | 2–5 |
| Weekly | 52 | 5–15 |
| Daily | ~250 | 25–40 |
| Many times/day | large | 25–60 |

Automated controls: test **one** instance for correct operation, then rely on change management over
the configuration ("test one + benchmark"). Any exception in an automated control is usually a design
issue affecting the whole population.

## 7. SOX-specific concepts

**Objective of SOX IT audit**: give management independent assurance that IT controls over systems and
applications supporting financial reporting are effective to prevent financial misstatement and fraud.
Performed annually as part of the financial-reporting filing for public companies.

**Testing periods**
- **Interim**: tests effectiveness over the first half (Jan–Jun); typically performed Jul–Sep.
- **Rollforward**: tests the second part of the year; evidence usually produced ≥120 days before year
  end; performed Oct–Dec.
- **Remediation testing**: for any observation remediated by year end; completed by February before
  filing.

**Deficiency severity (SOX)**
- **Control Deficiency**: control doesn't allow management/employees to prevent or detect
  misstatements timely.
- **Significant Deficiency**: less severe than a material weakness but important enough to merit
  attention by those responsible for oversight.
- **Material Weakness**: reasonable possibility that a material misstatement will not be prevented or
  detected timely. The most severe.

**Three ITGC domains for SOX** (see `itgc.md`): Computer/Information Systems Operations, Logical /
Information Security, and Change Management — plus **ITAC** (application controls) and reliance on
**SOC 1 Type 2** reports for outsourced services affecting ICFR.

## 8. Audit opinions

**Engagement-level (internal audit report) opinions**: Good / Satisfactory / Needs Improvement / Not
Satisfactory / No Opinion.

**SOC report / attestation opinions**: **Unqualified** (clean), **Qualified** (exceptions in scope),
**Adverse** (controls not effective), **Disclaimer** (auditor cannot form an opinion).

Match the opinion to the vocabulary of the deliverable: internal audit reports use the first set;
SOC/attestation contexts use the second.
