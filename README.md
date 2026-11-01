# ACTIVE BRAINS Technologies

> **Enterprise IT Strategy, Systems Integration, and Autonomous AI Solutions.**  
> Practical thinking combined with technical depth.

[![CI & Security Quality Gate](https://github.com/karthikdoguparthi/abn_new_temp/actions/workflows/ci-security.yml/badge.svg)](https://github.com/karthikdoguparthi/abn_new_temp/actions/workflows/ci-security.yml)
[![Infrastructure & Secret Leak Guard](https://github.com/karthikdoguparthi/abn_new_temp/actions/workflows/secret-guard.yml/badge.svg)](https://github.com/karthikdoguparthi/abn_new_temp/actions/workflows/secret-guard.yml)
[![SRE Uptime & Security Monitor](https://github.com/karthikdoguparthi/abn_new_temp/actions/workflows/sre-monitor.yml/badge.svg)](https://github.com/karthikdoguparthi/abn_new_temp/actions/workflows/sre-monitor.yml)

---

## 🏛️ Project Overview

This repository houses the corporate digital platform and **AB Agent Studio** for ACTIVE BRAINS Technologies. Engineered for resilience, speed, and defense-in-depth, the platform combines a lightweight, zero-build frontend with secure serverless endpoints and autonomous AI reasoning capabilities.

---

## 📁 Repository Structure

```
abn/
├── pages/                  # Categorized site pages
│   ├── services/           # 21 Enterprise consulting & architecture offerings
│   ├── technology/         # 14 Technology platforms, data & cloud practices
│   ├── company/            # Corporate background, careers & research
│   └── legal/              # Privacy policy, terms & accessibility standards
├── docs/                   # Engineering & operations documentation
│   ├── EMAIL_SETUP.md      # SMTP & transactional email setup guide
│   ├── READINESS.md        # Pre-flight deployment checklist
│   └── SECURITY_CHECKLIST.md # Security audit & compliance matrix
├── api/                    # Serverless backend functions (rate-limited contact handler)
├── assets/                 # SVGs, photography, brand identity & icons
├── css/                    # Modular stylesheets
├── js/                     # Client runtime, search indexes & Agent Studio engine
├── tests/                  # Automated Node.js test suites
├── .github/                # GitHub Actions workflows & security policies
├── agentstudio.html        # Interactive AB Agent Studio
├── index.html              # Corporate homepage
└── vercel.json             # Transparent rewrites & HTTP security headers
```

---

## 🛡️ Security & Reliability Architecture

Aligned with industry frameworks ([ByteByteGo System Design](https://github.com/ByteByteGoHq/system-design-101), [Awesome Scalability](https://github.com/binhnguyennus/awesome-scalability), and [The Book of Secret Knowledge](https://github.com/trimstray/the-book-of-secret-knowledge)):

- **CodeQL SAST & Dependency Audits**: Continuous static analysis and weekly automated zero-vulnerability package audits.
- **Backend Rate Limiting**: Built-in sliding-window IP rate limiter (`5 req/min`) returning `HTTP 429` on `/api/contact` to neutralize DoS and brute-force attempts.
- **HTTP Security Headers**: Enforces strict `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Permissions-Policy`.
- **Zero Web Storage for Secrets**: In-memory credential lifecycles preventing local storage token harvesting.
- **Deep Git Entropy Scanning**: TruffleHog checks verifying zero private keys or API tokens in git history.
- **Pipeline Isolation**: Isolated `staging` and `production` environments ensuring code is verified before production deployment.

---

## 🚀 Local Development & Testing

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/karthikdoguparthi/abn_new_temp.git
cd abn_new_temp

# Install dependencies
npm ci
```

### 3. Run Automated Tests
```bash
# Run unit tests and security validation suite
npm test

# Run dependency vulnerability audit
npm audit
```

### 4. Local Preview
Serve the root directory with any local static HTTP server:
```bash
npx serve .
# Or using Python:
python3 -m http.server 8080
```

---

## 🌐 Deployment

The project is hosted and deployed on **Vercel**:
- **Staging**: Pushes to the `staging` branch deploy to the preview environment for acceptance testing.
- **Production**: Merges into `main` trigger the production release pipeline to [activebrains.co.uk](https://activebrains.co.uk).
- **URL Rewrites**: Static routes are transparently mapped through [`vercel.json`](vercel.json), preserving clean URLs across all subdirectories.

---

## 🔒 Security Vulnerability Reporting

If you identify a security vulnerability, please review our [Security Policy](SECURITY.md) and report it privately via GitHub Advisories or by emailing [solution@activebrains.co.uk](mailto:solution@activebrains.co.uk).

---

## 📄 License & Ownership

Copyright © ACTIVE BRAINS Technologies. All rights reserved.
