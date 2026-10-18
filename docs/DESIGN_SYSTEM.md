# Maths for All Visual System

## Direction

Maths for All should feel like a friendly mathematics desk rather than a dashboard. Shapes can be playful, but text and controls remain the primary interface.

The visual language uses the existing warm paper, indigo, leaf, marigold, and clay palette already present in the application.

## Artwork

The physical-testing prototype uses no SVG assets and no external decorative image library.

Game identity should come from the game title, interface symbols, typography, layout, and the mechanics themselves. Do not add decorative image assets to the prototype.

## Accessibility

Visual decoration must never replace instructions, scores, consent choices, or error messages. Meaningful information must remain available as text.

New interaction and animation must respect `prefers-reduced-motion` where applicable.

## Performance

Keep the prototype lightweight and dependency-free. Avoid adding decorative image payloads or external image hosts.

## Change rule

New visual work should first improve clarity, interaction, feedback, or accessibility. Decorative asset libraries remain out of scope for the physical-testing prototype.

## Interactive consistency and responsiveness

- Inline links use the indigo palette, remain underlined at rest, and keep a stable visited colour. Navigation links are visually treated as navigation rather than article links.
- Keyboard focus must remain clearly visible on links, buttons, inputs, and custom controls. A game-specific visual state must not remove the focus ring.
- Inputs need a programmatic label; placeholder text is a hint, not a substitute for a label.
- Small-screen layouts should reflow rather than clip. Level selectors with many entries should use a scrollable region and touch-sized controls rather than compressing every entry into an unusably small grid.
- Review visible copy for dignity: feedback should name the next step, not judge the learner. Avoid insults, ability-based labels, and wording that frames changing an answer as a character flaw.
- Browser regression coverage includes every game screen at 320, 390, 768, 1024, 1366 and 1920 CSS pixels; the 320px case also increases the text scale. The Wiki is checked separately for link styling, navigation targets, search and the interactive game guide.
- Emulated browser widths are automated checks, not a substitute for testing on physical phones/tablets, keyboard-only use, screen readers, and with learners and educators.

## Database boundary

Visual presentation remains independent from consent, analytics, and research events.
