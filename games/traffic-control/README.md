# Traffic Control Centre

A standalone, browser-based traffic-junction simulation for Maths for All. It uses only HTML, CSS, and vanilla JavaScript modules—no Python, build step, framework, external image library, remote font, or backend service.

## Open the game

Open \`index.html\` through a static web server. For example, from the repository root:

\`\`\`sh
npx http-server .
\`\`\`

Then visit:

\`\`\`
http://localhost:8080/games/traffic-control/
\`\`\`

The game uses JavaScript modules, so serve it over HTTP rather than opening the file directly with \`file://\`.

## Gameplay

The learner operates a traffic junction with two mutually exclusive vehicle phases:

- **North + South** moves one vehicle from each of those approaches.
- **East + West** moves one vehicle from each of those approaches.
- Every wave is released only after the learner explicitly chooses a phase.
- The selected phase remains green while its vehicles pass; the other approaches remain red.
- When all vehicles have cleared, the learner completes a short maths reflection.
- The final mission stops all vehicles and lets pedestrians cross in groups before asking a time question.

Each difficulty contains 50 sequential challenges (150 total). Completing a challenge unlocks the next one, and progress is saved locally in the browser. The 50 scenarios per level vary queue sizes, waiting times, vehicle mixes, and cycle budgets. The final challenge offers a replay option.

The game introduces these skills:

1. Counting vehicles and understanding a green wave.
2. Addition across four queues.
3. Repeated addition and division into equal groups.
4. Planning across two pairs of approaches.
5. Pedestrian crossing groups and elapsed-time multiplication.

There is no countdown, score penalty, sound effect, or forced speed requirement. Incorrect answers can be retried.

## Visual assets

The city map is original inline SVG artwork: roads, lane markings, zebra crossings, buildings, trees, traffic lights, cars, taxis, vans, buses, bicycles, and pedestrians are drawn in the project files. No third-party art assets are loaded at runtime.

## Accessibility choices

- Semantic buttons and keyboard-operable controls.
- Visible keyboard focus.
- Live status announcements for traffic and maths feedback.
- Larger-text toggle.
- Reduced-motion toggle, also respecting the operating system's reduced-motion preference.
- No compulsory timers or audio.
- One signal decision at a time, clear instructions, retry-friendly feedback, and a restart button for every mission.

These are configurable access supports, not a claim that one design meets every neurodivergent learner's needs. Supervised learner, educator, and assistive-technology review is still required.

## Tests

Run the challenge-data checks from the repository root:

\`\`\`sh
node games/traffic-control/tests/mission-data.test.mjs
\`\`\`

The test verifies that all three levels contain exactly 50 unique challenge layouts, valid queues, matching vehicle types, meaningful objectives, and cycle budgets compatible with the signal slider.

## Integration note

This contribution is intentionally self-contained under \`games/traffic-control/\`. It does not edit the existing home page, game router, stylesheets, scripts, package configuration, or current game files. The standalone page can be reviewed and tested before a separate, minimal home-menu integration is considered.
