import {
  formatMoney, totalBasket
} from './little-shop-money.mjs';

const CATALOGUE = [
  { id: 'notebook', name: 'Notebook', description: 'A place for ideas', icon: '📓', pricePaise: 1250 },
  { id: 'pencil', name: 'Pencil', description: 'For drawing and writing', icon: '✏️', pricePaise: 500 },
  { id: 'apple', name: 'Apple', description: 'A piece of fruit', icon: '🍎', pricePaise: 1500 },
  { id: 'cup', name: 'Cup', description: 'A cup for a drink', icon: '🥤', pricePaise: 2000 },
  { id: 'book', name: 'Storybook', description: 'A story to explore', icon: '📘', pricePaise: 3500 },
  { id: 'ruler', name: 'Ruler', description: 'Measure a line', icon: '📏', pricePaise: 800 }
];

const itemsById = new Map(CATALOGUE.map(item => [item.id, item]));
const basket = new Map();
let active = false;
let controller = null;

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
}

function handleClick(event) {
  const button = event.target.closest('[data-ls-action]');
  if (!button || !byId('ls-basket')?.contains(button) && !byId('ls-catalogue')?.contains(button)) return;
  const id = button.dataset.item;
  if (!itemsById.has(id)) return;
  const quantity = basket.get(id) || 0;
  switch (button.dataset.lsAction) {
    case 'add':
    case 'increase':
      basket.set(id, quantity + 1);
      setStatus(itemsById.get(id).name + ' added to your basket.');
      break;
    case 'decrease':
      if (quantity <= 1) basket.delete(id);
      else basket.set(id, quantity - 1);
      setStatus('Basket quantity updated.');
      break;
    case 'remove':
      basket.delete(id);
      setStatus(itemsById.get(id).name + ' removed from your basket.');
      break;
    default:
      return;
  }
  renderBasket();
}

function init() {
  active = true;
  if (controller) controller.abort();
  controller = new AbortController();
  byId('ls-catalogue')?.addEventListener('click', handleClick, { signal: controller.signal });
  byId('ls-basket')?.addEventListener('click', handleClick, { signal: controller.signal });
  byId('ls-clear')?.addEventListener('click', () => {
    basket.clear();
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

window.LittleShop = { init, stop, isActive, getCatalogue: () => CATALOGUE.map(item => ({ ...item })) };
