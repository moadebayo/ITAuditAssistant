# Oracle ERP Audit (Oracle EBS / E-Business Suite & Oracle Cloud / Fusion)

Covers Oracle EBS (R12) and Oracle Cloud (Fusion) ERP. Combine with `itgc.md` and, for the underlying
Oracle Database, `infrastructure-audit.md`. Navigation paths below assume EBS R12; note Fusion
equivalents where given.

## Oracle EBS access concepts
- **User** — the account (created/managed via User Management, table **FND_USER**).
- **Responsibility** — the primary access bundle; determines menus, functions, and data a user can
  reach (table **FND_RESPONSIBILITY**). A user is assigned one or more responsibilities
  (**FND_USER_RESP_GROUPS**).
- **Menu / Function** — responsibilities grant **functions** (forms/pages) via **menus**; function
  exclusions can restrict.
- **Data access**: controlled by profile options, operating units (MOAC), and security profiles.
- **UMX (User Management)** provides Security Reports to list users by function/responsibility — the
  key auditor evidence tool.
- **Profile options** (System Administrator → Profile → System) drive many security-relevant settings.

## Key evidence sources (EBS)
- **User listing**: FND_USER; UMX Security Reports → "List of Users".
- **Users by responsibility/function**: UMX Security Reports → List of Users → "For a Given" =
  Responsibility or Function.
- **Responsibilities & assignments**: FND_RESPONSIBILITY, FND_USER_RESP_GROUPS.
- **Sign-on/audit data**: Sign-On Audit (profile "Sign-On:Audit Level"); FND_LOGINS,
  FND_UNSUCCESSFUL_LOGINS; **FND_AUDIT** tables (AuditTrail) for tracked columns.
- **Concurrent programs/managers**: System Administrator → Concurrent → Manager → Administer;
  FND_CONCURRENT_* tables.

## Test areas

### 1. User access & administration (IT6)
- Obtain a system-generated complete user listing (FND_USER via UMX report), IPU-test it: user, status
  (active/end-dated), responsibilities, last logon.
- **New users**: sample new users in period; confirm authorized request/approval; least privilege.
- **Terminations/transfers**: reconcile HR terminations to FND_USER end-dates; confirm accounts
  end-dated timely; transfers had responsibilities adjusted.
- **Inactive accounts**: identify accounts with no sign-on beyond threshold that are not end-dated.
- **Access review/recertification**: obtain periodic review evidence of users and responsibilities.

### 2. Privileged / sensitive access
- **System Administrator** responsibility and **Application Developer** — powerful; restrict and
  justify holders.
- **SYSADMIN** default account — confirm secured / password changed / monitored.
- Sensitive functions: user management (creating users/responsibilities), profile option changes,
  concurrent program definition, and forms allowing direct data update.
- **Segregation of Duties** (customize to Oracle ruleset): create supplier vs. enter/pay invoices
  (AP); create customer vs. receive cash (AR); enter journals vs. post journals (GL); create PO vs.
  receive vs. match invoice (P2P); plus security admin vs. approving access. Obtain the SoD/conflict
  report (Oracle Risk Management Cloud / GRC or manual cross-reference) and confirm conflicts are
  mitigated or remediated.

### 3. Concurrent processing / batch jobs (IT1 / IT2)
Batch processes and reports run as **concurrent requests** executed by **concurrent managers** (the
Oracle utility that starts concurrent programs). Some concurrent requests can update data, run
interfaces, view/manipulate financial data — so access is sensitive.
- **List concurrent managers**: System Administrator → Concurrent → Manager → Administer (or OAM →
  Concurrent Managers). Review for appropriateness/validity.
- **Access to administer concurrent managers**: UMX Security Reports → List of Users → For a Given =
  Function; search functions matching "%concurrent%"; review users. Have management confirm
  appropriateness.
- **Access to administer concurrent programs** and **to submit concurrent requests**: same UMX
  approach for the relevant functions; confirm submission of sensitive requests is restricted.
- **Monitoring/error resolution**: confirm failed/errored requests are identified and resolved timely.

### 4. Change management (IT8/IT9)
- Confirm separate DEV/TEST/PROD instances; migrations follow the change process (tested, approved).
- Developer access in production restricted; customizations (custom forms, reports, personalizations)
  go through change control.
- Patching (Oracle Critical Patch Updates) applied timely.

### 5. Configuration / security (IT5)
- **Password/logon profile options**: `SIGNON_PASSWORD_LENGTH`, `SIGNON_PASSWORD_HARD_TO_GUESS`,
  `SIGNON_PASSWORD_NO_REUSE`, `SIGNON_PASSWORD_FAILURE_LIMIT`, `ICX:Session Timeout`.
