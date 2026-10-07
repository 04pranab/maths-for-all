# Maths for All Wiki

Maths for All is a free, browser-based learning space where mathematics is explored through play, making, observation and small discoveries.

This wiki is the project's source of truth for the learning philosophy, game architecture, accessibility boundaries, privacy commitments, development process and current roadmap.

> **Games are the medium. Mathematics is the learning. Human values are the background.**

## 1. Why this project exists

Maths for All is built for children with different ways of seeing, hearing, moving, reading, concentrating and learning.

The goal is not to make mathematics smaller or easier by removing the mathematics. The goal is to make mathematics easier to enter.

A good activity should give a learner room to:

- try without fear,
- notice something,
- change an idea,
- try again,
- explain what they noticed,
- build confidence through understanding.

The project treats the child as a participant in mathematics, not as a score waiting to be produced.

## 2. The learning philosophy

### Activity before explanation

Whenever possible, the learner encounters the mathematical idea through an action first.

Instead of starting with a long definition, the activity should create a question:

> What do you think will happen?

The explanation comes after the learner has something real to think about.

### Mistakes are information

A wrong answer, unexpected result or failed arrangement should create another opportunity to observe.

The interface should not shame the learner or make a single mistake feel final.

### No unnecessary pressure

Speed is useful only when speed is genuinely part of the mathematical idea.

Otherwise the game should provide time to inspect, reason, repeat and ask another question.

### Values through mechanics

The project does not want to turn games into moral lectures.

Values should emerge naturally from the mechanics:

- patience through repeated observation,
- perseverance through retrying,
- fairness through comparing evidence,
- honesty through recording what actually happened,
- curiosity through open questions,
- responsibility through careful choices,
- creativity through construction,
- planning through arranging and testing.

### Agency matters

The learner should usually be able to retry, change an idea, inspect evidence and continue without being trapped by an irreversible mistake.

## 3. Game map

The current game sequence is deliberately broad. Each activity explores a different mathematical way of thinking.

### 🧮 Arithmetic Quiz

Fresh arithmetic questions with clear feedback.

Focus:

- number sense,
- arithmetic operations,
- mental calculation,
- interpreting short mathematical situations.

### 🏁 Math Racing

A personal speed challenge.

Focus:

- fluent arithmetic,
- concentration,
- personal improvement.

The game should not turn another child's score into the learner's definition of success.

### 🔢 Sudoku Challenge

A logic and deduction activity.

Focus:

- constraint reasoning,
- pattern recognition,
- persistence,
- planning.

### 🔷 Shape Fitting

A visual geometry activity based on fitting and rotating pieces.

Focus:

- spatial reasoning,
- shape recognition,
- orientation,
- decomposition.

### 🧺 Slab Maths

An open-ended number activity where number slabs are moved into a basket until the target reaches zero.

Focus:

- subtraction,
- decomposition,
- multiple valid routes,
- planning.

### 🏗️ Shape Architect

A freeform geometry activity where the learner builds pictures from geometric pieces.

Current design:

- 100 independently selectable levels,
- deterministic level generation,
- multiple geometry families,
- real solvability checks,
- a full-figure silhouette guide,
- forgiving size-aware placement tolerance,
- forgiving 45-degree rotation handling,
- visual completion matching,
- keyboard and pointer interaction.

The design deliberately removed unnecessary distractor pieces and internal construction lines so the learner can focus on the picture and the geometry.

### 🎪 Probability Carnival

Probability Carnival is a story-driven probability world rather than a numbered level staircase.

The carnival contains four tents:

1. **The Curious Machine**
2. **The Machine Builder**
3. **The Mystery Tent**
4. **The Fairness Workshop**

The shared learning loop is:

**predict → experiment → observe → reason → try again**

There is no betting, gambling, money, risk-reward system or prize-for-risk mechanic. The excitement comes from discovering whether an idea survives an experiment.

## 4. Probability Carnival in detail

### The Curious Machine

The learner sees a machine containing three Sun tokens and one Moon token.

The learner:

1. predicts which outcome will appear more,
2. runs one or ten trials,
3. watches the evidence bars grow,
4. repeats the experiment,
5. compares the results with the machine's visible contents.

