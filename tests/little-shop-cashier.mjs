import assert from 'node:assert/strict';
import { CATALOGUE, chooseCustomerPayment, createCustomerOrder, getSettlement, orderMatches, orderTotalPaise } from '../js/little-shop-catalogue.mjs';
import { changeDue, formatMoney, parseMoney, totalBasket } from '../js/little-shop-money.mjs';

assert.equal(CATALOGUE.length, 22);
assert.equal(new Set(CATALOGUE.map(item => item.id)).size, CATALOGUE.length);
assert.ok(CATALOGUE.every(item => Number.isSafeInteger(item.pricePaise) && item.pricePaise > 0));
assert.ok(CATALOGUE.every(item => item.unit && item.name && item.icon));

const byId = new Map(CATALOGUE.map(item => [item.id, item]));
for (let seed = 1; seed <= 1000; seed++) {
  let state = seed;
  const random = () => {
    state = (state * 48271) % 2147483647;
    return (state - 1) / 2147483646;
  };
  const customer = createCustomerOrder(random);
  assert.ok(customer.name);
  assert.ok(customer.items.length >= 2 && customer.items.length <= 4);
  assert.equal(new Set(customer.items.map(item => item.id)).size, customer.items.length);
  assert.ok(customer.items.every(line => byId.has(line.id) && Number.isInteger(line.quantity) && line.quantity >= 1 && line.quantity <= 3));
  const total = orderTotalPaise(customer.items);
  assert.equal(total, totalBasket(customer.items.map(line => ({ pricePaise: byId.get(line.id).pricePaise, quantity: line.quantity }))));
  const basket = new Map(customer.items.map(line => [line.id, line.quantity]));
  assert.equal(orderMatches(customer.items, basket), true);
  assert.equal(orderMatches(customer.items, new Map()), false);
  const payment = chooseCustomerPayment(total, random);
  const settlement = getSettlement(total, payment.paidPaise);
  assert.equal(settlement.kind, payment.kind);
  if (payment.kind === 'short') {
    assert.ok(payment.paidPaise < total);
    assert.equal(settlement.amountPaise, total - payment.paidPaise);
  } else if (payment.kind === 'exact') {
    assert.equal(payment.paidPaise, total);
    assert.equal(settlement.amountPaise, 0);
  } else {
    assert.ok(payment.paidPaise > total);
    assert.equal(settlement.amountPaise, payment.paidPaise - total);
    assert.ok(settlement.amountPaise <= 5000);
  }
}
assert.equal(chooseCustomerPayment(12300, () => 0.1).kind, 'short');
assert.equal(chooseCustomerPayment(12300, () => 0.5).kind, 'exact');
assert.equal(chooseCustomerPayment(12300, () => 0.9).kind, 'change');
assert.deepEqual(getSettlement(1000, 1000), { kind: 'exact', amountPaise: 0 });
assert.deepEqual(getSettlement(1000, 800), { kind: 'short', amountPaise: 200 });
assert.deepEqual(getSettlement(1000, 1500), { kind: 'change', amountPaise: 500 });
assert.equal(changeDue(12300, 15000), 2700);
assert.equal(parseMoney('12.50'), 1250);
assert.equal(formatMoney(1250), '₹12.50');
console.log('Little Shop cashier tests passed: 1,000 customer orders, exact basket matching, and short/exact/change payment paths.');
