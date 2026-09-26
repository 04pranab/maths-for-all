# Maths for All Visual System

## Direction

Maths for All should feel like a friendly mathematics desk rather than a dashboard. Shapes can be playful, but text and controls remain the primary interface.

The visual language uses the existing warm paper, indigo, leaf, marigold, and clay palette already present in the application.

## SVG library

Reusable mathematical decoration lives in assets/svg/. Current assets include sprouting mathematics, number clouds, geometry shapes, fractions, graph lines, compass and star motifs, abacus beads, pi orbits, dot patterns, and learning ribbons.

Artwork is local and dependency-free. Do not introduce remote image hosts for ordinary decoration.

## Placement

Use decoration to support hierarchy. Hero artwork frames the welcome message, card artwork gives each game a visual hint without replacing its title, dot patterns provide quiet texture, and ribbons/orbits can separate sections or finish the page.

Do not place important instructions, scores, consent choices, or error messages inside an SVG.

## Accessibility

Decorative images use empty alt text and are marked presentational in HTML. Meaningful visual content must have a useful text alternative instead.

New animation must respect prefers-reduced-motion. The current decoration layer uses only a small vertical float on large-screen hero artwork and disables that movement when reduced motion is requested.

## Performance

Prefer small, simple SVG paths and shapes. Avoid embedded raster images, external fonts, scripts, unnecessarily expensive filters, or large path dumps.

## Change rule

A new visual asset should have a descriptive filename, a purpose documented in assets/svg/README.md, a clear place in the interface, and no dependency on game state unless that dependency is part of a planned feature.
