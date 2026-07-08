# Mainframe Audit (z/OS with RACF, ACF2, Top Secret)

Covers IBM z/OS external security managers (ESMs): **RACF** (IBM), **CA ACF2**, and **CA Top Secret**.
Combine with `itgc.md` for control objectives. The concepts map directly to ITGC: user access,
privileged access, dataset/resource protection, logging, and change control — the mainframe just uses
distinct terminology and commands.

## z/OS / ESM concepts
- **ESM (External Security Manager)** — RACF, ACF2, or Top Secret — controls who can access datasets,
  resources, and privileged functions via **SAF** (System Authorization Facility) calls.
- **Dataset profiles** — protect datasets (files); access levels: NONE, EXECUTE, READ, UPDATE,
  CONTROL, ALTER.
- **General resource profiles / classes** — protect non-dataset resources (transactions, commands,
  facilities), organized in **classes** (e.g., FACILITY, OPERCMDS, TSOAUTH, SURROGAT, UNIXPRIV,
  APPL, TCICSTRN for CICS).
- **APF-authorized libraries** — libraries whose programs can bypass normal security (run in
  supervisor state). Uncontrolled APF libraries = a system-wide backdoor. Tightly restrict who can
  update them and control which libraries are APF-authorized (SYS1.PARMLIB member PROGxx / IEAAPFxx).
- **SMF (System Management Facility)** — the z/OS logging facility; security events land in SMF
  records (RACF: types 80/81/83). Logging/monitoring evidence comes from SMF.
- **SVCs, exits, and PPT entries** — powerful customizations; changes should be controlled.

## Privileged attributes / powerful access (the "keys to the kingdom")

**RACF**
- **SPECIAL** — full RACF administration (system-level). **group-SPECIAL** = scoped to a group.
- **OPERATIONS** — can access (READ/UPDATE/ALTER) most datasets/resources unless specifically denied;
  extremely powerful for data access.
- **AUDITOR** — can set/alter auditing and read security data; should be held by the audit/security
  function only.
- Powerful IDs: **IBMUSER** (installation default — should be revoked after setup), started-task IDs,
  and any ID with UID(0) in z/OS UNIX (superuser).

**ACF2**
- **SECURITY** (equivalent to RACF SPECIAL), **NON-CNCL** (non-cancel — bypasses resource checks, like
  OPERATIONS), **AUDIT**, **ACCOUNT** (administer logonids). Attributes live in the **logonid record**.

**Top Secret**
- **MSCA** (Master Security Control ADSP — the top administrator), **SCA/LSCA/ZCA/VCA/DCA** (scoped
  central/zone/division/department administrators), and the **AUDIT** attribute. Privileges set via
  ADMINBY / ACID facilities and **NORESCHK** (bypass resource checks — like NON-CNCL/OPERATIONS).

## Key commands (for evidence)
**RACF**
- List a user: `LISTUSER userid` (shows SPECIAL/OPERATIONS/AUDITOR, group connections, last access).
- List users with an attribute: `SEARCH CLASS(USER)` + filters, or run a **DBUNLOAD / IRRDBU00**
  database unload and query it (the standard way to get a complete, analyzable population).
- Dataset profile: `LISTDSD DATASET('hlq.**') ALL`.
- Resource profile: `RLIST classname profilename ALL`.
- Global settings: `SETROPTS LIST` (shows password rules, logging options, protect-all, class
  activation).
- SMF / audit reporting: **IRRADU00** (SMF unload) → analyze RACF SMF events.

**ACF2** — `SHOW STATE`, `SHOW ACF2` (GSO settings/password rules), `LIST logonid`, `LIST IF(...)`
to find attributes; reporting via **ACFRPTxx** reports (e.g., ACFRPTPW password violations, ACFRPTRV
resource events).

**Top Secret** — `TSS LIST(acid) DATA(ALL)`, `TSS LIST(SDT)`, `TSS WHOHAS`, `TSS WHOOWNS`; reporting
via **TSSCFILE** / **TSSUTIL** (audit/violation reporting).

## Test areas

### 1. Global security configuration (IT5)
- **Password/passphrase rules** (RACF `SETROPTS`: PASSWORD interval, length, history, RULES; ACF2 GSO
  PSWD; Top Secret control options): confirm they meet the standard.
- **PROTECTALL / default protection** — is default-deny enforced so unprotected datasets aren't world-
  accessible? (RACF `SETROPTS PROTECTALL(FAILURES)`.)
- **Logging** — `SETROPTS` AUDIT/LOGOPTIONS enabled; SMF recording active; SAUDIT/CMDVIOL/OPERAUDIT
  on. Confirm logs are reviewed.
- **Class activation** — critical general-resource classes are active and RACLISTed.

### 2. Privileged access (IT6 / IT5.06)
- Enumerate all IDs with SPECIAL, OPERATIONS, AUDITOR (RACF) / SECURITY, NON-CNCL, ACCOUNT (ACF2) /
  MSCA & scoped admins, NORESCHK (Top Secret). Each should be justified, minimal, and monitored.
- Confirm **IBMUSER** (RACF) and other installation defaults are revoked/secured.
- z/OS UNIX **UID(0)** superusers minimized (use UNIXPRIV granular privileges instead).
- Started-task and surrogate (SURROGAT class) access controlled.

### 3. Dataset & resource access (IT6 / IT7)
- Protect **SYS1.** system libraries, **PARMLIB, PROCLIB, LINKLIB, APF libraries**, and security
  databases (RACF DB, ACF2 database, TSS security file) — UPDATE/ALTER restricted to systems
  programming; audit read access to security databases.
- Financially-significant application datasets: access restricted per least privilege and SoD.
- Review **UACC** (universal access) — should be NONE for sensitive profiles (not READ/UPDATE).

### 4. APF & system integrity (IT5 / IT8)
- Obtain the APF library list; confirm each is legitimate and update access is tightly restricted.
- Review changes to PARMLIB (PROGxx/IEAAPFxx), SVCs, exits, and PPT via change control.

### 5. Change management (IT8/IT9)
- Source/load libraries controlled via a change management tool (e.g., CA Endevor, ChangeMan ZMF);
  developers don't move code to production; migrations tested and approved. Sample changes and inspect
  request/test/approval and SoD.

### 6. User administration (IT6)
- Obtain a **complete** list of logonids/users via database unload (IRRDBU00 / ACF2 or TSS reports),
  IPE-test it; test new users, terminations (revoked/deleted timely), inactive IDs (RACF REVOKE for
  inactivity), and periodic access recertification.

## Common mainframe findings
Excessive SPECIAL/OPERATIONS (or NON-CNCL/NORESCHK) holders; IBMUSER not revoked; UACC(READ) on
sensitive datasets; PROTECTALL not enforced; APF library update access too broad; SMF security logging
disabled or unreviewed; weak password rules; developers with production library access; UID(0)
proliferation in z/OS UNIX.
