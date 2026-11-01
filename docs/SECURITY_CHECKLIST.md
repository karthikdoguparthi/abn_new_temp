# Production Readiness, Architecture & Security Checklist

This document operationalizes the industry standards referenced from [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101), [binhnguyennus/awesome-scalability](https://github.com/binhnguyennus/awesome-scalability), [PrekshaShah2509/production-ready-checklist](https://github.com/PrekshaShah2509/production-ready-checklist), [trimstray/the-book-of-secret-knowledge](https://github.com/trimstray/the-book-of-secret-knowledge), and [upgundecha/howtheysre](https://github.com/upgundecha/howtheysre).

---

## 1. Automated Pre-Deployment Action Plan Status

| Step | Action Item | Implementation in This Repository | Status |
|---|---|---|:---:|
| **1** | **Enable GHAS & CodeQL** | Configured in [`.github/workflows/ci-security.yml`](file:///.github/workflows/ci-security.yml). Runs SAST security scanning, secret leakage prevention, and dependency vulnerability audits (`npm audit`). | **READY** |
| **2** | **Pipeline Isolation** | Configured in [`.github/workflows/deploy-pipeline.yml`](file:///.github/workflows/deploy-pipeline.yml). Decoupled `staging` vs `production` deployment workflows with automated validation gates before changes touch live users. | **READY** |
| **3** | **SRE Check & Observability** | Configured Vercel Analytics telemetry, health check validation, strict timeout safeguards on asynchronous I/O (`Promise.race` + 15s SMTP timeout), and sanitized error logs (zero credentials/PII leakage). | **READY** |
| **4** | **Rate Limiting & Threat Shield** | Enforced sliding-window IP rate limiter inside [`api/contact.js`](file:///api/contact.js) (5 requests / min per IP) returning `HTTP 429 Too Many Requests` + `Retry-After: 60`, paired with Cloud/Vercel Edge firewall rules. | **READY** |

---

## 2. Security Hardening & Penetration Defense (The Book of Secret Knowledge)

- **HTTP Security Headers** (Enforced in [`vercel.json`](file:///vercel.json)):
  - `X-Frame-Options: DENY`: Blocks Clickjacking and UI redressing attacks.
  - `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing exploits.
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`: Forces strict HTTPS communication.
  - `Referrer-Policy: strict-origin-when-cross-origin`: Restricts cross-origin referrer leakage.
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`: Restricts sensitive browser APIs.
  - `X-XSS-Protection: 1; mode=block`: Legacy filter defense for old browser engines.
- **Backend API Sanitization**:
  - HTML character entity encoding (`escapeHtml`) on all user input.
  - Honeypot validation (`website` trap field).
  - Cross-Origin Request Forgery (CSRF) protection via origin & host header verification.
  - Strict payload size limits (< 16KB JSON body limit, field length ceilings).
  - SHA-256 idempotency keying to guard against duplicate submissions and race conditions.

---

## 3. Production Deployment Runbook

1. **GitHub Repository Settings**:
   - Navigate to **Settings** $\rightarrow$ **Code security and analysis**.
   - Enable **Dependency graph**, **Dependabot alerts**, **Dependabot security updates**, and **Secret scanning**.
2. **Environment Secrets**:
   - Set up environments `staging` and `production` under **Settings** $\rightarrow$ **Environments**.
   - Ensure secrets (`SMTP_PASS`, `SMTP_USER`, `RESEND_API_KEY`) are injected exclusively via environment variables and never checked into source control.
3. **Execution**:
   - Merge approved pull requests into `staging` for smoke-testing.
   - Promote to `main` for audited, protected production rollout.

