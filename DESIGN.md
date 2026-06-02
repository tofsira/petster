---
name: Petster
description: Thai editorial pet knowledge brand for dog and cat owners.
---

# Design System: Petster

> Status: **implemented**. This documents the design system as actually built in
> `apps/web/src/app/(site)/petster.css` and the page components, not an aspiration.
> When code and this file disagree, fix whichever is wrong, then update the other.
> Re-run `$impeccable document` after large visual changes.

## Overview

**Creative North Star: "The Trustworthy Companion Desk"**

Petster feels like a well-kept editorial desk for modern pet owners: calm, useful,
current, visibly organized. Information-rich in the way strong Asian content
products are, but disciplined enough that a worried owner can scan quickly and
find a path without stress. Warm without being soft-for-its-own-sake. Not a toy
store, not a meme brand, not a vet-hospital portal.

**Key characteristics:**

- Medium-density editorial layout with clear grouping
- High scanability on mobile (mobile-first; desktop adds columns, not chrome)
- Calm authority, never cold authority
- Warmth carried by typography, color accents, and composition (never by beige bg)
- Dog and cat pathways feel distinct but share one brand system

## Colors

Strategy: **restrained** — clean cool neutrals, one teal brand accent, one coral
support accent used sparingly. Warmth comes from composition, not a tinted canvas.

All colors live as CSS custom properties in `:root` (`petster.css`). Use the
tokens; do not hard-code hex.

| Token | Value | Role |
|---|---|---|
| `--page` | `#f8fbfb` | top of body gradient |
| `--bg` | `#eef4f3` | bottom of body gradient |
| `--surface` | `#ffffff` | cards, panels |
| `--soft` / `--surface-soft` | `#f3f8f7` / `#f7fbfa` | subtle secondary surfaces |
| `--ink` | `#173038` | headings, current-page text |
| `--body` | `#334e55` | long-form reading text |
| `--muted` | `#687a7f` | metadata, secondary labels |
| `--line` | `rgba(23,48,56,0.1)` | borders, separators |
| `--primary` | `#247f7b` | brand teal: links, tags, emphasis |
| `--primary-deep` | `#176560` | hover/active teal, inline links |
| `--accent` | `#c97765` | warm coral: warnings, small punctuation |
| `--trust` | `#1b4148` | deep teal-ink: cover-tile background base |

Body bg is a vertical gradient `--page → --bg`. The whole neutral band is cool
(teal-leaning), never warm/cream. **The warmth-without-beige rule holds.**

Contrast: `--body`/`--ink` on `--surface`/`--page` pass AA. `--muted` is for
short metadata only, not paragraphs. White text on `--trust` cover tiles uses a
gradient scrim + text-shadow so it passes over any photo.

## Typography

Two self-hosted families (see `apps/web/public/fonts`, `@font-face` at top of
`petster.css`). **Not** loaded via next/font/google. Thai + Latin subsets, both
with `unicode-range` splits so Thai glyphs come from the Thai woff2.

- **Prompt** (display): headings, brand, labels, card titles. Weights 500/600/700.
- **Sarabun** (body): all reading text. Weights 400/500/600/700.

Fallback stack on both: `"Leelawadee UI", "Noto Sans Thai", "Segoe UI", Tahoma, sans-serif`.

### Scale (mobile → desktop)

| Element | Mobile | Desktop (≥980px) |
|---|---|---|
| `h1` | 2.25rem | 3.4rem |
| `h2` | 1.65rem | 2rem |
| `h3` | 1.14rem | 1.28rem |
| `.article-title` | `clamp(1.55rem, 5.5vw, 2.35rem)` | same clamp |
| body | 1rem / line-height 1.66 | same |

`letter-spacing: 0` on headings (Thai does not want negative tracking).
`text-wrap: pretty` on headings + prose. **Do not** put `max-width: Nch` on
headings — Thai has no spaces between words, so a ch cap forces breaks mid-word.
Let the container width wrap naturally. (See gotchas.)

## Spacing

4pt-based token scale. Use these everywhere; do not write arbitrary rem values.

| Token | Value |
|---|---|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.5rem (24px) |
| `--space-6` | 2rem (32px) |

