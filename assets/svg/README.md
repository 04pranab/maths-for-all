# Maths for All SVG Asset Library

This directory contains the project's friendly mathematical decoration set.

## Rules

- Keep SVGs local and dependency-free.
- Use them for atmosphere, section decoration, and friendly game surfaces.
- Keep important information in HTML text rather than inside decorative artwork.
- Decorative HTML images use an empty alt value.
- New artwork should stay lightweight and use the project's existing visual palette.
- Avoid motion inside the SVG files themselves. Page-level motion belongs in CSS so the existing reduced-motion preference can disable it.
- Keep decoration presentation-only. SVGs must never emit analytics, telemetry, authentication, consent, or research events.

## Current set

| Asset | Intended use |
|---|---|
| math-sprout.svg | Hero decoration |
| number-cloud.svg | Arithmetic card |
| geometry-garden.svg | Shape card |
| fraction-sun.svg | Hero/game decoration |
| graph-vine.svg | Racing/progress surface |
| compass-star.svg | Slab/game decoration |
| abacus-bloom.svg | Sudoku/arithmetic decoration |
| pi-orbit.svg | Footer decoration |
| dot-matrix.svg | Subtle background texture |
| learning-ribbon.svg | Section/footer divider |
| ruler-sun.svg | General learning decoration |
| equation-bubble.svg | Question/card decoration |
| angle-fan.svg | Game-screen corner decoration |
| coordinate-stars.svg | Progress/logic decoration |
| calculator-flower.svg | Setup/auth-friendly decoration |
| number-path.svg | Game top-bar decoration |
| triangle-kite.svg | Result/completion decoration |
| fraction-pie.svg | Fraction/progress decoration |

## Accessibility

The SVG files themselves are visual resources. When embedded as decorative HTML artwork, use an empty alt value and role=presentation. Never put essential instructions or consent information only inside artwork.

## Performance

Prefer small, simple SVG shapes. Avoid raster images, embedded scripts, external dependencies, large filters, and unnecessary path dumps.

## Change rule

Every new asset should have a descriptive filename, a documented purpose, a clear placement, and no dependency on game state unless that dependency belongs to an explicitly planned feature.
