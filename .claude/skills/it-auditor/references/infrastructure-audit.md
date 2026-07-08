# Infrastructure Audit — Operating Systems, Databases, Firewalls/Network

Covers Windows, Linux/Unix, Oracle Database, SQL Server, and firewalls/network devices. Combine with
`itgc.md` (control objectives IT5/IT6/IT7/IT8). These are the layers beneath the application: an
in-scope financial app almost always sits on a DB and an OS that are themselves in scope.

## Defense-in-depth & data classification (framing)
Protect data across layers: perimeter (firewall), network, host (OS), database, and application, with
encryption for data at rest and in transit. Classify data (public / internal / confidential /
restricted) and protect for **Confidentiality, Integrity, Availability**. Always start an
infrastructure audit by confirming the documented hardening baselines/standards exist (ideally CIS
Benchmarks or vendor STIGs) — you test config against that criterion.

---

## Firewalls / Network devices

### Access control (IT6)
- Restrict administrative access to the firewall to authorized personnel; unique accounts (no shared
  admin); AAA via TACACS+/RADIUS; MFA for admin; management plane on a dedicated/out-of-band network.
- Change vendor default credentials and SNMP community strings; disable unused management protocols
  (Telnet/HTTP — use SSH/HTTPS).

### Rule base / ACLs (IT5)
- Obtain the ruleset. Confirm **default-deny** (implicit deny at the end) and least-privilege rules;
  no "ANY-ANY-ANY" permit rules; each rule justified/owned with a business reason.
- Rules reviewed periodically (PCI: at least every 6 months) to remove stale/overly-permissive rules.
- Ingress/egress filtering; anti-spoofing; segmentation between zones (DMZ, internal, CDE).

### Logging & monitoring (IT5.08/09)
- Logging enabled and forwarded to a central SIEM/syslog; reviewed for security events; retention per
  policy.

### Time synchronization
- **NTP** configured to authoritative sources so log timestamps are reliable and correlatable.

### Hardening
- Unnecessary firewall **services/functions disabled**; firmware patched; secure config baseline
  applied; management access restricted by source IP.

### Patching & change management (IT8)
- Firmware/OS patches applied timely under change control; rule changes go through the change process
  (request, approval, test where feasible).

---

## Windows (Server OS)

### Access control (IT6)
- Enumerate members of privileged groups: **Domain Admins, Enterprise Admins, Administrators,
  Schema Admins, Account Operators**; justify each. Minimize.
- Local admin rights on servers restricted; use of a privileged-access model (tiering, LAPS for local
  admin passwords, PAW for admin workstations).
- Password/account policy (via Group Policy / `secpol.msc` / `gpresult`): minimum length, complexity,
  history, max age, lockout threshold/duration; screen-lock timeout.
- Disable/rename default **Administrator** and **Guest**; remove/monitor built-in accounts.

### Audit log & monitoring (IT5.08/09)
- **Audit policy** (advanced audit policy / `auditpol /get /category:*`) captures logon events,
  account management, privilege use, object access, policy change. Security event log sized adequately
  and forwarded to SIEM. Review evidence.

### Hardening (IT5.07)
- Unnecessary **services/roles/features disabled**; secure baseline (CIS/STIG) applied; SMBv1
  disabled; TLS weak protocols disabled.
- **File integrity**: FIM on critical system files/registry; NTFS permissions on sensitive
  directories least-privilege.

### Patching (IT5.12)
- WSUS/SCCM patch compliance; critical patches within SLA; obtain patch-compliance report and test.

---

## Linux / Unix (Server OS)

### Access control (IT6)
- **root** access minimized; direct root login disabled (`PermitRootLogin no` in sshd_config);
  privilege via **sudo** with logged, least-privilege rules (`/etc/sudoers`); review who can sudo to
  root.
- User accounts in `/etc/passwd`; confirm no non-root accounts with **UID 0**; no accounts with empty
  password fields; system/service accounts have no interactive login (nologin shell).
- Password policy: `/etc/login.defs` (PASS_MAX_DAYS, PASS_MIN_LEN) and PAM (`pam_pwquality`/
  `pam_cracklib`) complexity; account lockout (`pam_faillock`).
- SSH hardened: key-based auth, disable password auth where required, restrict allowed users/groups.

### Audit log & monitoring
- **auditd** enabled with rules for sensitive files/commands; syslog/rsyslog forwarding to SIEM;
  `/var/log/secure` (auth), `/var/log/audit/audit.log`. Logs reviewed and retained.

### Hardening & patching
- Unnecessary services/daemons disabled; CIS baseline; file permissions on `/etc/passwd`,
  `/etc/shadow` (640/000 for shadow), and SUID/SGID binaries reviewed; patch compliance via the
  package manager / patch tool.

