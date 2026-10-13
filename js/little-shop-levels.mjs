export const CATALOGUE = [
  { id: 'notebook', name: 'Notebook', description: 'A place for ideas', icon: '📓', pricePaise: 1200 },
  { id: 'pencil', name: 'Pencil', description: 'For drawing and writing', icon: '✏️', pricePaise: 500 },
  { id: 'apple', name: 'Apple', description: 'A piece of fruit', icon: '🍎', pricePaise: 1500 },
  { id: 'cup', name: 'Cup', description: 'A cup for a drink', icon: '🥤', pricePaise: 2000 },
  { id: 'book', name: 'Storybook', description: 'A story to explore', icon: '📘', pricePaise: 3500 },
  { id: 'ruler', name: 'Ruler', description: 'Measure a line', icon: '📏', pricePaise: 800 }
];

const STAGES = [
  { first: 1, last: 10, key: 'read-shelf', title: 'Read the Shelf', type: 'compare-price' },
  { first: 11, last: 20, key: 'one-item', title: 'One-Item Checkout', type: 'exact-payment' },
  { first: 21, last: 30, key: 'basket-basics', title: 'Basket Basics', type: 'basket-total' },
  { first: 31, last: 40, key: 'budget-basket', title: 'Budget Basket', type: 'budget-check' },
  { first: 41, last: 50, key: 'make-amount', title: 'Make the Amount', type: 'make-amount' },
  { first: 51, last: 60, key: 'change-counter', title: 'Change Counter', type: 'change' },
  { first: 61, last: 70, key: 'more-in-basket', title: 'More in the Basket', type: 'quantity-total' },
  { first: 71, last: 80, key: 'spend-thoughtfully', title: 'Spend Thoughtfully', type: 'budget-combination' },
  { first: 81, last: 90, key: 'rupees-paise', title: 'Rupees and Paise', type: 'paise-total' },
  { first: 91, last: 100, key: 'shopkeeper-challenge', title: "Shopkeeper's Challenge", type: 'multi-step' }
];

const PAISA_VALUES = [125, 250, 375, 450, 625, 750, 875, 1250, 2250];

function randomFor(seed) {
  let state = (Number(seed) >>> 0) || 1;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function integer(random, min, max) {
  return min + Math.floor(random() * (max - min + 1));
}

function pick(random, list) {
  return list[Math.floor(random() * list.length)];
}

function shuffled(random, list) {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index--) {
    const next = Math.floor(random() * (index + 1));
    [result[index], result[next]] = [result[next], result[index]];
  }
  return result;
}

function item(id) {
  return CATALOGUE.find(entry => entry.id === id);
}

function money(paise) {
  const rupees = Math.floor(paise / 100);
  const cents = paise % 100;
  return cents ? '₹' + rupees + '.' + String(cents).padStart(2, '0') : '₹' + rupees;
}

function amountChoices(random, answerPaise, offsets = [-500, -200, 200, 500, 800, 1000]) {
  const values = [answerPaise];
  for (const offset of shuffled(random, offsets)) {
    const value = answerPaise + offset;
    if (value >= 0 && value !== answerPaise && !values.includes(value)) values.push(value);
    if (values.length === 4) break;
  }
  while (values.length < 4) {
    const value = answerPaise + values.length * 300 + 100;
    if (!values.includes(value)) values.push(value);
  }
  return shuffled(random, values).map(value => ({ value: String(value), label: money(value), amountPaise: value }));
}

function baseTask(level, seed, prompt, answer, choices, explanation, hint, extra = {}) {
  const stage = getStageForLevel(level);
  return {
    id: 'little-shop-level-' + level,
    level,
    seed: Number(seed) >>> 0,
    stage: stage.key,
    stageTitle: stage.title,
    type: stage.type,
    prompt,
    answer: String(answer),
    choices,
    explanation,
    hint,
    ...extra
  };
}

