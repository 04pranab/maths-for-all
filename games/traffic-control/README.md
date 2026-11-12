# Traffic Control Centre

Traffic Control Centre is a native game screen in the main Maths For All arcade.

Open it from the game menu or directly at:

```
https://04pranab.github.io/maths-for-all/index.html#traffic-control
```

The former standalone URL redirects to the main arcade route. There is only one copy of the game interface.

## Gameplay

The game has three difficulty levels, each with 50 sequential challenges (150 total):

- **Easy:** A two-way road with northbound and southbound car queues.
- **Medium:** A four-way junction. North + South and East + West receive separate green phases.
- **Hard:** A four-way junction with bicycles (5 seconds), cars (10 seconds), and trucks (15 seconds).

Learners read queue sizes and waiting times, divide the available signal budget between the phases, and run their plan. Priority points reward clearing vehicles that have waited longer. Progress is stored locally in the browser.

## Architecture

- All Traffic Control markup lives in the main `index.html` under `#screen-traffic-control`.
- All Traffic Control JavaScript is bundled in the single `js/traffic-control.js` module: mission data, 3D city rendering, game logic, pause/resume, help, and exit controls.
- Game-specific styles live in `css/traffic-control.css`, scoped to the Traffic Control screen so they do not affect other games.
- Three.js is loaded dynamically from jsDelivr for the 3D city. If it cannot load, the game displays an explanatory fallback.
- Existing account score submission and research-event hooks are retained.

## Accessibility

- Semantic buttons and keyboard-operable controls.
- Visible keyboard focus and live status announcements.
- Shared first-play instructions, help, pause, and exit confirmation.
- Larger text support and reduced-motion support.
- No compulsory timers or audio.

## Tests

Run the challenge-data checks from the repository root:

```sh
node games/traffic-control/tests/mission-data.test.mjs
```
