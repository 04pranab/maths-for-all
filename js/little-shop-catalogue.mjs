export const CATALOGUE = [
  { id: 'apple', name: 'Apple', icon: '🍎', unit: 'each', pricePaise: 800 },
  { id: 'banana', name: 'Banana', icon: '🍌', unit: 'each', pricePaise: 600 },
  { id: 'orange', name: 'Orange', icon: '🍊', unit: 'each', pricePaise: 700 },
  { id: 'mango', name: 'Mango', icon: '🥭', unit: 'each', pricePaise: 1500 },
  { id: 'grapes', name: 'Grapes', icon: '🍇', unit: 'bunch', pricePaise: 2500 },
  { id: 'watermelon', name: 'Watermelon', icon: '🍉', unit: 'each', pricePaise: 4000 },
  { id: 'papaya', name: 'Papaya', icon: '🍈', unit: 'each', pricePaise: 3000 },
  { id: 'pineapple', name: 'Pineapple', icon: '🍍', unit: 'each', pricePaise: 3500 },
  { id: 'guava', name: 'Guava', icon: '🍐', unit: 'each', pricePaise: 500 },
  { id: 'pomegranate', name: 'Pomegranate', icon: '🔴', unit: 'each', pricePaise: 1800 },
  { id: 'pear', name: 'Pear', icon: '🍐', unit: 'each', pricePaise: 1200 },
  { id: 'chikoo', name: 'Chikoo', icon: '🟤', unit: 'each', pricePaise: 500 },
  { id: 'coconut', name: 'Coconut', icon: '🥥', unit: 'each', pricePaise: 2500 },
  { id: 'lemon', name: 'Lemon', icon: '🍋', unit: 'each', pricePaise: 300 },
  { id: 'strawberry', name: 'Strawberries', icon: '🍓', unit: 'punnet', pricePaise: 4500 },
  { id: 'kiwi', name: 'Kiwi', icon: '🥝', unit: 'each', pricePaise: 2000 },
  { id: 'sweet-lime', name: 'Sweet lime', icon: '🍋', unit: 'each', pricePaise: 800 },
  { id: 'muskmelon', name: 'Muskmelon', icon: '🍈', unit: 'each', pricePaise: 2800 },
  { id: 'jackfruit', name: 'Jackfruit', icon: '🍈', unit: 'portion', pricePaise: 2000 },
  { id: 'dragon-fruit', name: 'Dragon fruit', icon: '🐉', unit: 'each', pricePaise: 5000 },
  { id: 'plum', name: 'Plum', icon: '🟣', unit: 'each', pricePaise: 900 },
  { id: 'peach', name: 'Peach', icon: '🍑', unit: 'each', pricePaise: 1400 }
];

const CUSTOMER_NAMES = ['A customer', 'A neighbour', 'A parent', 'A friend', 'A traveller', 'A regular'];

function randomIndex(random, length) {
  return Math.min(length - 1, Math.max(0, Math.floor(random() * length)));
}

export function createCustomerOrder(random = Math.random) {
  const available = [...CATALOGUE];
  const count = 2 + randomIndex(random, 3);
  const order = [];
  for (let index = 0; index < count; index++) {
    const item = available.splice(randomIndex(random, available.length), 1)[0];
    order.push({ id: item.id, quantity: 1 + randomIndex(random, 3) });
  }
  const customerIndex = randomIndex(random, CUSTOMER_NAMES.length);
  return {
    name: CUSTOMER_NAMES[customerIndex],
    items: order,
    numberOfLines: order.length
  };
}

export function orderTotalPaise(order, catalogue = CATALOGUE) {
  const byId = new Map(catalogue.map(item => [item.id, item]));
  return order.reduce((total, line) => {
    const item = byId.get(line.id);
    if (!item || !Number.isSafeInteger(line.quantity) || line.quantity < 1) {
      throw new TypeError('Customer order contains an invalid item or quantity.');
    }
    const lineTotal = item.pricePaise * line.quantity;
    if (!Number.isSafeInteger(lineTotal) || !Number.isSafeInteger(total + lineTotal)) {
      throw new RangeError('Customer order total is outside the supported range.');
    }
    return total + lineTotal;
  }, 0);
}

export function orderMatches(order, basket) {
  if (!Array.isArray(order) || !(basket instanceof Map)) return false;
  if (basket.size !== order.length) return false;
  return order.every(line => basket.get(line.id) === line.quantity);
}

export function chooseCustomerPayment(totalPaise, random = Math.random) {
  if (!Number.isSafeInteger(totalPaise) || totalPaise < 100) {
    throw new TypeError('Customer bill must be at least one rupee.');
  }
  const roll = random();
  if (roll < 1 / 3) {
    const maxShortRupees = Math.max(1, Math.min(20, Math.floor(totalPaise / 100) - 1));
    const shortBy = (1 + randomIndex(random, maxShortRupees)) * 100;
    return { kind: 'short', paidPaise: totalPaise - shortBy };
  }
  if (roll < 2 / 3) return { kind: 'exact', paidPaise: totalPaise };
  let paidPaise = Math.ceil(totalPaise / 5000) * 5000;
  if (paidPaise === totalPaise) paidPaise += 5000;
  return { kind: 'change', paidPaise };
}

export function getSettlement(totalPaise, paidPaise) {
  if (!Number.isSafeInteger(totalPaise) || totalPaise < 0 ||
      !Number.isSafeInteger(paidPaise) || paidPaise < 0) {
    throw new TypeError('Bill and payment must be non-negative amounts in paise.');
  }
  if (paidPaise < totalPaise) return { kind: 'short', amountPaise: totalPaise - paidPaise };
  if (paidPaise > totalPaise) return { kind: 'change', amountPaise: paidPaise - totalPaise };
  return { kind: 'exact', amountPaise: 0 };
}
