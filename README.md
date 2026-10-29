# NIRT Renewable Energy — Landing Page

A responsive one-page lead-generation site for **NIRT Renewable Energy Pvt Ltd**, Salem, built with
[Astro](https://astro.build), Tailwind CSS v4 and [Hugeicons](https://hugeicons.com/).

The visual direction is an editorial solar brand: a deep teal photographic hero with a giant NIRT
wordmark, a navy impact band, a cream commitment section with a ghost wordmark, and light,
slightly-tilted solution cards over a solar array. The page keeps NIRT's full lead-gen story —
solutions, subsidy, projects, finance, process, reviews and FAQ — inside that visual language.

## Design direction

The palette pairs deep teal and navy with warm cream and a single solar yellow. NIRT's navy is
kept in the dark surfaces and green appears only as a small secondary accent; yellow is the action
colour.

| Token        | Hex       | Primary use                                      |
| :----------- | :-------- | :----------------------------------------------- |
| Ink          | `#081820` | Primary type, dark buttons, footer detail        |
| Navy         | `#0A1D2B` | Stats band, footer, photography overlays         |
| Teal         | `#0B3D49` | Hero, payment section, CTA overlays              |
| Blue         | `#0E5A78` | "Solar revolution" solutions section             |
| Paper        | `#F5F2E9` | Page background                                  |
| Cream        | `#ECE6D6` | Subsidy and reviews bands                        |
| Yellow       | `#F2C230` | CTAs, accents, stat suffixes, scribbles          |
| Green        | `#0E7C6B` | Small secondary accents, checks                  |
| Muted        | `#5C6B70` | Secondary labels and notes                       |

**Type:** self-hosted **Sora** for display and the giant wordmark, **Poppins** for body and UI.
Headings run from 40–70px, with a 250–290px hero wordmark on desktop; body copy is 12.5–15px with
10px tracked meta labels. Poppins is also used for the rupee glyph fallback.

**Composition:** 0px radii throughout. The layout borrows from the supplied "RadiantRenew"
reference: full-bleed photo hero, giant brand wordmark at the bottom, a centered impact statement
that fades into the background, a three-column meta rule, a dark quote card that floats in the
commitment section, a yellow hand-drawn scribble, and a trio of light, tilted solution cards over a
solar-panel photograph.

## Sections

| Section           | Anchor       | Purpose                                                          |
| :---------------- | :----------- | :--------------------------------------------------------------- |
| Header            | —            | Fixed transparent header, full-screen menu, estimate CTA         |
| Hero              | `#home`      | Proposition, CTAs, photo and giant NIRT wordmark                  |
| Impact band       | `#stats`     | Navy statement, 35+ MW / 15 MW / 25 yrs / 4–5 unit stats          |
| Commitment        | `#about`     | About, quote card, service points and project image               |
| Solutions         | `#solutions` | Tilted Home rooftop / Commercial / Solar parks cards              |
| Estimate          | `#estimate`  | Four-field free assessment form and what's included               |
| Subsidy           | `#subsidy`   | PM Surya Ghar 1 kW / 2 kW / 3 kW+ tiers and eligibility CTA       |
| Projects          | `#projects`  | Industrial rooftop, 15 MW Harur park and residential rooftop      |
| Payment           | `#payment`   | Upfront/finance options and the interactive illustrative EMI      |
| Process           | `#process`   | Six steps from requirements to handover                          |
| Reviews           | `#reviews`   | Feature quote, two supporting reviews and the Google link         |
| FAQ               | `#faq`       | Homeowner questions in an accessible `<details>` accordion        |
| Final CTA         | —            | Full-bleed "Ready to make your roof work harder?" section          |
| Footer            | `#contact`   | Navigation, services, contact details and giant NIRT wordmark     |

## Commands

| Command             | Action                                   |
| :------------------ | :--------------------------------------- |
| `npm install`       | Install dependencies                     |
| `npm run dev`       | Start the dev server at `localhost:4321` |
| `npm run build`     | Build the production site to `./dist/`   |
| `npm run preview`   | Preview the production build locally     |
| `npm run typecheck` | Run TypeScript without emitting files    |

The Astro dev server can also run in the background with `npx astro dev --background`; manage it
with `npx astro dev status`, `npx astro dev logs` and `npx astro dev stop`.

## Structure

- `src/pages/index.astro` — page assembly
- `src/layouts/Layout.astro` — document head, fonts, OG tags, scroll-reveal observer
- `src/components/Header.astro` — fixed header, wordmark, full-screen menu
- `src/components/Hero.astro` — photographic hero and giant NIRT wordmark
- `src/components/Stats.astro` — navy impact statement and stat row
- `src/components/Commitment.astro` — about section, quote card and service points
- `src/components/Revolution.astro` — tilted solution cards over the solar-park photo
- `src/components/Estimate.astro` — estimate section wrapping the lead form
- `src/components/Subsidy.astro` — PM Surya Ghar tiers
- `src/components/Projects.astro` — project photo grid
- `src/components/Payment.astro` — payment routes and EMI calculator
- `src/components/Process.astro` — six-step editorial list
- `src/components/Reviews.astro` — feature and supporting client quotes
- `src/components/Faq.astro` — accessible question accordion
- `src/components/FinalCta.astro` — closing image CTA
- `src/components/Footer.astro` — footer and giant wordmark
- `src/components/LeadForm.astro` — four-field lead form
- `src/components/LeadDialog.astro` — eligibility/assessment dialog
- `src/components/MobileCta.astro` — sticky mobile call/estimate bar
- `src/components/Preloader.astro` — branded first-paint loading screen
- `src/components/HugeIcon.astro` + `src/icons.ts` — icon renderer and icon map
- `src/styles/global.css` — Tailwind theme, type, buttons, fields, dark surfaces and motion
- `public/images/` — hero, project and CTA photography
- `public/fonts/` — self-hosted Sora and Poppins, plus the rupee fallback
- `public/og.jpg` — 1200 × 630 social share card in the new palette
- `screenshots/` — desktop and mobile captures from the QA pass

### Legacy files

`src/components/Numbers.astro`, `src/components/TrustBar.astro` and the `src/components/ui/`
React/shadcn files (`timeline-01.tsx`, `timeline-01-utils/`, `badge.tsx`, `demo.tsx`) are from the
previous iteration and are not imported by the current page. React and the shadcn primitives remain
configured, but the live page ships no React islands.

## Forms and dialog

The estimate form and the dialog form validate on the client (required fields, 10-digit Indian
mobile number, district and bi-monthly bill). Both show an inline success state with the visitor's
name.

The forms are **front-end only** and do not send data anywhere. Before launch, connect the submit
handler in `src/components/LeadForm.astro` to the client's CRM, email service or form endpoint, and
add server-side validation and spam protection.

The assessment dialog opens from the explicit "Check my eligibility" and header phone CTAs. There
is no automatic mid-page pop-up. The dialog marks nothing in storage and always requires a click.

## Content and assets

- **Logo** — the supplied NIRT lockup is used by the preloader; the header, footer and social card
  use a typographic NIRT wordmark with the yellow sun mark.
- **Project images and client quotes** — NIRT's public website, [nirt.net](https://www.nirt.net/).
- **Hero, installer and CTA photography** — Pexels: [houses with solar panels](https://www.pexels.com/photo/houses-with-solar-panels-on-roofs-6233727/),
  and the engineer/consultation photograph used in the closing CTA. Free to use under the Pexels
  licence.
- **Residential project image** — Pexels: [solar panels on a house roof](https://www.pexels.com/photo/solar-panels-on-house-roof-17762230/).
  The card is labelled "Representative image" and should be replaced with a verified NIRT
  residential project photo.
- **Fonts** — Sora and Poppins, self-hosted from Google Fonts.
- **Contact details, social links and company facts** — NIRT's public website and social profiles.
  Confirm them with the client before publishing.

## Before launch

1. Connect the lead forms to a real endpoint and test delivery.
2. Replace the representative residential image with a verified NIRT project photo.
3. Connect the Google card to the client's actual Google Business Profile (or Places API / review
   widget). It currently links to a Google Maps search.
4. Confirm subsidy, generation, EMI, timeline and service claims with the client; all figures are
   marked indicative in the page.
5. Add a privacy policy and any consent wording required for lead capture.
6. Set the production domain and absolute Open Graph image URL in `src/layouts/Layout.astro`.

## Checks

- `npm run build` and `npm run typecheck` pass.
- Checked at 320, 360, 390, 768, 1024, 1280, 1440 and 1920px with no horizontal overflow.
- The full-screen menu, estimate form, dialog form, EMI calculator (amount + tenure), FAQ accordion
  and sticky mobile CTA were exercised in headless Chromium.
- The mobile CTA hides over the hero and the estimate section, and reappears further down the page.
- Reveal animations respect `prefers-reduced-motion`; the FAQ works without JavaScript; the forms
  use native validation and a visible focus ring.
- Fresh desktop and mobile captures are in `screenshots/`.
