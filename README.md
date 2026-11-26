# Booked Solid

A free, mobile-first guide to launching a recording or podcast studio in Ontario.

**Live site (once Pages is switched on):** https://enoky.github.io/StudioApp/

It covers 12 stages, from picking a niche to growing on evidence. Each stage has a plain-language explanation, the biggest trap, a checklist that saves your progress, and your next moves. It also includes four calculators (break-even and lease test, podcast money, gear payback, startup budget and runway) and four printable paperwork templates (split sheet, podcast guest release, session intake form, booking policy).

It installs on a phone like an app and works offline once opened. There are no accounts, ads or trackers: progress and calculator inputs stay in the visitor's browser.

## Turn on the free hosting (one-time)

1. Merge this branch into `main`.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The **Build and deploy to GitHub Pages** workflow runs on every push to `main`. The first run after step 2 publishes the site. You can also start it from the **Actions** tab with **Run workflow**.

Pages is free for public repositories. The workflow reads the correct base path from GitHub, so a fork or renamed repo also works.

## Run it locally

You need Node.js 22 or later.

```bash
npm install
npm run dev      # http://localhost:4321/StudioApp/
npm test         # checks the calculator maths against hand-worked examples
npm run build    # outputs the static site to dist/
npm run preview  # serves dist/ (the offline service worker only runs in a build)
```

## Edit the content

You don't need to touch any code to change the words.

| What | Where |
| --- | --- |
| The 12 stages | `src/content/guide/*.md` |
| Paperwork templates | `src/content/templates/*.md` |
| About page and book list | `src/pages/about.astro` |
| Calculator defaults | the `value={…}` numbers in `src/pages/tools/*.astro` |

Each stage file starts with a short block of settings (frontmatter):

```yaml
order: 3                     # position in the guide and the calendar
title: Run the numbers and protect your cash
short: Money                 # label in the weekly calendar
summary: One sentence shown under the title and in the stage list.
trap: The biggest trap at this stage.
nextMoves:                   # 1 to 3 actions for this week
  - …
tools: [break-even]          # calculators to link to
templates: []                # templates to link to (file names without .md)
checked: November 2026       # when time-sensitive facts were last checked
sources:                     # official links for those facts
  - title: "CRA: When to register for and start charging the GST/HST"
    url: https://www.canada.ca/…
```

Below that is normal Markdown. Any `- [ ]` item under the stage's checklist becomes a saved checkbox, and the progress page counts them automatically. If you add, remove or reorder checklist items, visitors' saved ticks for that stage may shift, so make big checklist changes sparingly.

The number at the start of a file name (`03-money.md`) only sets the file order. The page URL comes from the rest of the name (`/guide/money/`).

## Keeping facts current

Ontario and Canadian facts were checked against official sources in November 2026: the HST small-supplier threshold, Ontario business name registration, WSIB registration, minimum wage, Toronto home occupation zoning and the noise bylaw, Futurpreneur and the CSBFP, Ontario Creates' Music Investment Fund, Ontario Arts Council and FACTOR programs, Canada Council, and the collection societies (including SOCAN's 2026 acquisition of CMRRA). Rates and programs change every year, so review each stage's `sources` and update `checked` when you do.

## How it's built

- [Astro](https://astro.build) static site: plain HTML pages with small scripts only where needed. No backend, no paid services, no API keys.
- Mobile-first layout with a bottom tab bar that becomes a side rail on wide screens; light and dark modes.
- Installable PWA: `src/pages/manifest.webmanifest.ts`, plus a service worker generated at build time by `integrations/service-worker.mjs`, which precaches every page.
- Client-side search from `src/pages/search.json.ts`.
- Calculator maths lives in `src/lib/calc.js` and is unit-tested in `tests/calc.test.js`.
- Fonts (Bricolage Grotesque and Atkinson Hyperlegible) are bundled locally, so nothing loads from third-party servers.

## Disclaimer

Booked Solid is general information, not legal, tax or financial advice. The templates are starting points only. Have an Ontario lawyer and accountant review anything before you rely on it.