---

## Oracle Database

### Access control (IT6 / IT5)
- **DBA connection hygiene**: DBAs must not use `CONNECT INTERNAL`/shared SYS; each DBA has a unique
  account. Review who has **DBA** role and **SYSDBA/SYSOPER**.
- **OS authentication**: `REMOTE_OS_AUTHENT` should be **FALSE** (deprecated/removed in modern
  versions — confirm not enabled). If OS auth is used, review `OS_AUTHENT_PREFIX` and externally-
  identified users (OPS$); list password-file users: `SELECT * FROM V$PWFILE_USERS;`.
- **Default/seeded accounts** (SYS, SYSTEM, DBSNMP, OUTLN, etc.) — locked or passwords changed from
  defaults; check `DBA_USERS` account_status.
- **Powerful privileges**: review roles/users granted `INSERT/UPDATE/DELETE` on financial tables, and
  ANY-privileges. Roles granted **WITH ADMIN OPTION**: `SELECT * FROM DBA_ROLE_PRIVS WHERE
  ADMIN_OPTION='YES';` (grantee can pass the role on — justify).
- **Data dictionary protection**: `SELECT NAME,VALUE FROM V$PARAMETER WHERE
  NAME='O7_DICTIONARY_ACCESSIBILITY';` should be **FALSE**; if TRUE, review who has `SELECT ANY TABLE`.
- **Source-code exposure**: users should not have access to `DBA_SOURCE` (all stored procs/functions/
  triggers) — check `SELECT * FROM DBA_TAB_PRIVS WHERE TABLE_NAME='ALL_SOURCE';` (only DBAs).
- **File/directory permissions** (Linux $ORACLE_HOME): review execute/write access to `\oracle\bin`
  (executables), `\network\admin` (listener.ora), `\dbs` (spfile), `\rdbms\audit` (audit trail .aud).

### Password/profile config (IT5.04)
- Password rules enforced via **profiles**: `DBA_PROFILES` (FAILED_LOGIN_ATTEMPTS,
  PASSWORD_LIFE_TIME, PASSWORD_REUSE_MAX, PASSWORD_VERIFY_FUNCTION). Confirm meet the standard.

### Audit / logging (IT5.08/09)
- Auditing enabled: traditional `AUDIT_TRAIL` parameter or **Unified Auditing** (modern);
  `AUDIT_SYS_OPERATIONS=TRUE` to audit SYS actions. Audit policies capture logons, privilege use, and
  DDL/DML on sensitive objects; audit trail protected and reviewed.

### Encryption / network (IT7)
- **Encryption at rest**: Transparent Data Encryption (TDE) for sensitive tablespaces/columns.
- **Encryption in transit**: Oracle Native Network Encryption or TLS on the listener; secure the
  **listener** (password/local-only admin, no unauthenticated remote admin).
- **Trusted relationships / DB links**: review `DBA_DB_LINKS` — links can propagate access across DBs;
  justify each and confirm they don't expose privileged paths.

---

## SQL Server

### Access control
- **sysadmin (sa)** role membership minimized; **sa** account disabled or renamed with a strong
  password; prefer **Windows Authentication** over Mixed Mode.
- Review server roles (sysadmin, securityadmin) and db roles (db_owner) membership; least privilege.
- Enumerate logins/users: `sys.server_principals`, `sys.database_principals`, role membership via
  `sys.server_role_members`.

### Config / hardening
- Password policy enforced for SQL logins (CHECK_POLICY on); surface area minimized (xp_cmdshell
  disabled unless justified); CIS baseline; latest cumulative updates applied.

### Audit / encryption
- **SQL Server Audit** enabled for logins, permission changes, and sensitive-data access; logs
  reviewed. **TDE** for at-rest encryption; TLS for connections; sensitive columns encrypted (Always
  Encrypted) where required.

---

## How to test any infrastructure control
1. Obtain the **hardening standard/baseline** (criterion).
2. Obtain the **system-generated** config/user extract (IPE-test it — many of the queries above ARE
   the extract).
3. Compare each setting/account to the baseline and least-privilege expectation.
4. Sample changes (patches, config, access) and inspect change-control evidence.
5. Document exceptions (setting weaker than baseline, excess privilege, default account active,
   logging off) and conclude.

## Common infrastructure findings
Default/vendor accounts active; excessive admin/DBA/root/sysadmin membership; weak password
parameters; O7_DICTIONARY_ACCESSIBILITY=TRUE or REMOTE_OS_AUTHENT=TRUE; logging/auditing disabled or
unreviewed; missing at-rest/in-transit encryption; unpatched systems; overly permissive firewall
rules or ANY-ANY permits; no NTP; unrestricted DB links.
