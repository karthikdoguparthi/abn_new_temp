# ACTIVE BRAINS website: publication package

This is a static HTML, CSS and JavaScript website with 43 pages. It does not need an application build. Contact delivery uses the included Vercel function at `/api/contact`.

## Deploy to the existing Vercel project

1. Use the contents of this folder as the project root; `index.html` belongs at the root.
2. Use the **Other** framework preset. No install or build command is needed. The output directory is `.` (the project root).
3. Deploy through the existing Vercel project to replace its current published version.

The included `vercel.json` records those static-site settings and basic response headers. These settings follow [Vercel's build configuration documentation](https://vercel.com/docs/builds/configure-a-build).

## Contact behaviour

Contact buttons on all 43 pages open a shared enquiry form. The Vercel endpoint sends name, email, company, message and source page to **solution@activebrains.co.uk**, with Reply-To set to the visitor’s address. Delivery errors retain the form contents; success appears only after the email provider accepts the request. Repeated retries of the same submission use an idempotency key.

### Activate email delivery

1. Create or use a Resend account and verify your sending domain: https://resend.com/docs/dashboard/domains/introduction
2. In Vercel project Settings → Environment Variables, add `RESEND_API_KEY` (a sending API key) and `CONTACT_FROM` (for example `ACTIVE BRAINS <enquiries@activebrains.co.uk>`, only after that domain is verified). Set these for the deployment environments you use. Never put credentials in website files.
3. Redeploy the project. The recipient is fixed on the server as solution@activebrains.co.uk.
4. Add a Vercel Firewall rate-limit rule for POST `/api/contact` before opening the form to public traffic. The form also has a honeypot and same-origin checks; these are not substitutes for rate limiting.
5. Submit a test enquiry and confirm arrival in the mailbox and that Reply targets the submitted email address. Provider acceptance does not guarantee inbox delivery.

A plain Python/static preview server cannot execute `/api/contact`; use Vercel Preview or `vercel dev` to test email delivery. Missing configuration returns an error rather than claiming that an email was sent.

## Content and navigation

- Thirty specialist pages have individually written scopes, delivery considerations, illustrative examples and questions.
- Eight overview pages cover their own subject and link to relevant specialist pages.
- The homepage, directory and three policy pages complete the 43-page site.
- Related offerings with previously repeated content now have distinct purposes and names.
- Search and the HTML/XML sitemaps include all pages.
- Shared navigation, footer details and the registered address in legal documents intentionally remain consistent.
- Examples are illustrative, not customer case studies. Unsupported grants, partnerships, outcome statistics and event claims have been removed from marketing pages.

## Interactive features

The homepage workflow is explicitly a demonstration. It does not connect to business systems. Fundoo is a local website navigation helper with topic-based suggestions, not a live AI service. Cookie preferences are stored in the current browser. The shared enquiry form requires the email configuration above.

The introduction video is not embedded on any page. Its source asset is retained for a future update.

## Validation

All 43 pages were checked at widths of 320, 768 and 1440 pixels, with no page-level horizontal overflow. Local links and fragment targets were checked. Page bodies, page titles and descriptions were checked for duplicates; the only repeated long content paragraph was the legal registered address. Representative search, FAQ, navigation and demonstration interactions were verified.

This release has not been deployed by Codex. The canonical URLs and sitemap currently target https://abn-new.vercel.app/. Update them if the production hostname changes. Privacy and terms wording from the supplied project is retained apart from the verified contact address; accessibility wording reflects the checks performed rather than claiming certification.