function generateCompare(level, random, seed) {
  const first = pick(random, CATALOGUE);
  let second = pick(random, CATALOGUE);
  while (second.id === first.id || second.pricePaise === first.pricePaise) second = pick(random, CATALOGUE);
  const answer = first.pricePaise < second.pricePaise ? first.id : second.id;
  const choices = shuffled(random, [
    { value: first.id, label: first.name + ' · ' + money(first.pricePaise) },
    { value: second.id, label: second.name + ' · ' + money(second.pricePaise) }
  ]);
  return baseTask(level, seed, 'Which item costs less?', answer, choices,
    item(answer).name + ' costs less because its price is lower.', 'Compare the two prices, then choose the smaller amount.',
    { prices: [first.pricePaise, second.pricePaise] });
}

function generateExact(level, random, seed) {
  const selected = pick(random, CATALOGUE);
  const answer = selected.pricePaise;
  return baseTask(level, seed, 'Choose the exact amount that pays for one ' + selected.name + ' (' + money(answer) + ').',
    answer, amountChoices(random, answer, [-500, -200, 100, 200, 500, 1000]),
    'Exact payment is the same amount as the price: ' + money(answer) + '.',
    'Match the price label. Exact payment has no extra amount and no change.',
    { itemId: selected.id, pricePaise: answer });
}

function generateBasketTotal(level, random, seed) {
  const first = pick(random, CATALOGUE);
  let second = pick(random, CATALOGUE);
  while (second.id === first.id) second = pick(random, CATALOGUE);
  const total = first.pricePaise + second.pricePaise;
  return baseTask(level, seed, 'A ' + first.name + ' and a ' + second.name + ' go in the basket. What is the total?',
    total, amountChoices(random, total), 'Add both prices: ' + money(first.pricePaise) + ' + ' + money(second.pricePaise) + ' = ' + money(total) + '.',
    'Add the first price and the second price. You can count on from the larger amount.',
    { items: [{ id: first.id, quantity: 1 }, { id: second.id, quantity: 1 }], totalPaise: total });
}

function generateBudget(level, random, seed) {
  const first = pick(random, CATALOGUE);
  let second = pick(random, CATALOGUE);
  while (second.id === first.id) second = pick(random, CATALOGUE);
  const total = first.pricePaise + second.pricePaise;
  const fits = random() < 0.5;
  const budget = fits ? total + 1000 : Math.max(500, total - 1000);
  const answer = fits ? 'yes' : 'no';
  const choices = shuffled(random, [{ value: 'yes', label: 'Yes, it fits' }, { value: 'no', label: 'No, it is over budget' }]);
  const difference = Math.abs(budget - total);
  const explanation = fits
    ? 'The basket costs ' + money(total) + '. The budget is ' + money(budget) + ', so ' + money(difference) + ' remains.'
    : 'The basket costs ' + money(total) + ' but the budget is ' + money(budget) + '. It is over budget by ' + money(difference) + '.';
  return baseTask(level, seed, 'The basket has a ' + first.name + ' and a ' + second.name + '. The budget is ' + money(budget) + '. Does the basket fit?',
    answer, choices, explanation, 'Add the two prices first. Compare the total with the budget.',
    { items: [{ id: first.id, quantity: 1 }, { id: second.id, quantity: 1 }], totalPaise: total, budgetPaise: budget, fitsBudget: fits });
}

function formatCombination(denominations) {
  return denominations.map(money).join(' + ');
}

function greedyCombination(target) {
  let remaining = target;
  const result = [];
  for (const denomination of [2000, 1000, 500, 200, 100]) {
    while (remaining >= denomination) {
      result.push(denomination);
      remaining -= denomination;
    }
  }
  return result;
}

function generateMakeAmount(level, random, seed) {
  const target = (integer(random, 3, 13) * 500);
  const correct = greedyCombination(target);
  const candidates = [
    [1000, 200], [500, 200, 100], [1000, 100], [500, 100], [2000, 200], [1000, 500, 100]
  ].filter(values => values.reduce((sum, value) => sum + value, 0) !== target);
  const selected = shuffled(random, candidates).slice(0, 3);
  const options = [{ value: 'correct-combination', label: formatCombination(correct), amountPaise: correct.reduce((sum, value) => sum + value, 0) },
    ...selected.map((values, index) => ({ value: 'other-combination-' + index, label: formatCombination(values), amountPaise: values.reduce((sum, value) => sum + value, 0) }))];
  const choices = shuffled(random, options);
  return baseTask(level, seed, 'Which group of notes and coins totals ' + money(target) + '?',
    'correct-combination', choices, 'The selected group adds up to ' + money(target) + '.',
    'Add the value of each note or coin in one group, then compare it with the target.',
    { targetPaise: target });
}

