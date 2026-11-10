# Game asset structure

Each game has one dedicated browser entry file and one dedicated stylesheet. Shared infrastructure remains shared rather than being copied into every game.

## Game assets

| Game | JavaScript entry | Dedicated stylesheet | Status |
|---|---|---|---|
| Arithmetic Quiz | `js/arithmetic-quiz.js` | `css/arithmetic-quiz.css` | Active |
| Math Racing | `js/math-racing.js` | `css/math-racing.css` | Active |
| Sudoku Challenge | `js/sudoku.js` | `css/sudoku.css` | Active |
| Shape Fitting | `js/shapes.js` | `css/shape-fitting.css` | Active |
| Slab Maths | `js/slabmath.js` | `css/slabmath.css` | Active |
| Shape Architect | `js/shape-architect.js` | `css/shape-architect.css` | Active |
| Fraction Bakery | `js/fraction-bakery.js` | `css/fraction-bakery.css` | Active |
| Little Shop | `js/little-shop.js` | `css/little-shop.css` | Active |
| Number Maze | `js/number-maze.js` | `css/number-maze.css` | Active |
| Probability Machine | `js/probability-carnival.js` | `css/probability-carnival.css` | Implemented, hidden |
| Math Court | `js/math-court.js` | `css/math-court.css` | Shelved, hidden |

Arithmetic Quiz and Math Racing have separate entry files. They share `js/question-bank.js` for question generation and encouragement helpers. Little Shop's money logic and catalogue now live in its single module entry. Number Maze's deterministic engine and interaction layer, Shape Architect's geometry/rendering helpers, Probability Machine's story/library/canvas helpers, and Math Court's case catalogue are bundled into their respective game entry files.

## Shared application assets

- `js/script.js`: screen navigation, accessibility controls, progress, analytics, and shared overlays.
- `js/question-bank.js`: shared arithmetic question generation and encouragement helpers.
- `js/consent.js` and `js/research-gateway.js`: consent and research infrastructure.
- `css/style.css`: global reset, application shell, and common layout primitives.
- `css/game-themes.css`: shared menu styling and the common game-theme layer.
- `css/interactions.css`: cross-site link, focus, and interaction states.
- `css/wiki.css`: Wiki-only presentation.

Shared files are intentional. Do not duplicate navigation, accessibility, analytics, question generation, or common visual primitives into individual games.

## Regression rule

When a game asset is consolidated or renamed, update `index.html`, its tests, and this map in the same change. Remove the old asset only after all runtime and test references have moved. Run the full GitHub Actions Tests workflow and Pages deployment against the exact proposed commit before merging.


## Keyboard interaction contract

- **Tab / Shift+Tab:** move through native buttons, links, and form controls in reading order. Focus indicators remain visible.
- **Enter:** activate the focused button or submit the focused form. Arithmetic Quiz and Math Racing submit their answer fields with Enter; each game must call its own submit function.
- **Space:** activate focused native buttons. Custom interactive controls must provide equivalent Enter and Space behaviour.
- **Escape:** dismiss an open overlay first. Otherwise a game may clear its current selection; if no local action consumes Escape, return to the game menu. When a text field is focused, Escape blurs it without deleting the learner's typed answer; a second Escape exits.
- **Arrow keys:** reserved for game boards and spatial controls where the game documents them (Sudoku, Number Maze, Shape Architect, and Slab Maths). They must not steal arrow keys while the learner is typing.
- **Little Shop:** Tab reaches each product and basket control; Enter/Space activates them; Enter submits the money answer; Escape preserves typed text on first press and leaves the game on the next press.

The browser smoke test uses real Chrome DevTools keyboard input to verify a keyboard-only Little Shop sale, Math Racing's Enter submission, and Escape exit from every game. Update this contract and its tests whenever a game's key map changes.
