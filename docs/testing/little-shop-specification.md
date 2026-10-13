# Little Shop: Approved Implementation Specification

**Milestone:** LS-00  
**State:** Specification proposal for owner/educator review; no gameplay code in this milestone.  
**Roadmap:** [Little Shop PR plan](little-shop-pr-plan.md)

## Product promise

Little Shop is a calm, interactive mathematics game in which learners explore prices, quantities, totals, budgets, payment and change. The shopping setting is a teaching metaphor, not an assumption that every learner has shopping experience.

The project principle is: **games are the medium, mathematics is the learning, human values are the background.**

## Learning objectives

By the end of the proposed sequence, a learner should have opportunities to practise:

1. Reading and comparing numeric prices.
2. Adding two or more amounts and interpreting a total.
3. Comparing a total with a budget.
4. Building an exact amount from a bounded set of denominations.
5. Understanding price, payment and change as related quantities.
6. Multiplying an item price by a quantity.
7. Solving multi-step constraints with more than one valid basket where appropriate.
8. Reading rupees and paise when this is suitable for the learner's current learning goals.

This is a game specification, not a claim that playing it will produce learning gains.

## Currency and arithmetic contract

- Internal currency unit: integer paise (1 rupee = 100 paise).
- All prices and totals must be safe, non-negative integers in paise.
- No currency calculation may use floating-point arithmetic.
- UI formatting is a boundary operation. Format paise as ₹12 when the amount is a whole rupee and ₹12.50 when paise are non-zero.
- A price parser must reject malformed, negative, non-finite, or unsupported values instead of silently rounding them.
- Basket total is the sum of pricePaise multiplied by quantity for every line.
- A basket is within budget iff totalPaise is less than or equal to budgetPaise.
- Change is valid iff paymentPaise is at least totalPaise, and equals paymentPaise minus totalPaise.
- No real payment or transaction occurs. All values are fictional learning data.
- Each task must be solvable from information shown on screen; no hidden denomination or unstated rule may be required.

## Proposed stage contract

The 100-level plan uses ten stages. Exact prices and task instances are data; stage rules define the mathematics.

| Levels | Stage | Required task family | Constraints |
|---|---|---|---|
| 1–10 | Read the Shelf | Compare two or three item prices; select cheaper, dearer, or equal | Whole rupees; no timer; labels visibly tied to items |
| 11–20 | One-Item Checkout | Match an item to its exact price or select an exact payment amount | Small whole-rupee values; choices distinct |
| 21–30 | Basket Basics | Add two item prices and select or enter the total | Whole rupees; all totals bounded and displayed clearly |
| 31–40 | Budget Basket | Determine whether a specified basket fits a budget and how much remains when it does | Include fit and does-not-fit examples; no negative remaining amount |
| 41–50 | Make the Amount | Select a valid combination of displayed denominations to reach an exact target | Accept every valid combination; do not require one arbitrary combination |
| 51–60 | Change Counter | Find change after a payment | Payment is never below total unless the task explicitly asks whether payment is enough |
| 61–70 | More in the Basket | Calculate totals for multiple items and quantities | Quantities are positive integers with clear increment/decrement controls |
| 71–80 | Spend Thoughtfully | Satisfy a stated shopping goal while staying within a budget | Validate constraints; support multiple valid baskets if the prompt allows them |
| 81–90 | Rupees and Paise | Add or compare mixed rupee/paise values | Optional curriculum extension if the owner/educator decides it is not suitable for the intended group |
| 91–100 | Shopkeeper's Challenge | Combine basket, budget, payment and change reasoning | Multi-step tasks must reveal each necessary value; no speed pressure |

## Task data schema

Every task must be represented by validated data, not improvised DOM text. The eventual task contract should contain:

