# Website readiness: 14 September 2026

| Item | Result |
|---|---|
| Custom 404 | Added branded 404.html; Vercel serves it for missing routes. Root base URL preserves links on nested missing URLs. |
| Page titles | Present and unique across 45 pages. |
| Meta descriptions | Present and unique across 45 pages. |
| Early CTA | Header contact action retained; mobile fixed contact action added. Exact fold position depends on viewport and text settings. |
| Favicons | ICO, Apple touch icon, PNG icons and manifest added. |
| robots.txt | Existing file retained. |
| XML sitemap | Existing 43 public content pages retained; utility pages intentionally excluded and noindex. |
| Open Graph | Branded 1200×630 image, individual titles/descriptions and Twitter cards added everywhere. |
| Alt text | Every image has alt text. |
| Mobile breakpoints | Existing responsive styles retained; new form and utility page styles adapt to narrow screens. |
| Sticky mobile CTA | Added below 768px with safe-area spacing. |
| Loading states | Form disables submission and displays sending status. |
| Error states | Invalid fields use browser validation; failed sends preserve entered details. |
| Thank-you page | Added; form navigates there only following provider acceptance. |
| Privacy policy | Existing page retained. Verify policy accuracy for your actual business practices before publishing. |
| Terms | Existing page retained. |
| Cookie banner | Explicit analytics choice plus reopen control; old preferences are not treated as analytics permission. |
| Analytics | Consent-gated Vercel script installed. Enable Web Analytics in the Vercel dashboard and redeploy; data collection has not been verified live. |
| Contact address | Verified enquiry email retained. Existing postal address preserved: Coppersun Suite Cardinal Point, Park Road, Rickmansworth, England, WD3 1RE. Owner must verify postal address. |
| Compressed images | Live logo changed from 12,940-byte PNG to 8,564-byte lossless WebP; sharing image is optimized JPEG. Unused original assets retained. |

## Activation still required

- Enable Vercel Web Analytics and redeploy. See https://vercel.com/docs/analytics/quickstart .
- Configure Resend sender and API key as described in README.md; test mailbox arrival. Email delivery is not yet live-tested.
- Apply the contact endpoint rate-limit rule described in README.md.
- Verify the existing postal address and legal wording.

## Verification

All 45 pages passed local link/fragment checks. All have individual titles and descriptions, social metadata, favicon links, image alt attributes, contact forms and mobile CTAs. JavaScript syntax checks passed. Actual Vercel 404 routing, analytics collection and email delivery require a deployed environment. New responsive elements have not been visually checked in this run.
