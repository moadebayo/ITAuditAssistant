# IT Application Controls (ITAC), IPE Testing, and SOC Reports

## Part 1 — IT Application Controls (ITAC)

Application controls are specific to each application and relate to the transactions and data of that
system. Objective: ensure **completeness and accuracy of records** and the **validity of entries**
resulting from programmed processing. Unlike ITGC (which apply broadly across the environment), ITAC
are tied to a specific business process/transaction within one application.

The four ITAC categories:

### Input controls
Ensure data entered is complete, accurate, and valid before processing. Test for:
- **Edit / validation checks**: field format, range, and reasonableness checks; mandatory fields;
  valid-value / lookup validation (only valid codes accepted).
- **Completeness checks**: sequence checks, batch totals, record counts, control totals reconciled to
  source.
- **Authorization**: input requires appropriate approval (e.g., a new vendor or a journal entry above
  a threshold requires a second approver).
- **Duplicate prevention**: system rejects duplicate invoices/keys.
- **Error handling**: rejected items are logged, reported, corrected, and re-entered (suspense/hold
  file that is worked and cleared).

To test an automated edit check: attempt to enter data that violates the rule and confirm the system
rejects it (reperformance), then rely on change management over the configuration.

### Data processing controls
Ensure data is processed completely and accurately once accepted. Test for:
- **Calculation/computation** accuracy (reperform a calculation the system performs).
- **Run-to-run / control totals** carried and reconciled between processing steps.
- **Interface controls**: data transferred between systems is complete and accurate — record counts
  and hash/control totals reconcile on both ends; interface errors are captured and resolved.
- **Automated posting logic / configuration** (e.g., account determination) is correct.
- **Standing/master data** used in processing is controlled.

### Output controls
Ensure output (reports, files, statements) is complete, accurate, and distributed only to authorized
recipients. Test for: reconciliation of output totals to input/processing; report distribution
restrictions; review of output for reasonableness; secure handling of sensitive output.

### Application audit trail controls
Ensure the application records who did what and when. Test for: audit/transaction logging enabled;
logs capture key financial transactions and master-data changes; logs are protected from tampering
and retained; logs are reviewed where the control relies on review.

**Testing an ITAC** generally = confirm the automated control is configured correctly (reperform/test
one), then rely on **ITGC change management** over that application to conclude the config didn't
change during the period. This is why ITAC reliance depends on effective ITGC — always state that
dependency.

---

## Part 2 — IPE (Information Produced by the Entity)

**IPE** = the actual information/report/listing an auditor uses to test, assess, and conclude on a
control. If evidence is IPE and its completeness & accuracy (C&A) are not proven, no conclusion drawn
from it is reliable. **Every piece of evidence must pass IPE testing before it can be relied on.**

### Types of IPE
- **Manually generated IPE** — e.g., a user takes a screenshot of a user-access screen.
- **System/automatically generated IPE** — e.g., a SQL query exported to a user listing. System-
  generated IPE has additional considerations (the query logic and parameters themselves must be
  validated).

### The questions IPE testing must answer
- How do I verify the listing is really from system A (the valid system of record)?
- How do I verify the listing is **complete**?
- How do I verify the listing is **accurate**?
- How do I verify there are no hidden exclusions?

### The three components of an IPE report to validate
1. **Source data** — where did the data originate? A report extracted after passing through several
   intermediary tools gives less assurance than one straight from the system of record. Validate the
   source is the valid system of record.
2. **Report logic** — the query/code/formula that transforms source data into the report. Validate the
   logic (standardized report or the actual query used).
3. **Parameters / filters** — the criteria applied before extraction. Distinguish legitimate filters
   (relevance, e.g., a date range) from concealing filters (e.g., hiding terminated-but-active users
   to bury a deviation). Concealing filters are a serious integrity problem — prove C&A for all IPE.

### Key IPE characteristics to document
Who produced it; which system it came from; whether it was produced within the in-scope period; the
timestamp; and how completeness and accuracy were determined.

### Practical C&A techniques
- **Completeness**: reconcile record counts to an independent total; re-run the report yourself or
  observe it being run; compare to a full-population count from the system; check for filters.
- **Accuracy**: trace a sample of records back to the source system / underlying screen;
  reperform the query; inspect the query logic and parameters.

---

## Part 3 — SOC reports (service organizations)

A **SOC (Service Organization Controls)** report verifies that a third party you outsource a function
to follows sound control practices. Reports are produced and validated by independent third-party
(CPA) auditors to give user organizations assurance about the service provider's controls.

### SOC report types
- **SOC 1** — controls relevant to the user's **internal control over financial reporting (ICFR)**.
  Based on SSAE 18. Most relevant to SOX when a service org processes financially-significant data.
- **SOC 2** — controls over the **Trust Services Criteria**: Security (mandatory), plus optional
  Availability, Processing Integrity, Confidentiality, Privacy. Relevant to data protection / vendor
  risk.
- **SOC 3** — a public, general-use summary version of SOC 2 (no detailed testing results).

### Type I vs. Type II (applies to both SOC 1 and SOC 2)
- **Type I** — tests the **design** of controls at a **point in time**. Does not test operating
  effectiveness.
- **Type II** — tests the **operating effectiveness** of controls **over a period**, using a sampling
  methodology. This is what you generally need for reliance.

### What to review in a SOC report (checklist)
1. **Scope** — does the report's title/system description cover the product/service you actually use?
2. **Period** — is it current, and does the coverage period meet your needs (Type II period vs. Type I
   point-in-time)? If a gap exists, request a **bridge letter** to cover the uncovered portion.
3. **Service auditor** — is the issuing CPA firm reputable? (Named in Section I.)
4. **Auditor opinion** — Unqualified / Qualified / Adverse / Disclaimer. (Section I.)
5. **Management's assertion** — present, and consistent with the auditor's opinion? Missing or
   divergent assertions warrant a conversation with the service org.
6. **Processes, people & systems** — adequately described? If a key process (e.g., information
   security) isn't described, ask about it.
7. **Complementary User Entity Controls (CUECs / UCCs)** — controls the service org is *not*
   responsible for that **you** must have in place for the service org's controls to work. Review each,
   confirm it's relevant to you, and confirm you have it in place and operating.
8. **Testing procedures & results** — for a Type II, review the extent of testing and any
   findings/exceptions. Findings are common — assess whether each impacts the services you rely on or
   your control environment, and how it was remediated.

For SOX, a **SOC 1 Type 2** report is the standard evidence for an outsourced service affecting ICFR;
you still must evaluate and test the relevant **CUECs** on your side.
