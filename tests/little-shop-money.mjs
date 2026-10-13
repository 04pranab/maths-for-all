import assert from 'node:assert/strict';
import {
  addMoney, changeDue, compareMoney, formatMoney, multiplyMoney,
  parseMoney, totalBasket, withinBudget
} from '../js/little-shop-money.mjs';

assert.equal(parseMoney('0'), 0);
assert.equal(parseMoney('₹12'), 1200);
assert.equal(parseMoney('12.5'), 1250);
assert.equal(parseMoney('₹1,234.56'), 123456);
assert.equal(formatMoney(0), '₹0');
assert.equal(formatMoney(1200), '₹12');
assert.equal(formatMoney(1250), '₹12.50');
assert.equal(formatMoney(1205), '₹12.05');
assert.equal(addMoney([]), 0);
assert.equal(addMoney([100, 250, 5]), 355);
assert.equal(multiplyMoney(125, 3), 375);
assert.equal(totalBasket([{ pricePaise: 125, quantity: 2 }, { pricePaise: 250, quantity: 1 }]), 500);
assert.equal(withinBudget(500, 500), true);
assert.equal(withinBudget(501, 500), false);
assert.equal(changeDue(1300, 2000), 700);
assert.equal(changeDue(1200, 1200), 0);
assert.equal(compareMoney(99, 100), -1);
assert.equal(compareMoney(100, 100), 0);
assert.equal(compareMoney(101, 100), 1);

for (const invalid of ['', '-1', '1.234', '1,23', '₹', 'NaN', 'Infinity', '1e2', '  ']) {
  assert.throws(() => parseMoney(invalid), undefined, 'parseMoney should reject ' + JSON.stringify(invalid));
}
for (const invalid of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
  assert.throws(() => formatMoney(invalid));
  assert.throws(() => addMoney([invalid]));
}
assert.throws(() => multiplyMoney(100, 0));
assert.throws(() => multiplyMoney(100, 1.5));
assert.throws(() => multiplyMoney(Number.MAX_SAFE_INTEGER, 2));
assert.throws(() => addMoney([Number.MAX_SAFE_INTEGER, 1]));
assert.throws(() => totalBasket([{ pricePaise: 100, quantity: 1 }, { pricePaise: -1, quantity: 2 }]));
assert.throws(() => changeDue(1000, 999));
assert.throws(() => withinBudget(-1, 100));

for (let rupees = 0; rupees < 100; rupees++) {
  for (let paise = 0; paise < 100; paise++) {
    const value = rupees * 100 + paise;
    assert.equal(parseMoney(formatMoney(value)), value, 'format/parse round trip failed for ' + value);
  }
}
console.log('Little Shop money tests passed: parsing, formatting, arithmetic, boundaries, and 10,000 round trips.');
