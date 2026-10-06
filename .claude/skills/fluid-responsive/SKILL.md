---
name: fluid-responsive
description: Rules for Helpperr's whole-page fluid scaling, where the root font-size tracks viewport width against a design artboard (Osmo / primora.xyz style). Use when building or editing any section, component, or style; when adding type or spacing tokens; when converting Figma or px values; or when fixing anything responsive, breakpoint, overflow, or "looks too big/small on X" related.
---

# Fluid responsive system

The site scales like a zoomed image. The `html` font-size is computed from the
viewport width relative to a design artboard. Every size is in **rem** (the
Tailwind scale plus the tokens in `app/globals.css`), so the whole layout grows
and shrinks together. Breakpoints only change *layout*, never sizes.

The source of truth is the "Fluid page scaling" block in `app/globals.css`.

## How it works

```css
:root {
  --size-unit: 16;                /* root px at the artboard width */
  --size-container-ideal: 1440;   /* artboard width */
  /* Desktop: the page container is narrower than the screen (see below). */
  --page-anchor-start: 1024;      /* margins start here */
  --page-anchor-end: 1920;        /* at this screen width… */
  --page-width-at-end: 1440;      /* …the container is this wide */
  --size-container: calc(var(--page-anchor-start) * 1px
    + (100vw - var(--page-anchor-start) * 1px)
    * (var(--page-width-at-end) - var(--page-anchor-start))
    / (var(--page-anchor-end) - var(--page-anchor-start)));
  --size-font: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));
}
/* Tablet and phone bands: the container is the full screen again. */
@media (max-width: 63.999rem) {
  :root { --size-container: clamp(var(--size-container-min), 100vw, var(--size-container-max)); }
}
html { font-size: var(--size-font); }
```

`--size-container` is the width of the page container. `max-w-site` is 90rem,
and 90rem = the container width by construction, because the root is
container / 90. On tablet and phone that is the full screen, so the root is
16px exactly at the artboard width and the clamp stops it at the band edges.

### Desktop side margins

On desktop the container grows *slower* than the screen, so there is always
empty space on both sides, and it widens smoothly as the screen gets wider:

| screen | container | margin each side | root |
|---|---|---|---|
| 1024 | 1024 | 0 | 11.4px |
| 1440 | 1217 | ~111px | 13.5px |
| 1920 | 1440 | 240px | 16px (the design) |
| 2560 | 1737 | ~411px | 19.3px |

Everything inside the container keeps the design's proportions. It's the
1440 design zoomed to the container's width. For more or less margin, change
`--page-width-at-end`: a smaller value gives more margin. To make margins
start at a wider screen, raise `--page-anchor-start`. Don't hand-roll margins
on sections; `<Section>` + `max-w-site` already centres the container.

| band | viewport | artboard | media query |
|---|---|---|---|
| desktop | ≥ 1024px | 1440 | (base) |
| tablet | 768–1023 | 834 | `max-width: 63.999rem` |
| large phone | 480–767 | 660 | `max-width: 47.999rem` |
| phone | < 480 | 402 | `max-width: 29.999rem` |

- The band edges match Tailwind's `lg` (64rem) and `md` (48rem). A layout switch
  (`lg:flex-row`) and a scale switch therefore always happen at the same width.
- Media queries in rem always use the browser's *default* font-size, never the
  root. The fluid root can't move breakpoints and can't loop.
- Each band redefines the token values (`--fs-*`, `--sp-*`, `--ct-*`) in
  `:root`. `@theme inline` maps them to Tailwind utilities (`text-display`,
  `px-gutter`, `max-w-modal`, …). Components never change per band; only the
  tokens do.

## Rules

1. **Size everything in rem.** Use Tailwind's scale (`gap-4`, `text-sm`,
   `size-12`) or a token. For an arbitrary value, write rem
   (`min-h-[25rem]`), never px.
2. **px is only for hairlines and effects**: borders (`1px`), box-shadows,
   `blur()`, and outline widths. These should *not* scale.
