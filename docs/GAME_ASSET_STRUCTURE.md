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
- `css/game-themes.css`: shared menu and non-game-specific theme rules.
- `css/interactions.css`: cross-site link, focus, and interaction states.
- `css/wiki.css`: Wiki-only presentation.

Shared files are intentional. Do not duplicate navigation, accessibility, analytics, question generation, or common visual primitives into individual games.

## Regression rule

When a game asset is consolidated or renamed, update `index.html`, its tests, and this map in the same change. Remove the old asset only after all runtime and test references have moved. Run the full GitHub Actions Tests workflow and Pages deployment against the exact proposed commit before merging.
