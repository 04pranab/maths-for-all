const MAX = Number.MAX_SAFE_INTEGER;

function assertNonNegativePaise(value, label = 'amount') {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(label + ' must be a non-negative safe integer number of paise.');
  }
  return value;
}

function assertQuantity(value) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new TypeError('quantity must be a positive safe integer.');
  }
  return value;
}

export function parseMoney(input) {
  if (typeof input !== 'string') throw new TypeError('Money input must be a string.');
  const value = input.trim();
  const match = value.match(/^(?:₹\s*)?(\d+|\d{1,3}(?:,\d{3})+)(?:\.(\d{1,2}))?$/);
  if (!match) throw new TypeError('Enter a valid non-negative amount with at most two decimal places.');
  const rupees = Number(match[1].replaceAll(',', ''));
  const paise = Number((match[2] || '').padEnd(2, '0') || '0');
  const amount = rupees * 100 + paise;
  if (!Number.isSafeInteger(amount) || amount < 0 || amount > MAX) {
    throw new RangeError('Money amount is outside the supported range.');
  }
  return amount;
}

export function formatMoney(amountPaise) {
  assertNonNegativePaise(amountPaise);
  const rupees = Math.floor(amountPaise / 100);
  const paise = amountPaise % 100;
  return paise === 0 ? '₹' + rupees : '₹' + rupees + '.' + String(paise).padStart(2, '0');
}

export function addMoney(amounts) {
  if (!Array.isArray(amounts)) throw new TypeError('Amounts must be provided as an array.');
  return amounts.reduce((sum, value) => {
    assertNonNegativePaise(value);
    const result = sum + value;
    if (!Number.isSafeInteger(result)) throw new RangeError('Money total exceeds the supported range.');
    return result;
  }, 0);
}

export function multiplyMoney(pricePaise, quantity) {
  assertNonNegativePaise(pricePaise, 'price');
  assertQuantity(quantity);
  const result = pricePaise * quantity;
  if (!Number.isSafeInteger(result)) throw new RangeError('Line total exceeds the supported range.');
  return result;
}

export function totalBasket(lines) {
  if (!Array.isArray(lines)) throw new TypeError('Basket lines must be an array.');
  return addMoney(lines.map(line => {
    if (!line || typeof line !== 'object') throw new TypeError('Each basket line must be an object.');
    return multiplyMoney(line.pricePaise, line.quantity);
  }));
}

export function withinBudget(totalPaise, budgetPaise) {
  assertNonNegativePaise(totalPaise, 'total');
  assertNonNegativePaise(budgetPaise, 'budget');
  return totalPaise <= budgetPaise;
}

export function changeDue(totalPaise, paymentPaise) {
  assertNonNegativePaise(totalPaise, 'total');
  assertNonNegativePaise(paymentPaise, 'payment');
  if (paymentPaise < totalPaise) throw new RangeError('Payment is not enough to cover the total.');
  return paymentPaise - totalPaise;
}

export function compareMoney(firstPaise, secondPaise) {
  assertNonNegativePaise(firstPaise, 'first amount');
  assertNonNegativePaise(secondPaise, 'second amount');
  return firstPaise < secondPaise ? -1 : firstPaise > secondPaise ? 1 : 0;
}
