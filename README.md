# ITAuditVault

An IT audit AI assistant. Generate risk & control matrices, audit programs, engagement memos,
RFIs, observation memos, and audit reports for **any platform, framework, or standard** — plus
resume and interview prep for auditors. Every draft is grounded in a bundled **IT Audit skill**,
and a built-in **Skill Studio** lets the skill improve itself from publicly available resources.

## Highlights

- **Workpaper-grade drafts** — output uses real control references, commands, and test procedures,
  not generic filler. The server selects the skill references matching your platform and framework
  and feeds them to Claude.
- **The full IT Audit skill, built in** — 22 reference files covering ITGC, ITAC/IPE, SOX, SOC 1/2,
  PCI DSS, CMMC, FedRAMP, AI audit, SAP, Oracle EBS, mainframe (RACF), Active Directory, cloud, SIEM,
  databases, SDLC, DR, TPRM, HIPAA, NIST CSF, and more.
- **Skill Studio (self-improving)** — browse the reference library, then have Claude research
  authoritative public sources (NIST, ISO, PCI SSC, AICPA, CIS, vendor docs) via the **web search**
  tool to expand a domain or add a new one. Approved references are written back into the skill and
  used immediately for generation.
- **Same skill as Claude Code** — the app reads and writes `.claude/skills/it-auditor/`, so the skill
  that grounds the web app is the same one Claude Code loads for this repo.

## What it generates

**Engagement documents** — announcement memo · planning memo · request for information (RFI) ·
observation memo · audit report

**Workpapers** — risk & control matrix · detailed audit program · walkthrough / test of design ·
compliance gap assessment

**Career tools** — interview questions & answers (from a job description + resume) · targeted resume

## Quick start

**Requirements:** Node.js 18 or later.

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env
#    then edit .env and set ANTHROPIC_API_KEY=sk-ant-...

# 3. Run
npm start
```

Open <http://localhost:3000>.

### Demo mode

Without `ANTHROPIC_API_KEY` the app runs in **demo mode** — the picker, forms, file upload, streaming,
and Skill Studio all work, but output is a fixed sample rather than a real generation. The header badge
shows the mode. Add the key and restart to go live.

> `npm start` does not read `.env` automatically. Either export the variable
> (`export ANTHROPIC_API_KEY=sk-ant-...`) before running, or add `dotenv` and
> `import 'dotenv/config'` at the top of `server/index.js`.

Get an API key at <https://console.anthropic.com>.

## How it works

```
public/index.html                     single-file front end (no build step); Generate + Skill Studio views
server/index.js                       Express server: static hosting, file extraction, streaming generation,
                                       Skill Studio (browse + self-improve)
.claude/skills/it-auditor/            the IT Audit skill — SKILL.md + 22 reference files (the skill's home;
                                       also loaded by Claude Code for this repo)
```

On startup the server loads every reference file. For a generation request it picks a **base set** of
references for the artifact type, **routes on keywords** in your inputs to add domain references
(e.g. "RACF" → `mainframe-audit`, "PCI" → `pci-dss-audit`, "AWS" → `cloud-and-emerging`), builds a
system prompt (house style + selected references + a task spec), and streams the response over
Server-Sent Events.

The Skill Studio uses Claude's server-side **`web_search`** tool to research public sources and draft a
new or improved reference in the library's house style, ending with a list of sources. Saving writes
the file into `.claude/skills/it-auditor/references/` and hot-reloads the skill.

### API

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | `{ live, model, refs }` — is a key configured? |
| `/api/extract` | POST | multipart file → `{ text }` (pdf, docx, txt, md) |
| `/api/generate` | POST | `{ artifact, artifactName, inputs }` → SSE stream of `{ text }` |
| `/api/skills` | GET | `{ skills: [{ name, title, summary, words }] }` — browse the library |
| `/api/skills/:name` | GET | `{ name, title, markdown }` — read one reference |
| `/api/skills/improve` | POST | `{ name? , topic?, instructions? }` → SSE stream + `{ sources }` (web-grounded draft) |
| `/api/skills/save` | POST | `{ name, markdown }` → persist a reference and hot-reload the skill |

## Deployment

The API key stays server-side — it is never sent to the browser. Don't move generation into the front
end, or the key becomes public.

**Any Node host** (Render, Railway, Fly.io, Heroku, a VPS):

1. Push the repo (`.env` is gitignored — don't commit your key).
2. Set `ANTHROPIC_API_KEY` as an environment variable in the host's dashboard.
3. Build command `npm install`, start command `npm start`.
4. The server binds to `process.env.PORT`, which these platforms set automatically.

**Docker:**

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm","start"]
```

### Before putting it in front of real users

This is a working application, not a hardened product. Consider:

- **Authentication** — there is none. Anyone who can reach the server can spend your API budget and
  write to the skill library via the Skill Studio.
- **Skill writes** — `/api/skills/save` writes files into `.claude/skills/it-auditor/references/`
  (confined to that directory). On a shared deployment, gate it behind auth or make it read-only.
- **Rate limiting** — add `express-rate-limit` on `/api/generate` and `/api/skills/improve`.
- **Data handling** — job descriptions, resumes, and audit scope details are sent to the Anthropic API.
  Check that against your firm's confidentiality obligations before uploading client material.
- **Cost** — each generation is a Claude call with a large system prompt; Skill Studio also runs web
  search. Watch usage.

## A note on the output

Everything ITAuditVault produces is a **draft**. It reflects the reference material and what you typed,
not the actual state of a client's controls. An auditor still has to scope the engagement, gather and
IPE-test the evidence, perform the testing, and reach the conclusions. Independence, professional
skepticism, and the standards your work is performed under remain yours.

Use it to skip the blank page, not the audit.

## The skill

`.claude/skills/it-auditor/` is a [Claude Code Agent Skill](https://code.claude.com/docs/en/skills):
Claude Code auto-discovers it for this repo (also invokable as `/it-auditor`), and the web app uses the
same directory as its knowledge base and self-improvement target.
