# IT General Controls (ITGC) — Risk & Control Matrix + Audit Program

This is the backbone reference. It contains the standard ITGC control library (control refs IT1–IT10)
across the three ITGC domains, plus the test methodology for each. Use it to build RCMs, audit
programs, and test steps. When testing on a specific platform (Oracle EBS, SAP, Windows, Oracle DB,
mainframe, etc.), combine these control activities with the platform reference for exact commands.

## The three ITGC domains

1. **Information Systems / Computer Operations** — complete processing of transactions, backups, job
   scheduling, physical security of processing facilities.
2. **Information Security / Logical Security** — confidentiality and integrity of data; authentication,
   authorization, user access management, configuration, logging/monitoring.
3. **System Change Control / Change Management** — changes to applications and infrastructure are
   authorized, tested, approved, and implemented without causing incidents/outages.

## IT risks that could lead to financial misstatement / fraud

**Operations risk** — jobs terminate abnormally / programs not executed → transactions not recorded
completely or accurately; uncontrolled job scheduling access → unauthorized job execution; critical
data not retained → cannot reconstruct data after an incident.

**Information security risk** — inadequate configuration/security settings → undetected breaches,
compromised resources; poorly managed user access → inappropriate changes, no SoD, unauthorized
disclosure, or unavailability of data.

**Change management risk** — inappropriately developed applications → software that can't meet
processing needs or lacks controls; inappropriate implementation → unreliable processing, inaccurate
calculations, incomplete/lost data.

---

## Quick-start for an ITGC engagement

1. Determine risk to financial-reporting misstatement and fraud.
2. Determine control objectives and the activities management uses to mitigate the risk.
3. Identify control owners and application owners for in-scope applications.
4. Create a **production technology summary** — list of applications and the supporting servers and
   databases (the "app/DB/OS stack").
5. Determine which controls apply to each application, database, and server in scope.
6. Create a detailed control list per application plus a high-level test plan for each.
7. Remember: **how each control is implemented differs by system** — the objective is constant, the
   test procedure is platform-specific.

A typical in-scope stack example: Core financial app = Oracle EBS Financials; DB = Oracle Database;
server = Linux; directory services = Active Directory on Windows Server; change/incident ticketing =
service desk tool (e.g., CA Service Desk / ServiceNow / Jira).

---

## The ITGC control library (RCM control activities)

Control refs follow the convention `ITn.mm`. Each has: description, type (P/D), nature (M/A), and a
typical control-risk rating. Use these refs verbatim in an RCM. `IT*.01` is usually the
policy/procedure control for that objective.

### Domain: Information Systems Operations

**IT1 — Batch/report processing is supervised; problems identified & resolved** (Risk: abnormal
job termination → incomplete/inaccurate recording).
- IT1.01 — Batch/report/online processing procedures ensure jobs process to normal completion. (P, M, Med)
- IT1.02 — Automated job scheduling used; changes to schedules authorized by management. (P, A, Med)
- IT1.03 — Batch jobs monitored for successful/timely completion; errors resolved timely. (D, M, Med)

**IT2 — Job scheduling/execution restricted to authorized personnel; only valid jobs run** (Risk:
uncontrolled scheduling access → unauthorized jobs / invalid transactions).
- IT2.01 — Access to administer the job scheduling system is restricted to authorized users. (P, A, High)
- IT2.02 — Access to submit sensitive job requests is restricted to authorized personnel. (P, A, High)

**IT3 — Financial data managed during storage; remains complete/accurate/valid** (Risk: data not
retained → cannot reconstruct after incident).
- IT3.01 — Backup/retention policies established; backups scheduled & supervised. (P, M, Med)
- IT3.02 — Automated retention software executes backups per policy; schedule changes authorized. (P, A, High)
- IT3.03 — Backup activities monitored for successful completion; errors resolved. (D, M, High)
- IT3.04 — Access to backup media restricted to authorized personnel. (P, M, Med)
- IT3.05 — Backup media archived off-site; off-site inventory reconciled periodically. (P, M, Low)
- IT3.06 — Backup reliability periodically tested via restoration; errors corrected. (D, M, Med)
- IT3.07 — Sensitive data at rest is encrypted. (P, A, High)