- id: stable unique task identifier.
- level: integer 1–100.
- stage: stable stage key.
- type: one of the approved task families above.
- prompt: short learner-facing instruction.
- items: bounded item IDs, names and integer-paise prices where relevant.
- budgetPaise, paymentPaise and targetPaise only when required by that task type.
- expected: canonical expected result or a validator rule for multiple valid answers.
- hintSteps: optional ordered reasoning prompts that do not reveal the final answer before an attempt.
- explanation: concise, mathematically checked reasoning shown after an attempt.
- seed: reproducibility input for generated tasks.

Validate task data before rendering. Unknown task types, missing required fields, impossible budgets, negative change, duplicate answer choices, and out-of-range levels must fail safely during tests and never be presented as playable tasks.

## Catalogue and language

- Use a small, curated catalogue with neutral generic objects, such as a notebook, pencil, fruit, cup, ball, book, and ruler.
- Do not use brands, regional stereotypes, family-income assumptions, or culture-specific trivia as hidden prerequisites.
- Use Indian rupees and paise consistently.
- Explain price, total, budget, payment and change in context; avoid long paragraphs.
- Item identity must be conveyed by text as well as any visual or colour distinction.
- Avoid implying that a learner should spend real money or that cheaper is always the morally correct choice.

## Interaction contract

- No timer, streak pressure, leaderboard, ranking, loss of lives, or punishment for wrong answers.
- The learner can retry, reset a task, request a hint, or leave the game.
- A hint is optional and progressive. Before the first attempt it may clarify the operation but must not disclose the answer.
- Feedback is respectful and specific. A wrong answer should identify the mathematical relationship to reconsider, not label the learner.
- Touch, mouse/pointer, and keyboard must support every essential action. Do not rely on drag-only controls.
- Focus must remain visible; buttons and inputs require accessible names; dynamic feedback should be announced without repeated noisy announcements.
- Respect text scaling, browser zoom, reduced-motion settings and narrow screens.
- Do not make task success depend on speed, colour perception alone, or precise fine-motor dragging.

## Progress and privacy

- Progress, if implemented, is local, minimal, versioned and namespaced.
- Store only the smallest progress state needed, such as completed level IDs and current level.
- Do not store names, contact details, diagnoses, answer histories, behavioural profiles, or analytics.
- Storage failure must not prevent playing. Corrupt data should recover safely with an understandable message or clean default.
- No login, cloud sync, new backend table, telemetry, or research data collection is part of Little Shop.

## Testing contract

### Pure arithmetic tests
- zero and smallest supported values;
- whole rupees and paise formatting;
- sum of empty/non-empty lists as explicitly defined;
- multiple line items and quantity multiplication;
- budget equal to, above, and below total;
- exact payment, overpayment, and underpayment;
- invalid values, overflow and unsupported denomination combinations.

### Task-generation tests
- all 100 levels map to an approved stage and task type;
- every task has one intended answer or a correct multi-answer validator;
- distractors are distinct and not accidentally correct;
- no impossible denomination, budget, basket, payment or change problem;
- seeded generation is repeatable;
- difficulty and task types follow the stage contract.

### Browser and accessibility tests
- menu open/close and repeated navigation;
- basket state and totals stay consistent after rapid actions;
- keyboard-only and pointer interaction for every essential flow;
- desktop, tablet and narrow-mobile layout with no horizontal overflow or clipped controls;
- visible focus, accessible labels, live feedback, text zoom, and reduced motion;
- corrupt/unavailable storage, reset, replay, and progression;
- no uncaught browser errors or failed local resources.

## Release gates

1. No known blocker in arithmetic, interaction, privacy, or accessibility.
2. All relevant repository CI checks pass on the exact final commit.
3. Automated tests cover each task family and generated level.
4. Responsive and keyboard checks pass; assistive technology still requires appropriate manual review.
5. A supervised physical learner review is completed with required institutional permission and learner assent.
6. Anonymous observations are reviewed by the project owner and relevant educator, and an explicit accept/revise/pause decision is recorded.

A small formative pilot is not evidence of broad educational effectiveness. Until the physical-review decision is recorded, Little Shop must not be declared accepted.
