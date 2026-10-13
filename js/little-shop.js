import {
  changeDue, formatMoney, totalBasket
} from './little-shop-money.mjs';
import { CATALOGUE, generateLevel, validateLevel } from './little-shop-levels.mjs';


const itemsById = new Map(CATALOGUE.map(item => [item.id, item]));
const basket = new Map();
let active = false;
let controller = null;
let checkoutMode = null;
let checkoutAnswered = false;
let checkoutCorrect = null;
let checkoutHintShown = false;
let currentLevel = 1;
let currentTask = null;
let levelAnswered = false;
let levelHintShown = false;
const completedLevels = new Set();

function byId(id) {
  return document.getElementById(id);
}

function setStatus(message) {
  const status = byId('ls-status');
  if (status) status.textContent = message;
}

function basketLines() {
  return [...basket.entries()].map(([id, quantity]) => ({
    item: itemsById.get(id),
    pricePaise: itemsById.get(id).pricePaise,
    quantity
  }));
}

function renderCatalogue() {
  const root = byId('ls-catalogue');
  if (!root) return;
  root.innerHTML = CATALOGUE.map(item => {
    const quantity = basket.get(item.id) || 0;
    return '<article class="ls-item-card">' +
      '<span class="ls-item-icon" aria-hidden="true">' + item.icon + '</span>' +
      '<div class="ls-item-copy"><h3>' + item.name + '</h3><p>' + item.description + '</p>' +
      '<strong class="ls-price">' + formatMoney(item.pricePaise) + '</strong></div>' +
      '<button type="button" class="ls-add" data-ls-action="add" data-item="' + item.id + '" aria-label="Add ' + item.name + ' to basket">Add</button>' +
      (quantity ? '<span class="ls-on-shelf">' + quantity + ' in basket</span>' : '') +
      '</article>';
  }).join('');
}

function resetCheckout() {
  checkoutMode = null;
  checkoutAnswered = false;
  checkoutCorrect = null;
  checkoutHintShown = false;
  const panel = byId('ls-checkout-panel');
  if (panel) panel.hidden = true;
  const content = byId('ls-checkout-content');
  if (content) content.innerHTML = '';
  const feedback = byId('ls-checkout-feedback');
  if (feedback) feedback.textContent = '';
}

function renderBasket() {
  const root = byId('ls-basket');
  const total = byId('ls-total');
  if (!root || !total) return;
  const lines = basketLines();
  root.innerHTML = lines.length ? lines.map(({ item, quantity, pricePaise }) =>
    '<article class="ls-basket-line" data-basket-item="' + item.id + '">' +
      '<div class="ls-basket-line-main"><strong>' + item.name + '</strong><span>' + formatMoney(pricePaise) + ' each</span></div>' +
      '<div class="ls-quantity" aria-label="' + item.name + ' quantity">' +
        '<button type="button" data-ls-action="decrease" data-item="' + item.id + '" aria-label="Remove one ' + item.name + '">−</button>' +
        '<output aria-label="Quantity">' + quantity + '</output>' +
        '<button type="button" data-ls-action="increase" data-item="' + item.id + '" aria-label="Add one ' + item.name + '">+</button>' +
      '</div>' +
      '<strong class="ls-line-total">' + formatMoney(pricePaise * quantity) + '</strong>' +
      '<button type="button" class="ls-remove" data-ls-action="remove" data-item="' + item.id + '">Remove</button>' +
    '</article>'
  ).join('') : '<p class="ls-empty" id="ls-empty">Your basket is empty. Add an item from the shelf to begin.</p>';
  total.textContent = formatMoney(totalBasket(lines));
  renderCatalogue();
  const clear = byId('ls-clear');
  if (clear) clear.disabled = lines.length === 0;
  const checkout = byId('ls-checkout-start');
  if (checkout) checkout.disabled = lines.length === 0;
}

function renderLevelMap() {
  const root = byId('ls-level-map');
  if (!root) return;
  root.innerHTML = Array.from({ length: 100 }, (_, index) => {
    const level = index + 1;
    const selected = level === currentLevel;
    const complete = completedLevels.has(level);
    return '<button type="button" class="ls-level-button' + (selected ? ' is-current' : '') + (complete ? ' is-complete' : '') + '" data-ls-action="level" data-level="' + level + '" aria-label="Level ' + level + (complete ? ', completed' : '') + '"' + (selected ? ' aria-current="step"' : '') + '>' + level + '</button>';
  }).join('');
}

