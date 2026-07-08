# Active Directory / Windows ITGC Audit

Audit of Microsoft Active Directory (Domain Controllers) and the Windows environment as an ITGC layer —
directory services are almost always in scope for SOX because they authenticate access to financial
apps. Maps to the standard ITGC objectives (see `itgc.md`); this file gives the AD/Windows-specific
procedures, navigation paths, and the settings to examine. Also read `infrastructure-audit.md` for the
Windows host layer.

Control refs here follow the IT1–IT8 convention used in the source AD audit program (operations →
security → change control).

## Evidence-collection tools & paths
- **Active Directory Users & Computers** (Administrative Tools) — user accounts, groups, OU delegation.
- **Group Policy** / Default Domain (Controller) Security Policy — account and audit policy settings.
- **Local Security Policy (`secpol.msc`) / `gpresult`** — effective settings on a host.
- **Scheduled Tasks applet / Task Scheduler (formerly AT command)** — job scheduling on Windows.
- **PowerShell / AD tools** — `Get-ADUser`, `Get-ADGroupMember`, `Get-ADDefaultDomainPasswordPolicy`,
  and third-party AD reporting tools produce the system-generated listings (IPE-test them).
- Where automated tools aren't available, the source program references manual collection tabs — for
  the auditor this means documenting the exact screen/path the evidence came from.

## Data Center & Network Operations (IT1–IT3)

**IT1 — Job scheduling/processing supervised (Windows Task Scheduler / AT).**
- IT1.01/02 — Batch/online processing completes normally; processing monitored; exceptions resolved.
- IT1.03 — Transaction logs enabled; reviewed; only authorized users can turn logs on/off.
- IT1.04 — Automated scheduling tools (Windows Task Scheduler) manage jobs; schedule changes approved.
  *Test*: view scheduled tasks (Scheduled Task applet → View Log via Advanced menu); assess the task
  list for appropriateness; confirm logging of schedule changes; confirm only appropriate users can
  manage tasks; confirm management reviews the schedule.
- IT1.05 — Access to scheduling tools and executable programs restricted; only authorized users can
  execute/modify/delete/create jobs. *Test*: obtain the list of users who can define/modify production
  schedules; assess for appropriateness.

**IT2 — Data managed during update/storage (backup & retention).** Automated retention tools; backup of
Windows system files critical to financial processing and managed storage areas; backups scheduled/
supervised; media labeled and stored in a secure, environmentally-controlled location; off-site
archival; periodic **restore testing** for readability. (Same test logic as ITGC IT3.)

**IT3 — Physical security of facilities.** Physical access mechanism restricts access; authority to
change the mechanism restricted; server-room access monitored and granted with IT management approval;
periodic review of physical access. (See `sdlc-dr-physical-tprm.md` for depth.)

## Information Security (IT4–IT5) — the AD core

**IT4 — Logical security / access.**
- IT4.01 — Network/comms-software access security policies documented; compliance monitored.
- IT4.02 — **Password/authentication** enforced via **Domain Account Policies** (and any relevant OUs).
  *Test*: examine the AD domain password parameters and confirm they meet corporate policy —
  **required password length, password expiration/max age, password history, login attempts before
  lockout, lockout duration/reset time, and complexity**. Confirm local account policy on member
  servers is also in line. Remember Domain Account Policy values can be **overridden at the individual
  account level**, so also obtain a system-generated account listing including:
    - **Password Never Expires (Yes/No)** — examine users flagged Yes for appropriateness.
    - **Last Password Change (date)** — examine users whose passwords weren't changed per policy.
    - Account status (enabled/disabled), account lockout, "user cannot change password".
- IT4.03 — **Windows default accounts safeguarded**: built-in **Administrator renamed** and secured;
  **Guest disabled**; default account passwords changed.
- IT4.04 — **Privileged access limited.** Keep the number of accounts with Administrator privilege to a
  minimum; used only for admin functions. *Test*: enumerate membership of privileged groups —
  **Domain Admins, Enterprise Admins, Schema Admins, Administrators, Account Operators** — and any
  accounts with **delegated administrative authority over OUs of interest**; confirm each is
  appropriate and that management periodically reviews these groups. Built-in Administrator renamed.
- IT4.05 — **Security event logging/monitoring configured** (audit policy) and reviewed: audit logs
  securely stored/retained, access to logs restricted, logs regularly reviewed, and action taken on
  anomalies. *Manual path*: audit policy in the Local Policies section of the Default Domain
  (Controller) Security Policy; directory/file audit via folder Properties → Security → Advanced →
  Auditing.
- IT4.06 — Security settings configured to prevent unauthorized use; configuration options documented;
  management reviews/approves changes to security configuration.
- IT4.07 — **Unique user IDs**; access to **shared/generic accounts** monitored with a valid business
  rationale. *Test*: obtain the AD account listing; identify enabled shared/generic accounts; confirm
  justification and monitoring.
- IT4.08 — User access privileges authorized by management and **periodically reviewed** (recertified).
- IT4.09 — **Movers/leavers**: security admin notified of role changes/transfers/terminations; access
  changed immediately. *Test*: compare the AD account listing to the HR active-employee/termination
  listing (VLOOKUP/MS Access) to confirm terminated/transferred users are disabled/updated timely.
- IT4.10 — IT staff access rights **appropriately segregated** (SoD); conflicts corrected.
- IT4.11 — **Workstation/terminal time-out/auto-lock** after inactivity configured.

**IT5 — Configuration & security settings.**
- IT5.01 — Security config policies documented; compliance monitored.
- IT5.02 — **Sensitive data encrypted in transit**; access to encryption software controlled.
- IT5.03 — **Patch management**: Windows service packs/security updates/patches/hot-fixes evaluated for
  applicability and applied timely; management aware of new vulnerabilities and releases. Confirm
  presence of at least **Critical and Important** updates (Microsoft severity ratings: Critical /
  Important / Moderate / Low).
- IT5.04 — **File system access** restricted to critical Windows system files and managed storage
  areas holding financial data/applications (NTFS permissions via folder Properties → Security);
  management reviews file-access configuration and approves changes.
- IT5.05 — **Ownership** of network/comms software defined for accountability.
- IT5.06 — **Trust relationships** configuration approved and monitored. A trust lets a trusting domain
  honor logon authentications from a trusted domain — trusted domains can be a path for illegal access,
  and weak security in a trusted domain undermines the trusting domain. Examine configured trusts for
  appropriateness and approval.

## Change Control (IT6–IT8)
Acquisition/development (IT6), implementation/testing (IT7), and change management/transfer to
production (IT8) for network and communication software — mirrors ITGC IT8/IT9/IT10: changes
documented, tested in a separate environment, approved before production, developers restricted from
production, post-implementation review, and vendor updates (service packs/patches) documented and
approved. Use the ITGC change-management test pattern.

## Common AD/Windows findings
Excessive Domain/Enterprise Admin membership; built-in Administrator not renamed / Guest enabled;
Password-Never-Expires on interactive accounts; individual-account overrides weaker than the domain
policy; terminated users still enabled in AD; shared/generic accounts without justification; audit
policy not capturing (or not reviewing) security events; unmanaged trust relationships; missing
Critical/Important patches; weak domain password parameters.