3. **Never put `vw` in type or spacing.** The root already scales with width,
   so `clamp(… + 2vw …)` would scale twice. The only allowed viewport-driven
   sizes are things that are *meant* to track the screen: full-screen sections
   (`100svh`, `min-h-screen`), `vh` caps like `min(75vh, …)`, decorative glows,
   and the preloader word.
4. **Breakpoints are for layout only**: stacking, hiding, column counts, and
   `flex-row`. Don't write `lg:text-5xl`. If a size needs to differ by device,
   make it a token with a per-band value.
5. **Prefer `lg`/`md` for layout switches.** Using `sm` or `xl` is fine, but
   those land in the middle of a band, so check the neighbouring widths.
6. **JS measurements go in rem too.** Anything that used to be a px constant
   (scroll offsets, GSAP `y: 60` distances you want to scale) should multiply
   by the live root size:
   ```ts
   const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
   ```
   See `scrollToSection` in `lib/lenis.ts`. ScrollTrigger re-measures on
   resize automatically. `ignoreMobileResize` is on (`lib/gsap.ts`), so an
   address-bar height change doesn't re-trigger it.
7. **Hover-only effects**: Tailwind v4 `hover:` already applies only on
   `(hover: hover)` devices. For JS hover or cursor effects, gate them with
   `gsap.matchMedia().add('(hover: hover) and (pointer: fine)', …)`.

## Converting a design (Figma) value

Take the value from the frame that matches the band (1440 / 834 / 660 / 402
wide). Then `rem = px / 16`. For example, a 72px gap on the 1440 frame becomes
`gap-18` (4.5rem). A 244px height becomes `h-[15.25rem]`.

If the design only has a desktop frame, use the desktop value. The phone band
then renders it at `402/1440` of its desktop pixel size relative to the screen.
Check that it still reads well, and if not, turn it into a token.

## Adding a token

1. In `app/globals.css`, set the desktop value in `:root` (for example
   `--sp-feature-gap: 3rem;`).
2. Add an override in each band block where the value differs. Bands inherit
   from the band above them, so leave one out if it's the same.
3. Map it in `@theme inline`: `--spacing-feature-gap: var(--sp-feature-gap);`.
   `--text-*` becomes `text-*`, `--spacing-*` becomes
   `p-*`/`gap-*`/`size-*`/`h-*`, and `--container-*` becomes `max-w-*`.
4. Use `gap-feature-gap` in the component.

## Adding a section

- Wrap it in `<Section>` (`components/home-new/Section.tsx`). That gives you
  the `max-w-site` container and side borders.
- Use `px-gutter py-section` and `gap-stack`/`gap-split` for the rhythm, and
  `text-h2`/`text-lead` for the heading and intro.
- Put the layout switch at `lg:`, starting stacked on mobile.

## Known trade-offs

- At the very low end of desktop (1024px wide) the root is about 11.4px, so
  `text-sm` is about 10px (the 1440 design squeezed into 1024). If that feels
  cramped, move the desktop band edge up (e.g. to 80rem / 1280px) so
  1024–1279 uses the tablet band instead. The Tailwind `lg:` layout switch
  would have to move with it.
- The user's browser default font-size setting doesn't affect the root, since
  it is computed in px from the viewport. On desktop, browser zoom changes the
  margins and scale slightly but mostly rescales back to fill the layout.
- Values jump slightly at band edges. This is expected. Keep adjacent bands'
  token values close enough that it isn't obvious.

## Verification checklist

Run `npm run dev`. In devtools responsive mode, check every page at **2560, 1920, 1440,
1100, 1024, 1023, 900, 834, 768, 767, 660, 480, 479, 402 and 360** wide:

- At each artboard width (1440/834/660/402) the page matches the design.
- Nothing scrolls horizontally (the body has `overflow-x: clip` as a safety
  net, but don't rely on it).
- Dragging the width scales everything together, with only small jumps at
  1024 / 768 / 480.
- Hash links (`/#faq`) land just below the header.
- Run `npm run build`. It must pass. Don't write `shadow-[var(--…)]`
  (Lightning CSS bug, see the note in `globals.css`).