The intended idea is that a probability describes a chance, not a guaranteed next result.

A short run can look surprising. A longer trail can make a pattern easier to see.

### The Machine Builder

The learner builds an eight-token machine.

Each token can be switched between Sun and Moon.

The interface shows the mathematical consequence of the design:

- number of Sun tokens,
- number of Moon tokens,
- percentage chance of each outcome,
- observed results after repeated trials.

This connects a physical-looking construction to the fraction of the machine occupied by each outcome.

### The Mystery Tent

The machine is hidden.

The learner chooses a hypothesis:

- mostly Sun,
- balanced,
- mostly Moon.

The machine then supplies twelve results as clues.

Only after the evidence is collected can the learner reveal the hidden composition.

The important lesson is inference: evidence can support an idea without making a small sample certain.

### The Fairness Workshop

Two machines are compared.

Machine A contains four Sun and four Moon tokens.

Machine B contains six Sun and two Moon tokens.

The learner predicts which machine gives equal chances, collects repeated evidence, then makes a final call.

The activity is about fairness as a property of the underlying design, not about whether one short run happens to look balanced.

## 5. Probability vocabulary

The project should use plain language first.

| Idea | Child-friendly explanation |
| --- | --- |
| Outcome | What happens in one trial |
| Trial | One run of the experiment |
| Chance | How likely an outcome is |
| Evidence | What the experiments actually showed |
| Pattern | Something that keeps appearing in the results |
| Prediction | What you think may happen before testing |
| Fair | Outcomes have equal chances in the experiment |
| Sample | The results collected from a set of trials |

The interface should introduce formal terminology gradually rather than turning every game into a vocabulary test.

## 6. Accessibility

Accessibility is part of the game design, not a final decoration pass.

The project aims to support learners who may:

- need larger visual targets,
- prefer keyboard input,
- need repeated attempts,
- process information more slowly,
- have difficulty with precise pointer movement,
- benefit from strong visual grouping,
- use reduced-motion settings,
- need clear and predictable controls.

### Interaction rules

Essential controls should:

- use real buttons or links where appropriate,
- have meaningful labels,
- remain keyboard reachable,
- expose visible focus,
- provide enough physical space between targets,
- avoid relying on colour alone,
- avoid requiring unnecessary speed,
- provide text feedback for important visual events.

Canvas is used only where visual drawing is useful. Important state is also exposed through normal HTML text so that the game does not depend on the canvas alone.

The project follows the principle that semantic HTML provides useful accessibility behaviour by default, while JavaScript should enhance rather than replace basic interaction. citeturn0search1turn0search0

### Motion

Probability Carnival uses small, event-triggered animation for experiment results.

The game checks the user's reduced-motion preference and removes the non-essential movement when reduced motion is requested. This follows the browser accessibility mechanism provided by `prefers-reduced-motion`. citeturn1search0turn1search2

## 7. Privacy and research

Playing a game is not the same thing as consenting to research.

Research participation is explicitly opt-in.

If the learner or responsible user chooses not to participate:

- research collection remains disabled,
- future research events are blocked,
- locally held research events are cleared according to the project's consent boundary.

The research boundary excludes:

- passwords,
- precise location,
- camera data,
- microphone data,
- uploaded files,
- advertising identifiers,
- fingerprinting.

Privacy and research information must remain available without requiring an account.

Authentication is currently disabled for the physical-game prototype. It must not be presented as production authentication until that work is actually completed and tested.

## 8. Responsible AI

AI tools may assist with:

- software design,
- implementation,
- debugging,
- test design,
- documentation,
- review,
- release planning.

AI output is not treated as authority for:

- correctness,
- accessibility,
- privacy,
- educational quality,
- legal compliance.

The final responsibility remains with human review, automated tests and physical use of the website.

The project maintains `AI_USAGE.md` as the detailed disclosure and responsibility record.

## 9. Technical architecture

The project is intentionally modular and uses browser-native technologies.

### Shared layer

The existing shared runtime handles:

- screen switching,
- accessibility settings,
- context-sensitive help,
- local progress,
- privacy/research integration,
- common keyboard behaviour.

### Game modules

Games keep their own modules where practical.

Shape Architect is split into separate library, canvas, level, solver and runtime modules.

