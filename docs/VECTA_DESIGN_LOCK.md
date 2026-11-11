> Исторический документ корпоративного направления. Не применять как текущий бриф свадебного сайта. Приоритет: [восстановленные решения](VECTA_DECISIONS_FROM_DIALOGUES.md) и [текущий объём](CURRENT_WEDDING_SCOPE.md). Содержимое сохранено для истории.

# VECTA / ART DIRECTION & RELEASE LOCK
Status: FROZEN for the November 12, 2026 release. Owner decision: retain and develop the existing Event- repository; no clean-slate rebuild.

## 1. Product
VECTA: photo, video and media production for events, primarily Moscow / Russia. Audience: brand / in-house marketing, communications, HR; event and communications agencies. Sell a reliable content outcome, not a list of cameras.

Core offer: "Событие заканчивается. Контент работает дальше."
Promise is supported by a real method (VECTA FRAME) and visible work, never invented clients, numbers, guarantees or deliverables.

## 2. Non-negotiable visual architecture
- A SINGLE CONTINUOUS EDITORIAL CANVAS. One optical surface across the scroll, not ten independent stacked SaaS sections. Transitions must read like cuts in one film / art-directed magazine spread.
- Fashion/editorial, cinematic restraint. Near-black #080808, off-white #f2f0e9, deep red used as ONE controlled accent (#7d2027 or similarly subdued). Avoid rounded SaaS cards, dashboard chrome, glossy gradients, icons-for-benefits, decorative pseudo-3D.
- Giant type, intentional line breaks, asymmetric editorial image arrangements, white space as composition, full-bleed media mixed with quiet text. Treat typography, photography and motion as one system.
- Original production footage and stills take precedence. No generated portfolio work posing as real work. Use verified assets already in the repository and never swap them silently.
- Motion: choreographed, meaningful, smooth. Media leads, text answers. Respect reduced motion, keyboard and touch. Mobile must be separately art-directed, not simply collapse cards into a stack.
- No unsolicited new design direction. The selected references (visual directions 1 and 3 from the earlier review) determine the visual grammar. Their original screenshots are not stored in this repository; fidelity to these *exact* images cannot be asserted until they are available. Do not pretend a substitute moodboard equals the approved references.
- Every design and code change must be evaluated against the above rather than an ungrounded "looks modern" judgment.

## 3. Information architecture / storytelling
The site is one connected visual journey, with addressable routes for search and qualified inquiries.
- Opening: one result-focused proposition + selected work immediately visible / reachable.
- Project proof: photo/video editorial mosaic; each verified work opens an accessible case with source material, visible format, real project information only. Never invent client objectives/KPIs.
- Two discreet commercial routes, **BRAND / IN-HOUSE** and **AGENCY / PARTNER**, integrated into the visual canvas rather than separated as bright UI cards. Route context must carry into inquiry.
- Production method: FRAME (FOCUS, RUN, ARCHITECTURE, MEDIA, EXPORT) explained as concrete control and deliverables rather than slogans.
- Service / pricing guidance: clear, legible, not a wall of commodity cards. Existing approved price facts are not to be changed without new confirmation.
- Conversion: lightweight brief with contextual entry; clear answer as to what happens next; alternative direct contact or copyable brief if transport fails.
- Service pages: maintain existing SEO routes and meaningful linking; same visual grammar, distinct useful content; no duplicate filler. Canonicals, schema and sitemap must match actual public domain.

## 4. Conversion acceptance
- Visitors can see actual work without submitting a form.
- Brand route begins with objective, event date / location, desired outputs and contact; agency route starts from brief / program and integration depth. Reduce unnecessary fields; never hide prices behind an artificial inquiry.
- Every submission must be **delivered to a real destination** or explicitly reported as *not sent*. A console log and 200 OK with no delivery do NOT count as a successful lead.
- Never discard a filled form after a backend error. Provide a reliable manual fallback.
- Mobile CTA, keyboard controls, media playback, case viewer and route links must work.

## 5. Working discipline
1. Audit the existing repository and live build. Preserve working functionality.
2. Freeze the system here; compare every proposed change with these rules.
3. Design / review the **full page journey**, not only the hero; map mobile states and inner pages.
4. Implement in small reversible commits with tests for behavior.
5. Verify production in the browser: desktop/mobile, media, case viewer, errors, submit flow, SEO, accessibility. Screenshots should substantiate visual acceptance.
6. Publish only after verification. Link only to a confirmed live deployment; don't call preview production.

## 6. Release gate (12 Nov 2026, morning requested)
P0 / critical: functioning production deploy, real media URLs, truthful lead submission and fallback, no broken main CTAs, functional mobile navigation, no browser errors.
P1 / essential: continuous editorial structure, distinct brand and agency paths, case proof, coherent typography/motion, responsive QA.
P2 / polish: advanced transitions, content expansion, instrumentation and advanced micro-interaction.
A deadline does not justify asserting that unchecked functionality is ready.

## 7. Existing source of truth
- Source: https://github.com/htj6hgnngd-prog/Event-
- Public historical corporate site: https://event-production-site.vercel.app/
- Different project, do not confuse: https://vecta-weddings.vercel.app/ (wedding site).
- Related documents: VECTA_FRAME, VECTA_COPY_SYSTEM, VECTA_CASE_SYSTEM, VECTA_PROJECT_ROUTES, VECTA_AGENCY_MODE.
