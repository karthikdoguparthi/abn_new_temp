# SMTP email setup

The existing `/api/contact` endpoint now sends through Nodemailer. Resend API settings are no longer used. All forms use this same endpoint.

In Vercel → Project → Settings → Environment Variables, set the variables listed in `.env.example` for Production (and Preview if needed). Store SMTP_PASS as a secret. SMTP_HOST, SMTP_USER and SMTP_PASS must come from your email provider; CONTACT_FROM must be an address that account is allowed to send from. Use port 465 for implicit TLS or 587 for required STARTTLS. Certificate verification remains enabled. Some providers require app passwords or OAuth; the current implementation supports SMTP password/app-password authentication, not OAuth.

CONTACT_TO is optional and defaults to solution@activebrains.co.uk. For a test deployment, set it to your test recipient. It cannot be overridden by the visitor's form data. Reply-To is the visitor's email; the From address remains your configured sender.

Redeploy after setting variables. The deployment installs Nodemailer via npm ci. Submit on the deployed HTTPS website and check the recipient inbox and your provider's delivery logs. HTTP 503 means missing/invalid configuration; 502 means SMTP failed or did not accept the recipient. Success means SMTP accepted the message, not guaranteed inbox delivery.

Local Python static preview does not execute the API. Use Vercel CLI `vercel dev` with Development environment variables for local sending. Never commit real credentials. Do not place secrets in public JavaScript or HTML.

Messages contain enquiry type, name, email, company, phone, interest, message, source page/title, and optional timeframe/stage/profile. They include both plain-text and HTML bodies. No automatic response is sent to the visitor.

SMTP has no guaranteed idempotency. Retries retain a stable Message-ID for matching, but a timeout after server acceptance can result in duplicates. No persistent duplicate suppression is implemented.

Run `npm test` for mocked transport/validation checks; these tests do not send real email. Real delivery must be checked after the provider credentials are configured.