**IT4 — Facilities housing processing/storage infrastructure are managed** (Risk: inadequate physical
security → unauthorized access / loss / damage).
- IT4.01 — Physical security policies/procedures established. (P, M, Med)
- IT4.02 — Physical access to secure facilities restricted; IT management approval before granting. (P, M, High)
- IT4.03 — Physical access disabled upon personnel separation. (P, M, High)
- IT4.04 — Access to administer physical-access mechanisms restricted to appropriate personnel. (P, A, High)
- IT4.05 — Physical access logged; logs reviewed by management. (D, A, Med)
- IT4.06 — Physical access list reviewed/recertified periodically; access modified/removed timely. (D, M, Med)

### Domain: Information Security

**IT5 — Configuration & security settings implemented, administered, and safeguarded** (Risk:
inadequate settings → undetected breaches, ineffective transaction flows).
- IT5.01 — Information security policies/procedures established. (P, M, Med)
- IT5.02 — Users assigned unique IDs for accountability; system/shared accounts monitored/controlled. (P, A, High)
- IT5.03 — Vendor default passwords safeguarded; default accounts disabled or passwords changed. (P, A, High)
- IT5.04 — Strong password requirements implemented (complexity, length, change frequency, confidentiality). (P, A, High)
- IT5.05 — Password files encrypted with a non-reversible one-way hash. (P, A, High)
- IT5.06 — Privileged/admin access restricted to appropriate administrators; only authorized can modify security parameters/config. (P, A, High)
- IT5.07 — Configuration baselines/checklists defined; systems evaluated against them. (P, M, Med)
- IT5.08 — Logging of changes to security/config settings enabled; logs reviewed. (D, A, High)
- IT5.09 — Security event monitoring/logging established; logs reviewed periodically with follow-up. (D, A, High)
- IT5.10 — Security incident handling procedures established. (D, M, High)
- IT5.11 — Access to security tools/logs restricted to authorized security administrators. (P, A, Med)
- IT5.12 — Effective patching policies in place to remediate known vulnerabilities. (P, M, Med)

**IT6 — Access to systems restricted to authorized individuals** (Risk: poor access management →
inappropriate changes, no SoD, disclosure, unavailability).
- IT6.01 — User access provisioning policies/procedures established. (P, M, Med)
- IT6.02 — Ability to perform user administration restricted to authorized administrators. (P, A, High)
- IT6.03 — User access authorized by management; granted per approval and least privilege. (P, M, High)
- IT6.04 — Access reviewed/recertified periodically; modified/removed timely. (D, M, Med)
- IT6.05 — Segregation of duties enforced; SoD conflicts evaluated periodically and resolved. (D, M, High)
- IT6.06 — Software tools enforce SoD; access changes evaluated for SoD before implementation. (P, A, High)
- IT6.07 — Access disabled for terminated/temporary employees who no longer require it. (P, M, High)
- IT6.08 — Access updated appropriately for employees who transfer departments. (P, M, Med)
- IT6.09 — Inactive IDs disabled. (D, M, Med)
- IT6.10 — Session time-out / auto-lock after inactivity configured. (P, A, High)

**IT7 — Sensitive/confidential information safeguarded** (Risk: unauthorized disclosure).
- IT7.01 — Data classification / handling procedures established. (P, M, Med)
- IT7.02 — Access to sensitive/confidential data logged; logs reviewed periodically. (D, A, Med)
- IT7.03 — Sensitive data in transit is encrypted. (P, A, High)
- IT7.04 — Sensitive data masked/scrambled in cloned non-production environments. (P, A, High)

### Domain: System Change Control

**IT8 — Changes appropriately developed** (Risk: inappropriately developed apps → software failing
processing needs / lacking controls).
- IT8.01 — Change management policies/procedures established (standard & emergency). (P, M, Med)
- IT8.02 — Emergency change procedure ensures emergency changes are recorded, tested, approved. (P, M, Med)
- IT8.03 — Changes to production logged; change logs reconciled to authorized changes periodically. (P, A, High)
- IT8.04 — Changes tested prior to/with production release; findings addressed. (P, M, High)
- IT8.05 — Development/modification performed in an environment separate from production. (P, A, High)
- IT8.06 — Developers/testers do not have access to the production environment. (P, A, High)
- IT8.07 — Business requirements identified, defined, and approved. (P, M, Med)
- IT8.08 — Test scenarios & expected results prepared by business owners. (P, M, Med)
- IT8.09 — User acceptance testing (UAT) performed prior to release; errors resolved. (P, M, High)

