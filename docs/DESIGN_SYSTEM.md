# Maths for All Visual System

## Direction

Maths for All should feel like a friendly mathematics desk rather than a dashboard. Shapes can be playful, but text and controls remain the primary interface.

The visual language uses the existing warm paper, indigo, leaf, marigold, and clay palette already present in the application.

## Artwork

The physical-testing prototype uses no SVG assets and no external decorative image library.

Game identity should come from the game title, interface symbols, typography, layout, and the mechanics themselves. Do not add decorative image assets to the prototype.

## Accessibility

Decorative images use empty alt text and are marked presentational in HTML. Meaningful visual content must have a useful text alternative instead.

New animation must respect prefers-reduced-motion. The current decoration layer uses only a small vertical float on large-screen hero artwork and disables that movement when reduced motion is requested.

## Performance

Keep the prototype lightweight and dependency-free. Avoid adding decorative image payloads or external image hosts.

## Change rule

A new visual asset should have a descriptive filename, a purpose documented in assets/svg/README.md, a clear place in the interface, and no dependency on game state unless that dependency is part of a planned feature.


## Database boundary

Visual assets are static presentation resources and remain independent from consent, analytics, and research events.