- **Sign-On:Audit Level** set to at least "Form" for accountability.
- **AuditTrail** enabled for sensitive tables/columns where relied upon.
- **Guest/default accounts** (GUEST) secured.

### 6. Oracle EBS application-security deep controls (IT4.x)
These are EBS-specific security controls beyond generic ITGC — test each with a system-generated
listing (IPE-tested):
- **SYSADMIN user secured** — the default super-user; confirm password changed, restricted, monitored.
- **GUEST user secured** — the seeded GUEST account is appropriately restricted.
- **Password decryption vulnerability mitigated** — legacy EBS stored password hashes could be
  decrypted; confirm management applied the relevant mitigation (e.g., disabled/removed access to the
  vulnerable views, applied the Oracle-recommended fix).
- **Privileged system administration access restricted** — only authorized admins hold System
  Administrator/OAM-level access.
- **Direct database access restricted (IT4.07)** — access to view/add/modify/delete data directly in the
  database is restricted, so application users can't bypass application-level validations, access
  controls, and change management. (Test the DB layer per `infrastructure-audit.md`.)
- **Proxy feature restricted (IT4.08)** — the EBS proxy-user feature can grant one user another's access;
  restrict to prevent inappropriate access and SoD violations.
- **Oracle Applications Manager (OAM) access restricted (IT4.09)** — to admins with day-to-day system
  administration responsibility.
- **Alert management access restricted (IT4.10)** — to prevent concealment of fraudulent activity.
- **Personalizations disabled in production (IT4.11)** — EBS Forms/Framework personalization features
  disabled in prod so users can't circumvent security and change management.
- **Trusted-machines restriction (IT4.12)** — access to sensitive sysadmin responsibilities limited to
  logins originating from trusted machines/web servers (node/trust configuration).
- **Sensitive-data view access restricted (IT4.14)** — access to private/confidential information limited.
- **Information-disclosure protections (IT4.15)** — techniques prevent disclosure of sensitive system
  information (e.g., diagnostics, error verbosity).
- **SQL/HTML injection mitigations (IT4.16)** — application-layer protections against injection.
- **Security event logging (IT4.17)** — security events detected/recorded/reported; logs reviewed with
  follow-up. **Sign-On:Audit Level** and **AuditTrail** support this.
- **Patching (IT4.18)** — Oracle Critical Patch Updates applied timely.

### Evidence workflow (EBS reporting mechanics)
The standard way to pull EBS access evidence:
- **Report Group Responsibilities** report (System Administrator → Requests → Run → Single Request) —
  which responsibilities have access to given reports/request sets (concurrent request access).
- **Users of a Responsibility** report — users assigned a given responsibility.
- **Active Users** report — all active usernames and their assigned responsibilities.
- **UMX Security Reports** (R12.1.1+): User Management → Security Reports → "List of Users" → "For a
  Given" = Function / Responsibility / Data Security Object — the primary way to list who can reach a
  sensitive function (search functions by name, e.g., "%UMX%", "%FND%", "%concurrent%", or containing
  USER/ROLE/RESP for administration functions).
- **Function Security vs. Data Security**: function security restricts menus/menu options; data security
  restricts the data reachable once a menu option is selected — test both when concluding on access.
- **New hires** via Oracle HRMS ("Employee Payroll Movements Report") or HR listing; **flexfield value
  security** via Application Developer / UMX "List of Users for a Data Security Object"
  (FND_FLEX_VSET_OBJECT). Where UI reports aren't sufficient (pre-R12.1.1), management runs SQL scripts
  (e.g., Oracle MOS notes) — IPE-test the script logic.

## Oracle Cloud / Fusion ERP specifics
- Access model: **Users → Roles**, with **Job roles → Duty roles → Privileges**, plus **Data Roles /
  Data Security** and **Security Console** administration.
- Evidence via **Security Console**, BI Publisher / OTBI reports (e.g., "User Role Membership", "User
  and Role Access Audit Report", "Inactive Users Report").
- SoD via **Oracle Risk Management Cloud (Advanced Access Controls / Advanced Financial Controls)**.
- Privileged: **IT Security Manager**, **Application Implementation Consultant**, and any role granting
  user/role administration.
- Confirm SSO/MFA configuration; password policy in Security Console; audit policies enabled.

## Common Oracle ERP findings
Excessive System Administrator/SYSADMIN access; unrestricted access to submit sensitive concurrent
requests or administer concurrent managers; unremediated SoD conflicts; weak signon password profile
options; Sign-On Audit disabled; terminated users not end-dated timely; developers with production
access.
