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

> The server loads `.env` automatically at startup (via `dotenv`), so setting
> `ANTHROPIC_API_KEY` (and the other variables) in `.env` is enough — no need to
> export them. On hosts like Railway, set the variables in the dashboard instead;
> real environment variables take precedence over `.env`.

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

## Security & configuration

The app ships with authentication, authorization, and rate limiting built in. Configure them via
environment variables (see `.env.example`):

| Variable | Effect |
|---|---|
| `AUTH_PASSWORD` | When set, **all** generation and skill APIs require a login. The front end shows a sign-in screen. When unset, the app is **open** (a console warning is printed) — anyone who can reach it can generate. |
| `ADMIN_PASSWORD` | Optional. When set, only admins may use the Skill Studio (research + save). Users who sign in with `AUTH_PASSWORD` get generation + read-only browsing. When unset, any signed-in user is an admin. |
| `SESSION_SECRET` | Signs the HMAC session cookie. Set a long random value in production so sessions survive restarts and can't be forged. A random one is generated at startup if unset. |
| `SKILL_WRITE` | Whether the Skill Studio may write references at all. **Default: enabled only when `AUTH_PASSWORD` is set** (safe-by-default). In open mode, writes stay **off** unless `SKILL_WRITE=true`. Set `SKILL_WRITE=false` to force a read-only skill library. |
| `RATE_LIMIT_GENERATE` / `RATE_LIMIT_IMPROVE` / `RATE_LIMIT_LOGIN` | Per-IP request caps over a 15-minute window (defaults 30 / 10 / 10) via `express-rate-limit`. |
| `TRUST_PROXY` | Set when behind a reverse proxy so client IPs are read from `X-Forwarded-For` (needed for correct rate limiting and `Secure` cookies). |

How the controls compose:

- **Authentication** — signed, HttpOnly session cookies (12-hour TTL); passwords are compared in
  constant time. Sign-in is rate-limited to slow brute force. `/api/generate`, `/api/extract`, and
  the skill APIs return `401` without a valid session.
- **Skill writes** — `/api/skills/improve` and `/api/skills/save` require the admin role **and**
  `SKILL_WRITE`; saves are confined to `.claude/skills/it-auditor/references/` (path-checked,
  slug-validated). The Skill Studio UI shows a read-only notice and disables research/save when the
  account can't write.
- **Rate limiting** — the expensive endpoints (`/api/generate`, `/api/skills/improve`) and `/api/login`
  are throttled per IP; a `429` is returned when the window fills.
- **Data handling** — job descriptions, resumes, and audit scope details are sent to the Anthropic API.
  The UI shows a confidentiality notice; check the flow against your firm's obligations before
  uploading client material. For sensitive use, look into zero-retention arrangements. The API key
  stays server-side and is never sent to the browser.
- **Cost** — each generation is a Claude call with a large system prompt; Skill Studio also runs web
  search. The server logs per-call and cumulative token usage to the console so you can watch spend;
  the rate limits bound worst-case cost.

### Still your responsibility

The built-in auth is a shared-password gate suitable for a small team or a protected deployment — not a
multi-tenant identity system. For broader exposure, front it with SSO / a reverse proxy, use per-user
accounts, and persist rate-limit state in a shared store if you run multiple instances.

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