function renderChallenge() {
  const stage = byId('ls-level-stage');
  const prompt = byId('ls-level-prompt');
  const choicesRoot = byId('ls-level-choices');
  const feedback = byId('ls-level-feedback');
  const next = byId('screen-little-shop')?.querySelector('[data-ls-action="next-level"]');
  if (!currentTask || !choicesRoot || !prompt) return;
  if (stage) stage.textContent = 'Level ' + currentLevel + ' of 100 · ' + currentTask.stageTitle;
  prompt.textContent = currentTask.prompt;
  choicesRoot.innerHTML = currentTask.choices.map(choice =>
    '<button type="button" class="ls-level-choice" data-ls-action="level-answer" data-answer="' + choice.value + '"' + (levelAnswered ? ' disabled' : '') + '>' + choice.label + '</button>'
  ).join('');
  if (feedback && !levelHintShown && !levelAnswered) feedback.textContent = '';
  if (next) {
    next.disabled = !levelAnswered || currentLevel === 100;
    next.textContent = currentLevel === 100 ? 'You reached level 100' : 'Next level →';
  }
  renderLevelMap();
}

function selectLevel(level) {
  currentLevel = level;
  currentTask = generateLevel(level, level);
  if (!validateLevel(currentTask)) throw new Error('Invalid Little Shop task generated for level ' + level + '.');
  levelAnswered = false;
  levelHintShown = false;
  renderChallenge();
}

function handleClick(event) {
  const button = event.target.closest('[data-ls-action]');
  if (!button || !byId('screen-little-shop')?.contains(button)) return;
  const action = button.dataset.lsAction;
  if (action === 'level') {
    const level = Number(button.dataset.level);
    if (Number.isInteger(level) && level >= 1 && level <= 100) selectLevel(level);
    return;
  }
  if (action === 'level-hint') {
    levelHintShown = true;
    const feedback = byId('ls-level-feedback');
    if (feedback) feedback.textContent = currentTask?.hint || 'Look at the amounts and think about what the question asks.';
    return;
  }
  if (action === 'next-level') {
    if (levelAnswered && currentLevel < 100) selectLevel(currentLevel + 1);
    return;
  }
  if (action === 'level-answer') {
    if (!currentTask || levelAnswered) return;
    const answer = button.dataset.answer;
    const feedback = byId('ls-level-feedback');
    if (String(answer) === String(currentTask.answer)) {
      levelAnswered = true;
      completedLevels.add(currentLevel);
      if (feedback) feedback.textContent = 'Correct. ' + currentTask.explanation;
      byId('ls-level-choices')?.querySelectorAll('button').forEach(choice => { choice.disabled = true; });
      renderLevelMap();
      const next = byId('screen-little-shop')?.querySelector('[data-ls-action="next-level"]');
      if (next) next.disabled = currentLevel === 100;
    } else if (feedback) {
      feedback.textContent = 'Not quite. Try again, or use a hint. The answer is not revealed yet.';
    }
    return;
  }
  if (action === 'checkout') {
    if (!basket.size) return;
    const panel = byId('ls-checkout-panel');
    if (panel) panel.hidden = false;
    checkoutMode = null;
    checkoutAnswered = false;
    checkoutCorrect = null;
    checkoutHintShown = false;
    renderCheckout();
    return;
  }
  if (action === 'exact' || action === 'change') {
    checkoutMode = action;
    checkoutAnswered = false;
    checkoutCorrect = null;
    checkoutHintShown = false;
    renderCheckout();
    return;
  }
  if (action === 'checkout-again') {
    checkoutMode = null;
    checkoutAnswered = false;
    checkoutCorrect = null;
    checkoutHintShown = false;
    renderCheckout();
    return;
  }
  if (action === 'hint') {
    checkoutHintShown = true;
    const feedback = byId('ls-checkout-feedback');
    if (feedback) feedback.textContent = checkoutMode === 'change' ? 'Hint: change = payment − basket total.' : 'Hint: exact payment matches the basket total with no extra amount.';
    return;
  }
  if (action === 'answer') {
    if (checkoutAnswered || checkoutCorrect === null) return;
    const answer = Number(button.dataset.answer);
    const feedback = byId('ls-checkout-feedback');
    if (answer === checkoutCorrect) {
      checkoutAnswered = true;
      if (feedback) feedback.textContent = checkoutMode === 'change'
        ? 'Correct. Payment minus the basket total gives ' + formatMoney(checkoutCorrect) + ' in change.'
        : 'Correct. Exact payment matches the basket total: ' + formatMoney(checkoutCorrect) + '.';
      byId('ls-checkout-content')?.querySelectorAll('[data-ls-action="answer"]').forEach(choice => { choice.disabled = true; });
    } else if (feedback) {
      feedback.textContent = 'Not quite. Try again, or use a hint. The answer is not revealed yet.';
    }
    return;
  }
  const id = button.dataset.item;
  if (!itemsById.has(id)) return;
  const quantity = basket.get(id) || 0;
  switch (action) {
    case 'add':
    case 'increase':
      basket.set(id, quantity + 1);
      setStatus(itemsById.get(id).name + ' added to your basket.');
      resetCheckout();
      break;
    case 'decrease':
      if (quantity <= 1) basket.delete(id);
      else basket.set(id, quantity - 1);
      setStatus('Basket quantity updated.');
      resetCheckout();
      break;
    case 'remove':
      basket.delete(id);
      setStatus(itemsById.get(id).name + ' removed from your basket.');
      resetCheckout();
      break;
    default:
      return;
  }
  renderBasket();
}

