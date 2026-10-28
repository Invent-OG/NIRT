# NIRT Renewable Energy — Landing Page

A responsive one-page lead-generation site for **NIRT Renewable Energy Pvt Ltd**, Salem, built
with [Astro](https://astro.build) and Tailwind CSS.

The page follows the client's landing-page brief: hero + lead form, investment numbers, PM Surya
Ghar subsidy tiers, project grid, payment/EMI options, the six-step NIRT process and client
reviews.

## Commands

| Command           | Action                                   |
| :---------------- | :--------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the production site to `./dist/`   |
| `npm run preview` | Preview the production build locally     |

## Structure

- `src/pages/index.astro` — page assembly
- `src/components/` — header, hero, lead form, numbers, subsidy, projects, payment, process,
  reviews, final CTA, footer and popup dialog
- `src/styles/global.css` — Tailwind theme, Poppins fonts and shared component styles
- `public/images/` — NIRT logo and project photography, plus supporting stock imagery
- `public/fonts/` — self-hosted Poppins files

## Forms and popup

Both lead forms validate on the client (required fields, 10-digit mobile number, district and
bi-monthly bill). The mid-page form opens once per session after the visitor reaches the end of
the numbers section, and can also be opened from the "Explore My Solar Potential" and "Check My
Eligibility" buttons.

The forms are **front-end only** and do not send data anywhere. Before launch, connect the submit
handler in `src/components/LeadForm.astro` to the client's CRM, email service or form endpoint,
and add server-side validation and spam protection.

## Content and assets

- **Logo, project images and client quotes** — NIRT's public website, [nirt.net](https://www.nirt.net/).
  The rooftop and solar-park project photos are from NIRT's published project material.
- **Hero and final CTA photography** — Pexels: [houses with solar panels](https://www.pexels.com/photo/houses-with-solar-panels-on-roofs-6233727/)
  and [solar consultation](https://www.pexels.com/photo/4254166/). Free to use under the Pexels licence.
- **Residential project image** — Pexels: [solar panels on a house roof](https://www.pexels.com/photo/solar-panels-on-house-roof-17762230/).
  This card is labelled "Representative image" and should be replaced with a verified NIRT
  residential project photo.
- **Fonts** — Poppins, self-hosted from Google Fonts.
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

`npm run build` passes. The page was checked at 320, 390, 768, 1024, 1440 and 1920px for
horizontal overflow, and the lead form, popup, mobile menu and mobile sticky CTA were exercised
in a headless Chromium session.
