# Little Shop: Continuous Cashier Counter

**Status:** Revised scope implemented on a focused feature branch; CI and review are required before merge. Physical learner/educator acceptance remains pending.  
**Scope decision:** This document supersedes the earlier 100-level curriculum proposal. Little Shop has no levels, stages, level map, timer, comparison quiz, or end-of-game progression.

## Product intent

Little Shop is a small, open-ended fruit-shop counter. A customer asks for items, the learner fills the basket, makes the bill, handles the customer's payment, returns change if needed, and welcomes the next customer. The counter continues indefinitely until the learner leaves.

**Games are the medium. Mathematics is the learning. Human values are the background.**

## The complete transaction

1. **Customer order:** A customer asks for two to four fruit items and quantities.
2. **Shelf and basket:** The learner can browse 22 fruits and add, remove, or adjust quantities. The requested items are visible beside the counter.
3. **Order check:** The bill button remains disabled until the basket exactly matches the requested items and quantities.
4. **Bill and payment:** Making the bill reveals the total and the simulated amount the customer hands over. Payment may be short, exact, or greater than the bill.
5. **Short payment:** The learner selects **Ask how much more?**, calculates the difference, enters it, and asks the customer for that amount. Incorrect answers allow retry without revealing the shortfall.
6. **Exact payment:** The learner can complete the sale directly.
7. **Overpayment:** The learner calculates the change. After a correct answer, they return that amount by selecting simulated ₹50, ₹20, ₹10, ₹5, ₹2 and ₹1 notes/coins. The sale cannot finish until the amount returned is exact.
8. **Next customer:** The sale summary appears and **Next customer** begins a fresh transaction. There is no last customer or final level.

## Boundaries

- Use integer paise for every internal money calculation; format rupees/paise only for display and input.
- Use simulated money only. This is not ecommerce or a real payment tool.
- No login, cloud sync, analytics, saved learner profile, names, contact details, diagnoses, answer history, or external product APIs.
- No time pressure, leaderboard, level map, level unlocking, comparison quiz, or forced progression.
- Errors should invite another attempt and explain the operation without shaming the learner.
- Keep pointer, touch, keyboard, visible-focus, screen-reader status, reduced-motion, forced-colour, and narrow-screen behaviour in scope.
- The catalogue and customer orders must not depend on cultural knowledge beyond recognizing the named fruit and reading the quantities/prices.

## Verification contract

### Pure logic tests
- Validate all catalogue items and unique IDs.
- Generate 1,000 reproducible customer orders; each order has two to four distinct fruit items and valid quantities.
- Verify order totals, exact basket matching, and the short/exact/change classification.
- Verify that every overpayment can be represented by the provided denominations.
- Use integer paise and reject malformed money input.

### Browser end-to-end tests
- Open Little Shop repeatedly and confirm the level UI is absent.
- Fill a requested order and verify billing stays unavailable until the basket matches exactly.
- Exercise underpayment, wrong shortfall then correct shortfall, exact payment, overpayment, wrong change then correct change, note/coin return, sale completion, and next-customer reset.
- Audit desktop (1366px), tablet (768px), and mobile (390px) for overflow, clipping and usable control size.
- Run the complete repository CI, including existing auth, PostgreSQL and research-gateway checks.

### Physical review
Automation verifies arithmetic and state transitions, not whether a child understands the wording or finds the interaction comfortable. Before calling the game accepted, conduct supervised formative review with appropriate permission and learner assent. Record anonymous observations, allow breaks and stopping, and do not claim learning effectiveness from a small usability pilot.

## Definition of done

- The complete cashier loop works end to end.
- All focused and repository-wide checks pass on the final PR head.
- No level map, progression, timer, or obsolete level engine remains in Little Shop.
- README, Wiki, ongoing engineering record, changelog, AI-use disclosure, and this specification agree on the current design.
- Physical learner/educator review is recorded separately from automated test status.