function generateChange(level, random, seed) {
  const selected = pick(random, CATALOGUE);
  const total = selected.pricePaise;
  let payment = Math.ceil(total / 1000) * 1000;
  if (payment <= total) payment += 1000;
  const change = payment - total;
  return baseTask(level, seed, 'The ' + selected.name + ' costs ' + money(total) + '. A customer pays ' + money(payment) + '. How much change should they get?',
    change, amountChoices(random, change, [-300, -200, -100, 100, 200, 300]),
    'Change = payment − price, so ' + money(payment) + ' − ' + money(total) + ' = ' + money(change) + '.',
    'Subtract the price from the amount paid.',
    { itemId: selected.id, totalPaise: total, paymentPaise: payment, changePaise: change });
}

function generateQuantity(level, random, seed) {
  const first = pick(random, CATALOGUE);
  let second = pick(random, CATALOGUE);
  while (second.id === first.id) second = pick(random, CATALOGUE);
  const firstQuantity = integer(random, 2, 4);
  const secondQuantity = integer(random, 1, 3);
  const total = first.pricePaise * firstQuantity + second.pricePaise * secondQuantity;
  return baseTask(level, seed, 'A basket has ' + firstQuantity + ' ' + first.name + (firstQuantity > 1 ? 's' : '') + ' and ' + secondQuantity + ' ' + second.name + (secondQuantity > 1 ? 's' : '') + '. What is the total?',
    total, amountChoices(random, total), 'Multiply each price by its quantity, then add the line totals. The basket total is ' + money(total) + '.',
    'Find each line total first: price × quantity. Then add the two line totals.',
    { items: [{ id: first.id, quantity: firstQuantity }, { id: second.id, quantity: secondQuantity }], totalPaise: total });
}

function generateCombination(level, random, seed) {
  const notebook = item('notebook');
  const apple = item('apple');
  const book = item('book');
  const cup = item('cup');
  const pencil = item('pencil');
  const budget = 3000;
  const baskets = [
    { value: 'goal-basket', label: '1 notebook + 1 apple', items: [{ id: notebook.id, quantity: 1 }, { id: apple.id, quantity: 1 }] },
    { value: 'too-expensive', label: '1 notebook + 1 storybook', items: [{ id: notebook.id, quantity: 1 }, { id: book.id, quantity: 1 }] },
    { value: 'missing-notebook', label: '1 apple + 1 cup', items: [{ id: apple.id, quantity: 1 }, { id: cup.id, quantity: 1 }] },
    { value: 'missing-apple', label: '1 notebook + 1 pencil', items: [{ id: notebook.id, quantity: 1 }, { id: pencil.id, quantity: 1 }] }
  ].map(basket => ({
    ...basket,
    totalPaise: basket.items.reduce((sum, line) => sum + item(line.id).pricePaise * line.quantity, 0)
  }));
  const choices = shuffled(random, baskets.map(basket => ({
    value: basket.value,
    label: basket.label + ' · ' + money(basket.totalPaise),
    items: basket.items,
    totalPaise: basket.totalPaise
  })));
  return baseTask(level, seed, 'You need at least one notebook and one apple. Which basket meets both needs without spending more than ' + money(budget) + '?',
    'goal-basket', choices,
    'The notebook and apple together cost ' + money(notebook.pricePaise + apple.pricePaise) + ', within the ' + money(budget) + ' budget.',
    'Check both requirements: the basket needs a notebook, an apple, and a total no greater than the budget.',
    { budgetPaise: budget, requiredItems: ['notebook', 'apple'] });
}

function generatePaise(level, random, seed) {
  let first = pick(random, PAISA_VALUES);
  let second = pick(random, PAISA_VALUES);
  while (second === first) second = pick(random, PAISA_VALUES);
  const total = first + second;
  return baseTask(level, seed, 'Add ' + money(first) + ' and ' + money(second) + '. What is the total?',
    total, amountChoices(random, total, [-250, -125, 125, 250, 375, 500]),
    money(first) + ' + ' + money(second) + ' = ' + money(total) + '. Add the paise carefully.',
    'Add the amounts in paise. Remember that 100 paise make ₹1.',
    { amountsPaise: [first, second], totalPaise: total });
}

