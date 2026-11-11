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

The game has three difficulty levels, each with 50 sequential challenges (150 total):

- **Easy:** A two-way road with northbound and southbound car queues.
- **Medium:** A four-way junction. North + South and East + West receive separate green phases.
- **Hard:** A four-way junction with bicycles (5 seconds), cars (10 seconds), and trucks (15 seconds).

For each challenge, learners read the queue sizes and waiting times, divide the available signal budget between the two phases, and run their plan. Vehicles move according to the chosen allocation; priority points reward clearing vehicles that have waited longer.

The first three scenarios in each level are preserved. The remaining 47 scenarios per level add distinct queue layouts, waiting-time weights, vehicle mixes where applicable, and signal budgets. Completing a challenge unlocks the next one. Progress is stored locally in the browser, and the final challenge offers a replay option.

There is no countdown or forced speed requirement. Learners can restart a challenge and try a different signal plan.

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
