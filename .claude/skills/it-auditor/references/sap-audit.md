# SAP Audit (ECC / S/4HANA)

Covers logical security, segregation of duties, change/transport management, basis/configuration, and
logging for SAP ECC and S/4HANA. Combine with `itgc.md` (control objectives) and
`deliverable-templates.md` (output format). Verify t-codes/tables against the client's release; most
below are stable across ECC and S/4HANA, with S/4HANA notes where relevant.

## SAP authorization concepts (know these cold)
- **User master record** — the account (t-code SU01). Assigned **roles**.
- **Role (PFCG)** — a container of **authorization objects** and their field values; generates a
  **profile**. Single roles vs. **composite roles** (bundles of single roles).
- **Authorization object** — checks specific field values (e.g., object **S_TCODE** controls which
  transaction codes a user can start; **F_BKPF_BUK** controls company-code posting).
- **Profile** — the technical result assigned to the user. **SAP_ALL** = every authorization (super-
  user); **SAP_NEW** = new authorizations after an upgrade. Both are highly sensitive.
- Access is enforced by the combination of t-code (S_TCODE) **and** the underlying authorization
  objects — testing only t-codes is insufficient; check object-level values.

## Key tables and t-codes for evidence
- **User listing / status**: t-code **SUIM** (user information system) is the primary audit tool;
  tables **USR02** (logon data incl. lock status, last logon), **USR01**.
- **Users with a role/profile**: SUIM → Users by Roles / by Profiles; tables **AGR_USERS** (role→user),
  **UST04** (user→profile), **AGR_1251** (role authorization values).
- **Roles**: table **AGR_DEFINE**; role change docs **AGR_1016**.
- **Change documents for user/authorization**: tables **USH02**, **USH04**; SUIM → Change Documents.
- **Table change logging**: **DBTABLOG** (requires `rec/client` profile param and table logging flag).
- **System change options**: t-code **SE06 / SCC4** (client settings), **SE03**.
- **Transport management**: t-code **STMS**; transports in tables **E070/E071**.
- **Security audit log config**: t-code **SM19** (define) / **SM20** (evaluate); parameters
  `rsau/enable`, `rsau/selection_slots`.
- **Profile parameters**: t-code **RZ10 / RZ11**; report **RSPARAM**.

## Test areas

### 1. User access & administration (maps to IT6)
- Obtain a **system-generated** complete user listing via SUIM (IPE-test it): user ID, name, status
  (locked/active via USR02), roles/profiles, last logon, valid-from/to.
- **Dormant/inactive accounts**: identify users with no logon beyond the threshold (USR02 last-logon)
  that are still active.
- **New user provisioning**: sample new users in the period; confirm authorized request/approval per
  least privilege.
- **Terminations/transfers**: reconcile HR terminations to SAP; confirm accounts locked/expired
  timely; confirm transfers had old access removed.
- **Access recertification**: obtain evidence roles were reviewed/recertified periodically.

### 2. Privileged & sensitive access
- **SAP_ALL / SAP_NEW holders**: SUIM → Users by profile = SAP_ALL. Should be near-zero, restricted to
  emergency/firefighter use, and monitored.
- **DDIC and SAP\*** default/superuser accounts: confirm locked or password changed; SAP\* should not
  be usable, DDIC restricted.
- **Firefighter / emergency access** (SAP GRC or equivalent): confirm break-glass access is checked
  out with approval, time-boxed, and log-reviewed.
- Sensitive basis access: **SE16/SE16N/SM30** (direct table maintenance — can bypass application
  controls), **SM49/SM69** (external OS commands), **SE38/SA38** (run ABAP programs), **DEBUG with
  replace**, **SCC5** (client delete). Restrict tightly and justify each holder.

### 3. Segregation of Duties (SoD)
- Test at the **transaction + authorization-object** level, not just t-codes. Typical conflict rule
  set (customize to the client's ruleset — e.g., SAP GRC Access Control ruleset):
  - Maintain vendor master **and** post/pay invoices (create fictitious vendor → pay it): FK01/FK02
    (or XK01) vs. FB60/F110.
  - Create purchase order **and** approve/receive goods **and** process invoice: ME21N vs.
    MIGO vs. MIRO.
  - Maintain customer master **and** post cash receipts / credit memos.
  - Post journal entries **and** approve/park journal entries: FB01/FB50 vs. FBV0.
  - Maintain payroll master data **and** run payroll.
  - **Basis/security SoD**: user administration (SU01) vs. role building (PFCG) vs. approving access.
- Obtain the SoD ruleset and the conflict report (from GRC or a manual SUIM cross-reference); for
  flagged conflicts, confirm they are mitigated (monitoring control) or remediated.

### 4. Change & transport management (maps to IT8/IT9/IT10)
- **Client settings (SCC4)**: production client should be **"not modifiable"** and closed to changes/
  customizing; changes are made in DEV and transported. Confirm production is not open.
- **System change option (SE06)**: production set to "Not modifiable".
- **Transport path**: DEV → QAS → PRD. Confirm transports are tested in QAS and imported to PRD with
  approval; sample transports (E070/E071 or STMS import history) and inspect the request, test
  evidence, and import approval.
- **Developer access in production**: developers should not have change/transport-release access in
  PRD; check S_TRANSPRT and debug/replace authorizations.
- **Table logging**: confirm `rec/client` is enabled and logging flags set for financially-significant
  config tables (DBTABLOG).

### 5. Configuration / basis security (maps to IT5)
- **Password/logon parameters (RSPARAM / RZ11)**: `login/min_password_lng`,
  `login/password_expiration_time`, `login/fails_to_user_lock`, `login/password_compliance_to_current_
  policy`, `login/password_charset`, `login/no_automatic_user_sapstar`.
- **Security Audit Log (SM19/SM20)**: enabled (`rsau/enable = 1`), capturing critical events
  (failed logons, SAP_ALL use, debug, transaction starts for sensitive t-codes); logs reviewed.
- **Gateway / RFC security**: `gw/reg_no_conn_info`, secure RFC destinations (SM59 — check stored
  credentials/trusted RFC), `reginfo`/`secinfo` files.
- **SNC / encryption** for network traffic; **UCON** to restrict RFC function modules (S/4HANA).
- **Patch/note management**: SAP Security Notes applied timely (t-code checking via SNOTE / System
  Recommendations in Solution Manager).

### 6. S/4HANA-specific notes
- **Fiori** front-end: authorizations flow through catalogs/groups and OData services — test the
  business role and the underlying authorization objects, and SICF service activation.
- **HANA database** underneath: audit the HANA DB layer separately (system privileges like
  DATA ADMIN, USER ADMIN; the SYSTEM user should be deactivated; audit policies enabled). See
  `infrastructure-audit.md` for DB principles.

## Common SAP findings
Excessive SAP_ALL holders; DDIC/SAP\* not secured; production client open (SCC4 modifiable);
developers with production change access; unremediated SoD conflicts without mitigating controls;
Security Audit Log disabled or unreviewed; weak logon parameters; direct table maintenance
(SE16N/SM30) not restricted.
