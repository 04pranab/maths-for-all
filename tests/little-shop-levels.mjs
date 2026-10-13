import assert from 'node:assert/strict';
import { CATALOGUE, generateLevel, getStageForLevel, getStageList, validateLevel } from '../js/little-shop-levels.mjs';

const byId = new Map(CATALOGUE.map(item => [item.id, item]));
assert.equal(getStageList().length, 10);
assert.equal(getStageList().reduce((sum, stage) => sum + stage.last - stage.first + 1, 0), 100);
assert.throws(() => getStageForLevel(0));
assert.throws(() => getStageForLevel(101));
assert.throws(() => getStageForLevel(1.5));

for (let seed = 1; seed <= 30; seed++) {
  for (let level = 1; level <= 100; level++) {
    const task = generateLevel(level, seed);
    assert.equal(task.level, level);
    assert.equal(task.stage, getStageForLevel(level).key);
    assert.equal(validateLevel(task), true, 'Invalid task at level ' + level + ' seed ' + seed);
    assert.deepEqual(generateLevel(level, seed), task, 'Seeded task is not deterministic');
    assert.equal(task.choices.length, ['compare-price', 'budget-check'].includes(task.type) ? 2 : 4);
    assert.equal(new Set(task.choices.map(choice => String(choice.value))).size, task.choices.length);
    assert.equal(task.choices.filter(choice => String(choice.value) === task.answer).length, 1);
    assert.ok(task.hintSteps.length >= 2, 'Task needs graduated hints.');
    assert.notEqual(task.hintSteps[0], task.hintSteps[1], 'Graduated hints must differ.');

    if (task.type === 'compare-price') {
      const [a, b] = task.prices;
      assert.notEqual(a, b);
      const winner = task.choices.find(choice => choice.value === task.answer);
      assert.ok(winner);
      assert.equal(byId.get(task.answer).pricePaise, Math.min(a, b));
    } else if (task.type === 'exact-payment') {
      assert.equal(Number(task.answer), task.pricePaise);
    } else if (task.type === 'basket-total') {
      assert.equal(Number(task.answer), task.items.reduce((sum, line) => sum + byId.get(line.id).pricePaise * line.quantity, 0));
    } else if (task.type === 'budget-check') {
      assert.equal(task.answer, task.totalPaise <= task.budgetPaise ? 'yes' : 'no');
      assert.ok(task.totalPaise >= 0 && task.budgetPaise >= 0);
    } else if (task.type === 'make-amount') {
      assert.equal(task.choices.filter(choice => choice.amountPaise === task.targetPaise).length, 1);
      assert.equal(task.choices.find(choice => choice.value === task.answer).amountPaise, task.targetPaise);
    } else if (task.type === 'change') {
      assert.equal(task.paymentPaise - task.totalPaise, task.changePaise);
      assert.equal(Number(task.answer), task.changePaise);
      assert.ok(task.paymentPaise >= task.totalPaise);
    } else if (task.type === 'quantity-total') {
      assert.equal(Number(task.answer), task.items.reduce((sum, line) => sum + byId.get(line.id).pricePaise * line.quantity, 0));
      assert.ok(task.items.every(line => Number.isSafeInteger(line.quantity) && line.quantity > 0));
    } else if (task.type === 'budget-combination') {
      const valid = task.choices.filter(choice => {
        const ids = choice.items.map(line => line.id);
        return ids.includes('notebook') && ids.includes('apple') && choice.totalPaise <= task.budgetPaise;
      });
      assert.equal(valid.length, 1);
      assert.equal(valid[0].value, task.answer);
    } else if (task.type === 'paise-total') {
      assert.equal(Number(task.answer), task.amountsPaise[0] + task.amountsPaise[1]);
    } else if (task.type === 'multi-step') {
      assert.equal(task.totalPaise, task.items.reduce((sum, line) => sum + byId.get(line.id).pricePaise * line.quantity, 0));
      assert.equal(task.paymentPaise - task.totalPaise, task.changePaise);
      assert.equal(Number(task.answer), task.changePaise);
    }
  }
}
console.log('Little Shop levels passed: 3,000 seeded tasks across all 100 levels, unique answers, valid totals, budgets, denominations, and change.');