function renderCheckout() {
  const root = byId('ls-checkout-content');
  const feedback = byId('ls-checkout-feedback');
  if (!root) return;
  if (feedback) feedback.textContent = '';
  if (!checkoutMode) {
    root.innerHTML = '<p>Choose what to practise. You can retry whenever you need.</p>' +
      '<div class="ls-checkout-modes">' +
      '<button type="button" data-ls-action="exact">Pay the exact amount</button>' +
      '<button type="button" data-ls-action="change">Work out the change</button>' +
      '</div>';
    return;
  }
  const total = totalBasket(basketLines());
  let payment = total;
  let correct = total;
  let choices;
  let question;
  if (checkoutMode === 'exact') {
    choices = [...new Set([total, total + 100, total + 500, total + 1000])];
    question = 'Choose the exact amount that pays for this basket (' + formatMoney(total) + ').';
  } else {
    payment = Math.ceil(total / 1000) * 1000;
    if (payment <= total) payment = total + 1000;
    correct = changeDue(total, payment);
    choices = [...new Set([Math.max(0, correct - 100), correct, correct + 100, correct + 200])];
    question = 'The basket costs ' + formatMoney(total) + '. A customer pays ' + formatMoney(payment) + '. How much change should they get?';
  }
  checkoutCorrect = correct;
  const displayChoices = [...choices].sort((a, b) => a - b);
  root.innerHTML = '<p class="ls-checkout-question">' + question + '</p>' +
    '<div class="ls-checkout-choices">' + displayChoices.map(value =>
      '<button type="button" data-ls-action="answer" data-answer="' + value + '"' + (checkoutAnswered ? ' disabled' : '') + '>' + formatMoney(value) + '</button>'
    ).join('') + '</div>' +
    '<div class="ls-checkout-actions"><button type="button" data-ls-action="hint" class="ls-secondary">Hint</button>' +
    '<button type="button" data-ls-action="checkout-again" class="ls-secondary">Choose another practice</button></div>';
}

function init() {
  active = true;
  selectLevel(currentLevel);
  if (controller) controller.abort();
  controller = new AbortController();
  byId('screen-little-shop')?.addEventListener('click', handleClick, { signal: controller.signal });
  byId('ls-clear')?.addEventListener('click', () => {
    basket.clear();
    resetCheckout();
    renderBasket();
    setStatus('Basket emptied. You can start again whenever you are ready.');
  }, { signal: controller.signal });
  renderBasket();
  setStatus('Choose an item to begin. Take your time.');
}

function stop() {
  active = false;
  if (controller) controller.abort();
  controller = null;
}

function isActive() {
  return active;
}

window.LittleShop = { init, stop, isActive, getCatalogue: () => CATALOGUE.map(item => ({ ...item })), getCurrentTask: () => currentTask ? JSON.parse(JSON.stringify(currentTask)) : null, getCompletedLevels: () => [...completedLevels] };