**IT9 — Changes appropriately implemented** (Risk: inappropriate implementation → unreliable
processing, inaccurate calculations, lost/incomplete data).
- IT9.01 — Implementation procedures established. (P, M, Med)
- IT9.02 — Automated change management software controls the change process. (P, A, Med)
- IT9.03 — Changes to production approved by management prior to implementation. (P, M, Med)
- IT9.04 — Testing completion reviewed/approved by system owner before promotion. (P, M, Med)
- IT9.05 — UAT completion reviewed/approved by business owner before promotion. (P, M, Med)
- IT9.06 — Data conversion/migration reconciled; conversion errors resolved. (P, M, Med)
- IT9.07 — Version control retains prior source-code versions for recovery. (P, A, Med)
- IT9.08 — Rollback strategy documented and tested prior to implementation. (P, M, Med)
- IT9.09 — Only authorized employees can implement changes to production. (P, M, Med)
- IT9.10 — Post-implementation review confirms objectives met; issues communicated. (D, M, Med)

**IT10 — Changes subject to management oversight** (Risk: poor oversight → untimely/inaccurate change
processing, disruption).
- IT10.01 — Change oversight/reporting procedures established. (P, M, Med)
- IT10.02 — Management monitors change implementation for compliance with the change process. (D, M, Med)

---

## Audit program structure (how to test each control)

Every control activity in the audit program is documented with the same three-part structure. Use
this pattern verbatim when writing test steps.

**1. Interview** — Interview the individual(s) responsible for the control. Inquire about the relevant
policies, procedures, standards, tools, and how the control is performed. Obtain the population and
supporting lists.

**2. Test of Control** — the concrete procedures:
- For **policy controls**: obtain the policy; confirm it's documented, current, and periodically
  reviewed/approved by an appropriate owner; assess adequacy of requirements.
- For **automated/config controls**: observe/obtain the configuration; confirm it meets the
  requirement; determine that logging of config changes is enabled; for changes to the config, select
  a sample and examine management approval.
- For **access controls**: obtain a **system-generated** list of users with the access; IPE-test the
  list (source, completeness, accuracy); examine access profiles; have management confirm
  appropriateness of each user (or sample) with such access.
- For **monitoring/detective controls**: confirm monitoring is configured; obtain the population of
  errors/exceptions/reviews; sample and examine evidence of timely resolution/review.
- For **change controls**: obtain the complete population of changes from the change/ticketing system
  (IPE-test it); sample changes; for each, inspect request, risk/impact assessment, approval, test
  evidence, and implementation approval; confirm SoD between developer and implementer.

**3. Conclusion** — "Use your professional judgment to conclude on the [design and operating
effectiveness] of the control. Document your conclusions." State Effective / Ineffective and describe
any exception (what, how many out of sample, root cause).

### Worked micro-examples

**IT5.04 (password configuration) on any platform** — Interview the admin about the password policy.
Test of control: obtain the system's password configuration (exported or screenshot IPE-tested);
compare each parameter (minimum length, complexity, history, max age, lockout threshold) to the
company's security standard; note any parameter weaker than the standard as an exception. Conclude.

**IT6.07 (terminated user access)** — Interview about the deprovisioning process. Test of control:
obtain the complete population of terminations in the period from HR (IPE-test); reconcile to the
system user listing; for a sample of terminations, confirm the system access was disabled within the
required SLA (compare termination date to access-disable date); any access still active or disabled
late is an exception. Conclude.

**IT8.04 / change testing** — Obtain the complete population of production changes from the ticketing
system (IPE-test). Sample changes. For each, inspect: change request, risk/impact classification,
approval before build, evidence of testing (functional/UAT), and approval before implementation; and
confirm the developer did not implement to production (SoD). Any missing attribute is an exception.
Conclude.

For the exact RCM columns and audit-program row format, see `deliverable-templates.md`. For
platform-specific commands to pull these listings/configs, see the platform references.
