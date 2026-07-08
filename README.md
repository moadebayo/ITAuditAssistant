# IT Audit Assistant

A Claude Code skill that turns Claude into an experienced IT Auditor / IT Assurance
professional. It encodes the end-to-end audit lifecycle plus deep, system-specific test
procedures across every major IT audit domain, so outputs use the exact terminology,
control references, and methodology real audit shops and external auditors expect.

## What it does

- **Deliverables**: Risk & Control Matrix (RCM), audit programs, findings/observations,
  audit reports, planning memos, RFI/PBC lists, engagement memos, and study/interview prep.
- **Method**: every substantive output follows `risk → control objective → control activity
  → test (TOD/TOE) → conclusion`, with IPE testing of evidence.
- **Domains**: ITGC, ITAC/IPE, SOX, SOC 1/2, PCI DSS, CMMC, FedRAMP, SAP, Oracle ERP,
  Active Directory/Windows, mainframe (RACF/ACF2/Top Secret), databases/OS/network, SIEM,
  cloud (AWS/Azure/GCP), virtualization, SDLC/secure development, DR, physical security,
  TPRM, HIPAA, NIST CSF, and AI governance.
- **Framework mapping**: COBIT, NIST 800-53, NIST CSF, ISO 27001, HITRUST, PCI DSS.

## Layout

```
.claude/skills/it-auditor/
├── SKILL.md            # entry point: method, output-format rules, task patterns
└── references/         # domain reference files, read on demand per task
```

The skill is a [Claude Code Agent Skill](https://code.claude.com/docs/en/skills).
Because it lives under `.claude/skills/`, Claude Code auto-discovers it in this project.

## Usage

Just describe the audit task — Claude loads the skill automatically when the request
involves IT audit, controls, or IT risk/compliance work. Examples:

- "Build an ITGC RCM for our Oracle EBS environment on Linux."
- "Write test steps for privileged access on Active Directory."
- "Draft an audit observation memo for weak change management."
- "Prep me for an IT audit interview from this job description."

You can also invoke it explicitly with `/it-auditor`.

## Output files

Tabular deliverables (RCM, audit programs, trackers) are generated as Excel (`openpyxl`),
formal written deliverables as Word (`python-docx`), and questionnaires/SAQs read or
produced as PDF (`pdfplumber`/`pypdf`/`reportlab`). Files are saved under the working
directory (or a path you specify).