function generateMultiStep(level, random, seed) {
  const first = pick(random, CATALOGUE);
  let second = pick(random, CATALOGUE);
  while (second.id === first.id) second = pick(random, CATALOGUE);
  const total = first.pricePaise + second.pricePaise;
  let payment = Math.ceil(total / 1000) * 1000;
  if (payment <= total) payment += 1000;
  const change = payment - total;
  return baseTask(level, seed, 'A ' + first.name + ' and a ' + second.name + ' cost ' + money(first.pricePaise) + ' and ' + money(second.pricePaise) + '. If you pay ' + money(payment) + ', how much change is left?',
    change, amountChoices(random, change, [-300, -200, -100, 100, 200, 300]),
    'First add the prices to get ' + money(total) + '. Then subtract from the payment: ' + money(payment) + ' − ' + money(total) + ' = ' + money(change) + '.',
    'Step 1: add both prices. Step 2: subtract that total from the payment.',
    { items: [{ id: first.id, quantity: 1 }, { id: second.id, quantity: 1 }], totalPaise: total, paymentPaise: payment, changePaise: change });
}

export function getStageForLevel(level) {
  if (!Number.isInteger(level) || level < 1 || level > 100) throw new RangeError('Level must be an integer from 1 to 100.');
  return STAGES.find(stage => level >= stage.first && level <= stage.last);
}

export function generateLevel(level, seed = level) {
  const stage = getStageForLevel(level);
  const random = randomFor(seed);
  switch (stage.type) {
    case 'compare-price': return generateCompare(level, random, seed);
    case 'exact-payment': return generateExact(level, random, seed);
    case 'basket-total': return generateBasketTotal(level, random, seed);
    case 'budget-check': return generateBudget(level, random, seed);
    case 'make-amount': return generateMakeAmount(level, random, seed);
    case 'change': return generateChange(level, random, seed);
    case 'quantity-total': return generateQuantity(level, random, seed);
    case 'budget-combination': return generateCombination(level, random, seed);
    case 'paise-total': return generatePaise(level, random, seed);
    case 'multi-step': return generateMultiStep(level, random, seed);
    default: throw new Error('Unsupported Little Shop task type: ' + stage.type);
  }
}

export function validateLevel(task) {
  if (!task || typeof task !== 'object') return false;
  let stage;
  try { stage = getStageForLevel(task.level); } catch { return false; }
  if (task.stage !== stage.key || task.type !== stage.type || !Array.isArray(task.choices)) return false;
  const expectedChoiceCount = task.type === 'compare-price' || task.type === 'budget-check' ? 2 : 4;
  if (task.choices.length !== expectedChoiceCount) return false;
  const values = task.choices.map(choice => choice.value);
  if (values.some(value => value === undefined || value === null) || new Set(values.map(String)).size !== values.length) return false;
  if (!values.some(value => String(value) === String(task.answer))) return false;
  if (task.type === 'make-amount') {
    if (!Number.isSafeInteger(task.targetPaise) || task.targetPaise <= 0) return false;
    if (task.choices.filter(choice => choice.amountPaise === task.targetPaise).length !== 1) return false;
  }
  if (task.type === 'budget-check') {
    if (!Number.isSafeInteger(task.totalPaise) || !Number.isSafeInteger(task.budgetPaise)) return false;
    if (String(task.answer) !== (task.totalPaise <= task.budgetPaise ? 'yes' : 'no')) return false;
  }
  if (task.type === 'budget-combination') {
    const valid = task.choices.filter(choice => {
      const ids = choice.items.map(line => line.id);
      return ids.includes('notebook') && ids.includes('apple') && choice.totalPaise <= task.budgetPaise;
    });
    if (valid.length !== 1 || valid[0].value !== task.answer) return false;
  }
  return true;
}

export function getStageList() {
  return STAGES.map(stage => ({ ...stage }));
}