Rhythm: tight within a group (`--space-1`/`--space-2`), generous between sections
(`--space-5`/`--space-6`). **One spacing mechanism per axis** — if a container
uses `gap`, child elements must not also add `margin` in that direction (that
double-spaces; it bit us on `.section-label` inside gapped sections).

## Radius & elevation

- `--radius-sm` 8px (images, small tiles), `--radius-md` 12px (cards, panels),
  `--radius-lg` 16px (bottom-nav). **Cards cap at 12–16px; never 24px+.**
- Light layered system. Shadows are rare (`--shadow-soft`, `--shadow-float`) and
  reserved for the floating bottom-nav and primary button. Depth comes from
  spacing, borders (`--line`), and tonal surfaces — not drop shadows on cards.
- **Structure before shadow.** Never pair a 1px border with a wide soft shadow on
  the same card.

## Layout & breakpoints

`--shell: 1180px`, centered, `width: min(calc(100% - 2rem), var(--shell))`.

Breakpoints in use: **359** (tiny phones, smaller card tokens), **720** (cards
become grids), **760** (heads go 2-col, excerpts show), **800** (article related
3-col), **980** (desktop nav appears, bottom-nav hides), **1040** (wider tokens,
category list 3-col).

Mobile-first pattern, applied consistently across pages:
- **Mobile**: vertical lists with a horizontal-row layout (image left, copy right)
  separated by `--line` dividers.
- **Desktop**: list turns into a card grid. Card grids use `align-items: start`
  so cards size to content — no stretch-to-tallest empty gaps.

## Components

### Cover tile vs document card (the key distinction)

Category and article cards must read as different object types so users can tell
"a section to enter" from "a piece to read".

- **Category = cover tile** (`.animal-topic-card`): image fills the whole tile,
  label sits **on** the image at the bottom over a `--trust` gradient scrim, with
  a `→` arrow. No white body. Mental model: a doorway.
- **Article = document card** (`.animal-article-link`, `.category-article-link`):
  image on top, white body below with teal category tag, title, excerpt, and a
  `⏱ อ่าน N นาที` meta row. Mental model: a document.

Never let these two collapse into the same image-top-text-below card.

### Breadcrumb (`.breadcrumb`)

Pattern on every page: `หน้าแรก › [animal] › [category] › [current]`. The current
page is a non-link `<span aria-current="page">` (bold, `--ink`); ancestors are
links (`--muted`); separators are `<span aria-hidden="true">›</span>` (faint).
Long article titles truncate at `22ch` with ellipsis. Top position is identical
across all page types (no per-page padding-top above it).

### Article hero

Full-width image **below** the header text block, `height: clamp(200px, 38vw, 280px)`,
`--radius-md`. Approved layout — not a side-by-side 2-col header.

### Content blocks (Lexical → JSX)

Rendered in `[slug]/page.tsx` `bodyConverters`. Each has a `.block-*` style:
`callout` (tip/warning/info), `keyTakeaways`, `redFlags`, `whenToSeeVet`
(soon/urgent/watch), `stepList`, `comparisonTable`, `imageBlock`. Warnings/red-flags
use `--accent` coral; takeaways/tips use `--primary` teal.

### Chrome

- `.site-header`: sticky, blurred translucent bg. Desktop shows nav links; mobile hides them.
- `.bottom-nav`: fixed floating pill, mobile only (hidden ≥980px).
- Search panel: primary surface on the homepage, not decorative.

## Motion

Restrained. `transform`/`opacity` only. Image `scale(1.03–1.05)` on card hover,
arrow nudge on cover tiles. `.reveal` IntersectionObserver fade-up that defaults
to visible (content never gated on JS). Full `prefers-reduced-motion` reset at the
bottom of `petster.css`.

## Do / Don't

**Do**: use tokens for color/space/radius; keep dog and cat paths distinct but
on one system; optimize Thai mobile reading; keep cover-tile vs document-card
distinction; size desktop cards to content.

**Don't**: beige/cream backgrounds; gray paragraph text on tinted bg; `max-width: Nch`
on Thai headings; gap + margin double-spacing; cards over 16px radius; border +
wide shadow on one element; English UI labels ("LATEST") on this Thai-only site;
shadcn-default or SaaS-dashboard looks.