Probability Carnival follows the same philosophy:

- `js/probability-carnival-library.js`
  - probability-machine primitives,
  - drawing,
  - repeated trials,
  - counts,
  - dominant outcome,
  - exact token-based probability.
- `js/probability-carnival-stories.js`
  - story catalogue,
  - objectives,
  - learning outcomes.
- `js/probability-carnival-canvas.js`
  - machine drawing,
  - evidence visualisation,
  - small result animation,
  - reduced-motion handling.
- `js/probability-carnival.js`
  - story state,
  - interaction flow,
  - completion state,
  - reflection,
  - local discovery progress.
- `css/probability-carnival.css`
  - responsive visual system,
  - large controls,
  - evidence bars,
  - story cards,
  - reduced-motion rules.

This separation keeps the mathematical data, visual renderer and game flow understandable independently.

## 10. Local state

Progress that belongs to the learner's device may use `localStorage`.

Probability Carnival stores only its local discovery-completion state:

`mfa_probability_carnival_v1`

It does not require an account to play.

The probability experiments themselves are generated locally in the browser.

## 11. Testing philosophy

Testing is layered.

### Static checks

Verify:

- required files exist,
- script and stylesheet references resolve,
- expected DOM mount points exist,
- the modular game files are present.

### Browser smoke tests

The browser smoke suite checks:

- the Probability Carnival screen opens,
- all four tents are visible,
- tents are not locked behind sequential levels,
- each story can complete,
- evidence counts update,
- the mystery reveal works,
- the fairness comparison works,
- the discovery count reaches four.

### Accessibility checks

The wider smoke suite also checks:

- large-text layouts,
- mobile layouts,
- keyboard-relevant controls,
- context-sensitive help,
- Escape behaviour for overlays,
- absence of broken resources.

### Physical testing

Automated tests cannot answer everything.

Before a game is considered genuinely finished, it should be played on the real device and checked for:

- target size,
- visual clarity,
- confusing wording,
- accidental taps,
- scrolling,
- animation comfort,
- whether the mathematics is actually enjoyable,
- whether the activity feels like Maths for All rather than a generic worksheet.

## 12. Development workflow

The project follows a deliberately narrow loop:

1. discuss the idea,
2. define the learning experience,
3. build the smallest meaningful prototype,
4. play it,
5. identify real problems,
6. fix those problems,
7. test again,
8. update the wiki,
9. update project records,
10. move to the next planned game.

The rule is not "add everything we can think of".

The rule is:

> **Build the thing we agreed to build, make it good, then move on.**

Unrelated improvements should not be mixed into a game PR unless they are required for correctness, accessibility or stability.

## 13. Current roadmap

The current creative sequence is:

1. **Shape Architect** ✓ completed and hardened
2. **Probability Carnival** ✓ full playable world implemented
3. **Fraction Bakery** planned
4. **Little Shop** planned
5. **Number Maze** planned
6. **2048** later

2048 is intentionally deferred because the first five games build a broader foundation of mathematical experiences.

## 14. Acceptance standard for a new game

A new game is not finished merely because the code runs.

It should satisfy all of these:

- the mathematical idea is clear,
- the interaction is understandable,
- the activity is enjoyable enough to invite another attempt,
- mistakes are handled constructively,
- controls are physically usable,
- important state is readable,
- keyboard interaction works where applicable,
- reduced motion is respected,
- the game works on a narrow screen,
- automated checks pass,
- physical testing has been done,
- the wiki explains the accepted design,
- unrelated features have not leaked into the work.

## 15. Project records

Important project records include:

- `README.md` for the public project overview,
- `CHANGELOG.md` for release history,
- `ONGOING.md` for current implementation state,
- `AI_USAGE.md` for AI disclosure,
- `docs/WIKI.md` for design and engineering knowledge.

The public `wiki.html` mirrors the most useful parts of this document for visitors who want to understand the project without reading the repository.

## 16. The standard we are aiming for

Success is not the number of levels, buttons or features.

A successful Maths for All activity is one where a child can enter, understand what they can do, experiment safely, notice something mathematical, change an idea, and leave with a little more agency than they had before.

**The website is the artifact. The child is the reason.**
