# NIRT Renewable Energy — Landing Page

A responsive one-page lead-generation site for **NIRT Renewable Energy Pvt Ltd**, Salem, built
with [Astro](https://astro.build), React, Tailwind CSS, shadcn/ui patterns and
[Hugeicons](https://hugeicons.com/).

The page follows the client's landing-page brief: hero + lead form, investment numbers, PM Surya
Ghar subsidy tiers, project grid, payment/EMI options, the six-step NIRT process and client
reviews.

## Design direction

The visual system is built around the client's logo, using its three brand colours throughout —
navy for structure and type, green for the ecological/subsidy story, and orange for action.

| Token        | Hex       | Primary use                                      |
| :----------- | :-------- | :----------------------------------------------- |
| NIRT navy    | `#154783` | Logo wordmark, headings, dark panels, trust bar  |
| NIRT green   | `#0E8743` | Accents, subsidy, checks, secondary emphasis     |
| NIRT orange  | `#F05F23` | Primary CTAs, badges, highlights, slider         |
| Navy deep    | `#0B2A5E` | Dark gradients and the top utility bar           |
| Navy dark    | `#071B3C` | Payment, final CTA and deep backgrounds          |
| Paper        | `#FAFCFE` | Page background                                  |
| Cloud        | `#F1F6FC` | Alternating sections and soft cards              |
| Sky          | `#E7F1FB` | Reviews section                                  |
| Body         | `#4B5F78` | Supporting copy                                  |

**Type:** Sora (variable, self-hosted) for display headings; Poppins for body and UI. The pair
keeps the technical, engineered feel of the logo while remaining highly legible at small sizes.

**Composition:** The layout borrows common patterns from current solar and clean-energy site
design — a light, airy hero with a conversion card, a photo-led bento project grid, a dark
finance/EMI section and a soft green subsidy block. Every UI surface — buttons, inputs, cards,
tags, dialog and preloader — uses a **0px radius** for a sharper, more engineered look; only the
logo and icon strokes keep their natural curves. References that informed the direction
include:

- Dribbble, [Solar Energy Website – Modern Landing Page Design](https://dribbble.com/shots/27133908-Solar-Energy-Website-Modern-Landing-Page-Design)
- Dribbble, [Mardysev Solar – Clean Energy Landing Page](https://dribbble.com/shots/26202264-Mardysev-Solar-Clean-Energy-Landing-Page)
- Behance, [Suntrix – Solar Energy Website Design UI/UX](https://www.behance.net/gallery/240613859/Suntrix-Solar-Energy-Website-Design-UIUX)
- Behance, [Modern SaaS UI/UX Design for Solar Installation Website](https://www.behance.net/gallery/241709785/Modern-SaaS-UIUX-Design-for-Solar-Installation-Website)

**Icons:** The Astro page uses `@hugeicons/core-free-icons`. `src/icons.ts` is the single icon map,
and `src/components/HugeIcon.astro` renders the icon data as inline SVG with a consistent stroke.
The React timeline uses `lucide-react` for its CTA arrow. Only the Google review mark and the
favicon/NIRT emblem are custom vectors.

## Commands

| Command           | Action                                   |
| :---------------- | :--------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the production site to `./dist/`   |
| `npm run preview` | Preview the production build locally     |
| `npm run typecheck` | Run TypeScript without emitting files |

## Structure

- `src/pages/index.astro` — page assembly
- `src/components/` — preloader, header, hero, lead form, numbers, subsidy, projects, payment,
  process, reviews, final CTA, footer and popup dialog
- `src/components/Preloader.astro` — branded first-paint loading screen
- `src/components/HugeIcon.astro` — Hugeicons renderer
- `src/components/ui/` — shadcn/React primitives and the process timeline block
- `src/components/ui/timeline-01.tsx` — the framed “Six steps. No surprises.” section
- `src/components/ui/timeline-01-utils/timeline.tsx` — motion timeline, scroll line and items
- `src/components/ui/badge.tsx` — sharp-edged shadcn badge
- `src/components/ui/demo.tsx` — standalone timeline demo
- `src/lib/utils.ts` — `cn()` helper
- `components.json` — shadcn aliases and Tailwind v4 CSS entry
- `src/icons.ts` — the Hugeicons map used across the Astro page
- `src/styles/global.css` — Tailwind theme, shadcn tokens, Sora/Poppins faces and shared styles
- `public/images/nirt-logo.webp` — transparent, cropped logo lockup prepared from the supplied
  NIRT artwork
- `public/images/` — project photography and supporting stock imagery
- `public/fonts/` — self-hosted Sora and Poppins files
- `public/og.jpg` — 1200 × 630 social share image built from the new palette
- `screenshots/` — desktop, mobile and viewport captures from the QA pass

## React + shadcn/ui structure

The site remains a static Astro build; React is used only for the process timeline island.

- React is enabled with `@astrojs/react`.
- `@/` resolves to `src/` in both `tsconfig.json` and the Vite alias in `astro.config.mjs`.
- shadcn primitives live in **`src/components/ui`**, with the `cn()` helper in **`src/lib/utils.ts`**.
- **The style entry is `src/styles/global.css`** (Tailwind v4, no `tailwind.config` file).
- `components.json` points the shadcn aliases at those paths and maps the semantic colours
  (`background`, `foreground`, `border`, `primary`, `muted-foreground`, etc.) onto the NIRT palette.
- The badge, timeline images, timeline marker and frame remain **0px radius** to match the rest of
  the site.

**Why `src/components/ui`?** Astro's default component folder is `src/components`, but shadcn
components are generated with imports such as `@/components/ui/badge` and `@/lib/utils`. Keeping the
`ui` subfolder plus the `@/` alias is what makes those imports resolve, and it keeps generated
primitives separate from the hand-built Astro sections. A flat `src/components` setup would break
the generated imports and make future shadcn additions harder to maintain.

**Fresh-project setup summary**

```bash
npx astro add react
npm install tailwindcss @tailwindcss/vite class-variance-authority clsx tailwind-merge motion lucide-react
npm install -D typescript @types/react @types/react-dom @types/node
```

Then add the `@/` alias, `src/lib/utils.ts` and `components.json`, and copy/add the `badge` and
timeline files. `npx shadcn@latest add badge` can be used once that config is present; for Astro,
manual placement is the reliable path if the CLI does not detect the framework.

## Preloader

`src/components/Preloader.astro` renders a logo-led loading screen in the brand navy before the
page paints. It hides after `DOMContentLoaded` with a short 1.3-second minimum, fades for 520ms,
and then removes itself from the DOM. With `prefers-reduced-motion: reduce` it hides almost
immediately, and with JavaScript disabled a `<noscript>` rule removes it entirely. A CSS and a
JavaScript fail-safe hide/remove it even if the page never finishes loading.

## Forms and popup

Both lead forms validate on the client (required fields, 10-digit mobile number, district and
bi-monthly bill). The mid-page form opens once per session after the visitor reaches the end of
the numbers section, and can also be opened from the "Explore My Solar Potential" and "Check My
Eligibility" buttons.

The forms are **front-end only** and do not send data anywhere. Before launch, connect the submit
handler in `src/components/LeadForm.astro` to the client's CRM, email service or form endpoint,
and add server-side validation and spam protection.

## Process timeline

`src/components/Process.astro` is now a thin Astro wrapper around the React island:

```astro
<TimelineBlock01 client:visible />
```

The section keeps the `#process` anchor and replaces the previous six cards with a vertical,
image-led timeline. The line and square marker animate with scroll progress via `motion`; the six
steps use NIRT's local project photography so the timeline has no external image dependency. The
React content is server-rendered and always visible, so it does not depend on hydration to appear.
The island hydrates only when it enters the viewport.

## Content and assets

- **Logo** — supplied NIRT artwork, cropped and background-removed to a transparent WebP. The
  favicon and social image follow the same navy/green/orange palette.
- **Project images and client quotes** — NIRT's public website, [nirt.net](https://www.nirt.net/).
  The rooftop and solar-park project photos are from NIRT's published project material and are also
  used in the process timeline.
- **Hero and final CTA photography** — Pexels: [houses with solar panels](https://www.pexels.com/photo/houses-with-solar-panels-on-roofs-6233727/)
  and [solar consultation](https://www.pexels.com/photo/4254166/). Free to use under the Pexels licence.
- **Residential project image** — Pexels: [solar panels on a house roof](https://www.pexels.com/photo/solar-panels-on-house-roof-17762230/).
  This card is labelled "Representative image" and should be replaced with a verified NIRT
  residential project photo.
- **Fonts** — Sora and Poppins, self-hosted from Google Fonts.
- **Contact details, social links and company facts** — NIRT's public website and social profiles.
  Confirm them with the client before publishing.

## Before launch

1. Connect the lead forms to a real endpoint and test delivery.
2. Replace the representative residential image with a verified NIRT project photo.
3. Connect the Google review card to the client's actual Google Business Profile (or Places API /
   review widget). It currently links to a Google Maps search.
4. Confirm subsidy, generation, EMI and legal copy with the client; all figures are marked
   indicative in the page.
5. Add a privacy policy and any consent wording required for lead capture.
6. Set the production domain and absolute Open Graph image URL in `src/layouts/Layout.astro`.

## Checks

`npm run build` and `npm run typecheck` pass. The page was checked at 320, 360, 390, 768, 1024,
1280, 1440 and 1920px for horizontal overflow. The lead form (validation + success state),
auto-popup, mobile menu, mobile sticky CTA, EMI calculator and dialog were exercised in headless
Chromium. The preloader was checked for normal, reduced-motion and JavaScript-disabled fallbacks.
The React timeline is server-rendered, hydrates on visibility, and was checked at desktop, tablet
and mobile widths. A computed-style audit confirms **0px border radius** on every UI surface.
Current captures are in `screenshots/`.
