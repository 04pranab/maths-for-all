/* Little Shop: one browser asset with independently testable pure helpers. */

const MAX = Number.MAX_SAFE_INTEGER;

function assertNonNegativePaise(value, label = "amount") {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(label + " must be a non-negative safe integer number of paise.");
  }
  return value;
}

function assertQuantity(value) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new TypeError("quantity must be a positive safe integer.");
  }
  return value;
}

function parseMoney(input) {
  if (typeof input !== "string") throw new TypeError("Money input must be a string.");
  const value = input.trim();
  const match = value.match(/^(?:₹\s*)?(\d+|\d{1,3}(?:,\d{3})+)(?:\.(\d{1,2}))?$/);
  if (!match)
    throw new TypeError("Enter a valid non-negative amount with at most two decimal places.");
  const rupees = Number(match[1].replaceAll(",", ""));
  const paise = Number((match[2] || "").padEnd(2, "0") || "0");
  const amount = rupees * 100 + paise;
  if (!Number.isSafeInteger(amount) || amount < 0 || amount > MAX) {
    throw new RangeError("Money amount is outside the supported range.");
  }
  return amount;
}

function formatMoney(amountPaise) {
  assertNonNegativePaise(amountPaise);
  const rupees = Math.floor(amountPaise / 100);
  const paise = amountPaise % 100;
  return paise === 0 ? "₹" + rupees : "₹" + rupees + "." + String(paise).padStart(2, "0");
}

function addMoney(amounts) {
  if (!Array.isArray(amounts)) throw new TypeError("Amounts must be provided as an array.");
  return amounts.reduce((sum, value) => {
    assertNonNegativePaise(value);
    const result = sum + value;
    if (!Number.isSafeInteger(result))
      throw new RangeError("Money total exceeds the supported range.");
    return result;
  }, 0);
}

function multiplyMoney(pricePaise, quantity) {
  assertNonNegativePaise(pricePaise, "price");
  assertQuantity(quantity);
  const result = pricePaise * quantity;
  if (!Number.isSafeInteger(result))
    throw new RangeError("Line total exceeds the supported range.");
  return result;
}

function totalBasket(lines) {
  if (!Array.isArray(lines)) throw new TypeError("Basket lines must be an array.");
  return addMoney(
    lines.map((line) => {
      if (!line || typeof line !== "object")
        throw new TypeError("Each basket line must be an object.");
      return multiplyMoney(line.pricePaise, line.quantity);
    }),
  );
}

function withinBudget(totalPaise, budgetPaise) {
  assertNonNegativePaise(totalPaise, "total");
  assertNonNegativePaise(budgetPaise, "budget");
  return totalPaise <= budgetPaise;
}

function changeDue(totalPaise, paymentPaise) {
  assertNonNegativePaise(totalPaise, "total");
  assertNonNegativePaise(paymentPaise, "payment");
  if (paymentPaise < totalPaise) throw new RangeError("Payment is not enough to cover the total.");
  return paymentPaise - totalPaise;
}

function compareMoney(firstPaise, secondPaise) {
  assertNonNegativePaise(firstPaise, "first amount");
  assertNonNegativePaise(secondPaise, "second amount");
  return firstPaise < secondPaise ? -1 : firstPaise > secondPaise ? 1 : 0;
}


/* Catalogue and deterministic customer/payment logic. */
const CATALOGUE = [
  { id: "apple", name: "Apple", icon: "🍎", unit: "each", pricePaise: 800 },
  { id: "banana", name: "Banana", icon: "🍌", unit: "each", pricePaise: 600 },
  { id: "orange", name: "Orange", icon: "🍊", unit: "each", pricePaise: 700 },
  { id: "mango", name: "Mango", icon: "🥭", unit: "each", pricePaise: 1500 },
  { id: "grapes", name: "Grapes", icon: "🍇", unit: "bunch", pricePaise: 2500 },
  { id: "watermelon", name: "Watermelon", icon: "🍉", unit: "each", pricePaise: 4000 },
  { id: "papaya", name: "Papaya", icon: "🧡", unit: "each", pricePaise: 3000 },
  { id: "pineapple", name: "Pineapple", icon: "🍍", unit: "each", pricePaise: 3500 },
  { id: "guava", name: "Guava", icon: "🟢", unit: "each", pricePaise: 500 },
  { id: "pomegranate", name: "Pomegranate", icon: "🔴", unit: "each", pricePaise: 1800 },
  { id: "pear", name: "Pear", icon: "🍐", unit: "each", pricePaise: 1200 },
  { id: "chikoo", name: "Chikoo", icon: "🟤", unit: "each", pricePaise: 500 },
  { id: "coconut", name: "Coconut", icon: "🥥", unit: "each", pricePaise: 2500 },
  { id: "lemon", name: "Lemon", icon: "🍋", unit: "each", pricePaise: 300 },
  { id: "strawberry", name: "Strawberries", icon: "🍓", unit: "punnet", pricePaise: 4500 },
  { id: "kiwi", name: "Kiwi", icon: "🥝", unit: "each", pricePaise: 2000 },
  { id: "sweet-lime", name: "Sweet lime", icon: "🍋", unit: "each", pricePaise: 800 },
  { id: "muskmelon", name: "Muskmelon", icon: "🍈", unit: "each", pricePaise: 2800 },
  { id: "jackfruit", name: "Jackfruit", icon: "🌳", unit: "portion", pricePaise: 2000 },
  { id: "dragon-fruit", name: "Dragon fruit", icon: "🐉", unit: "each", pricePaise: 5000 },
  { id: "plum", name: "Plum", icon: "🟣", unit: "each", pricePaise: 900 },
  { id: "peach", name: "Peach", icon: "🍑", unit: "each", pricePaise: 1400 },
];

const CUSTOMER_NAMES = [
  "A customer",
  "A neighbour",
  "A parent",
  "A friend",
  "A traveller",
  "A regular",
];

function randomIndex(random, length) {
  return Math.min(length - 1, Math.max(0, Math.floor(random() * length)));
}

function createCustomerOrder(random = Math.random) {
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
    numberOfLines: order.length,
  };
}

function orderTotalPaise(order, catalogue = CATALOGUE) {
  const byId = new Map(catalogue.map((item) => [item.id, item]));
  return order.reduce((total, line) => {
    const item = byId.get(line.id);
    if (!item || !Number.isSafeInteger(line.quantity) || line.quantity < 1) {
      throw new TypeError("Customer order contains an invalid item or quantity.");
    }
    const lineTotal = item.pricePaise * line.quantity;
    if (!Number.isSafeInteger(lineTotal) || !Number.isSafeInteger(total + lineTotal)) {
      throw new RangeError("Customer order total is outside the supported range.");
    }
    return total + lineTotal;
  }, 0);
}

function orderMatches(order, basket) {
  if (!Array.isArray(order) || !(basket instanceof Map)) return false;
  if (basket.size !== order.length) return false;
  return order.every((line) => basket.get(line.id) === line.quantity);
}

function chooseCustomerPayment(totalPaise, random = Math.random) {
  if (!Number.isSafeInteger(totalPaise) || totalPaise < 100) {
    throw new TypeError("Customer bill must be at least one rupee.");
  }
  const roll = random();
  if (roll < 1 / 3) {
    const maxShortRupees = Math.max(1, Math.min(20, Math.floor(totalPaise / 100) - 1));
    const shortBy = (1 + randomIndex(random, maxShortRupees)) * 100;
    return { kind: "short", paidPaise: totalPaise - shortBy };
  }
  if (roll < 2 / 3) return { kind: "exact", paidPaise: totalPaise };
  let paidPaise = Math.ceil(totalPaise / 5000) * 5000;
  if (paidPaise === totalPaise) paidPaise += 5000;
  return { kind: "change", paidPaise };
}

function getSettlement(totalPaise, paidPaise) {
  if (
    !Number.isSafeInteger(totalPaise) ||
    totalPaise < 0 ||
    !Number.isSafeInteger(paidPaise) ||
    paidPaise < 0
  ) {
    throw new TypeError("Bill and payment must be non-negative amounts in paise.");
  }
  if (paidPaise < totalPaise) return { kind: "short", amountPaise: totalPaise - paidPaise };
  if (paidPaise > totalPaise) return { kind: "change", amountPaise: paidPaise - totalPaise };
  return { kind: "exact", amountPaise: 0 };
}


/* Browser interaction layer. */
const itemsById = new Map(CATALOGUE.map((item) => [item.id, item]));
const DENOMINATIONS = [5000, 2000, 1000, 500, 200, 100];
const basket = new Map();
let active = false;
let controller = null;
let customerNumber = 1;
let customer = null;
let phase = "shopping";
let billTotalPaise = 0;
let paymentPaise = 0;
let additionalPaymentPaise = 0;
let settlementKind = null;
let settlementAmountPaise = 0;
let changePieces = [];

function byId(id) {
  return document.getElementById(id);
}

function setStatus(message) {
  const status = byId("ls-status");
  if (status) status.textContent = message;
}

function basketLines() {
  return [...basket.entries()].map(([id, quantity]) => ({
    item: itemsById.get(id),
    pricePaise: itemsById.get(id).pricePaise,
    quantity,
  }));
}

function basketTotalPaise() {
  return totalBasket(basketLines());
}

function basketMatchesCustomer() {
  return customer && orderMatches(customer.items, basket);
}

function renderCustomer() {
  if (!customer) return;
  const number = byId("ls-customer-number");
  const request = byId("ls-customer-request");
  const order = byId("ls-customer-order");
  const heading = byId("ls-customer-heading");
  if (number) number.textContent = "CUSTOMER " + customerNumber;
  if (heading) heading.textContent = customer.name + " is at the counter";
  if (request) request.textContent = "“Hello! Could I have these fruits, please?”";
  if (order) {
    order.innerHTML = customer.items
      .map((line) => {
        const item = itemsById.get(line.id);
        return (
          '<li><span aria-hidden="true">' +
          item.icon +
          "</span> <strong>" +
          item.name +
          "</strong> <span>× " +
          line.quantity +
          " " +
          (line.quantity === 1 ? item.unit : unitForQuantity(item)) +
          "</span></li>"
        );
      })
      .join("");
  }
}

function unitForQuantity(item) {
  return item.unit === "each"
    ? "pieces"
    : item.unit === "bunch"
      ? "bunches"
      : item.unit === "punnet"
        ? "punnets"
        : "portions";
}

function renderCatalogue() {
  const root = byId("ls-catalogue");
  if (!root) return;
  root.innerHTML = CATALOGUE.map((item) => {
    const quantity = basket.get(item.id) || 0;
    const requested = customer?.items.find((line) => line.id === item.id)?.quantity || 0;
    return (
      '<article class="ls-item-card' +
      (requested ? " is-requested" : "") +
      '">' +
      '<span class="ls-item-icon" aria-hidden="true">' +
      item.icon +
      "</span>" +
      '<div class="ls-item-copy"><h3>' +
      item.name +
      "</h3><p>" +
      formatMoney(item.pricePaise) +
      " / " +
      item.unit +
      "</p>" +
      (requested
        ? '<span class="ls-requested-badge">Customer asked for ' + requested + "</span>"
        : "") +
      "</div>" +
      '<button type="button" class="ls-add" data-ls-action="add" data-item="' +
      item.id +
      '" aria-label="Add one ' +
      item.name +
      '"' +
      (phase !== "shopping" ? " disabled" : "") +
      ">Add 1</button>" +
      (quantity ? '<span class="ls-on-shelf">' + quantity + " in basket</span>" : "") +
      "</article>"
    );
  }).join("");
}

function renderBasket() {
  const root = byId("ls-basket");
  const total = byId("ls-total");
  if (!root || !total) return;
  const lines = basketLines();
  root.innerHTML = lines.length
    ? lines
        .map(
          ({ item, quantity, pricePaise }) =>
            '<article class="ls-basket-line" data-basket-item="' +
            item.id +
            '">' +
            '<div class="ls-basket-line-main"><strong>' +
            item.name +
            "</strong><span>" +
            formatMoney(pricePaise) +
            " / " +
            item.unit +
            "</span></div>" +
            '<div class="ls-quantity" aria-label="' +
            item.name +
            ' quantity">' +
            '<button type="button" data-ls-action="decrease" data-item="' +
            item.id +
            '" aria-label="Remove one ' +
            item.name +
            '"' +
            (phase !== "shopping" ? " disabled" : "") +
            ">−</button>" +
            '<output aria-label="' +
            item.name +
            ' quantity">' +
            quantity +
            "</output>" +
            '<button type="button" data-ls-action="increase" data-item="' +
            item.id +
            '" aria-label="Add one ' +
            item.name +
            '"' +
            (phase !== "shopping" ? " disabled" : "") +
            ">+</button>" +
            "</div>" +
            '<strong class="ls-line-total">' +
            formatMoney(pricePaise * quantity) +
            "</strong>" +
            '<button type="button" class="ls-remove" data-ls-action="remove" data-item="' +
            item.id +
            '"' +
            (phase !== "shopping" ? " disabled" : "") +
            ">Remove</button>" +
            "</article>",
        )
        .join("")
    : '<p class="ls-empty" id="ls-empty">The basket is empty. Add the fruits your customer asked for.</p>';
  total.textContent = formatMoney(basketTotalPaise());
  const clear = byId("ls-clear");
  if (clear) clear.disabled = phase !== "shopping" || lines.length === 0;
  const bill = byId("ls-checkout-start");
  if (phase === "shopping") {
    if (!lines.length) setStatus("Add the fruits the customer asked for to begin.");
    else if (basketMatchesCustomer())
      setStatus("The basket matches the order. You can make the bill.");
    else
      setStatus(
        "Keep adding, removing, or adjusting fruit until the basket matches the customer’s order.",
      );
  }
  if (bill) {
    bill.disabled = phase !== "shopping" || !basketMatchesCustomer();
    bill.textContent = basketMatchesCustomer() ? "Make the bill" : "Match the customer’s order";
  }
  renderCatalogue();
}

function renderChangeDrawer() {
  const drawer = byId("ls-cash-drawer");
  if (!drawer) return;
  drawer.hidden = phase !== "change-drawer";
  const root = byId("ls-change-denominations");
  if (root) {
    root.innerHTML = DENOMINATIONS.map((value) => {
      const remaining = settlementAmountPaise - changeGivenPaise();
      return (
        '<button type="button" class="ls-denomination" data-ls-action="give-change" data-value="' +
        value +
        '"' +
        (phase !== "change-drawer" || value > remaining ? " disabled" : "") +
        ">" +
        formatMoney(value) +
        "</button>"
      );
    }).join("");
  }
  const total = byId("ls-change-given");
  if (total)
    total.textContent =
      formatMoney(changeGivenPaise()) + " / " + formatMoney(settlementAmountPaise);
  const finish = drawer.querySelector('[data-ls-action="finish-sale"]');
  if (finish) finish.disabled = changeGivenPaise() !== settlementAmountPaise;
  const feedback = byId("ls-change-feedback");
  if (feedback) {
    feedback.textContent =
      changeGivenPaise() === settlementAmountPaise
        ? "That is the exact change. Finish the sale when you are ready."
        : changeGivenPaise() > settlementAmountPaise
          ? "That is too much change. Undo a note or coin and try again."
          : "Choose notes and coins until the amount matches the change due.";
  }
}

function changeGivenPaise() {
  return changePieces.reduce((sum, value) => sum + value, 0);
}

function renderPayment() {
  const panel = byId("ls-checkout-panel");
  const sale = byId("ls-sale-complete");
  if (panel) panel.hidden = !["payment", "change-drawer", "ready"].includes(phase);
  if (sale) sale.hidden = phase !== "done";
  const bill = byId("ls-bill-total");
  const paid = byId("ls-customer-payment");
  if (bill) bill.textContent = formatMoney(billTotalPaise);
  if (paid) paid.textContent = formatMoney(paymentPaise);
  const prompt = byId("ls-payment-prompt");
  const action = byId("ls-payment-action");
  const feedback = byId("ls-checkout-feedback");
  if (feedback && phase === "payment") feedback.textContent = "";
  if (action) action.innerHTML = "";

  if (phase === "payment") {
    const settlement = getSettlement(billTotalPaise, paymentPaise);
    settlementKind = settlement.kind;
    settlementAmountPaise = settlement.amountPaise;
    if (settlement.kind === "short") {
      if (prompt)
        prompt.textContent =
          "The bill is " +
          formatMoney(billTotalPaise) +
          ", but the customer has given " +
          formatMoney(paymentPaise) +
          ". Ask them for the amount still owed.";
      if (action)
        action.innerHTML =
          '<button type="button" class="ls-primary" data-ls-action="ask-more">Ask how much more?</button>';
    } else if (settlement.kind === "exact") {
      if (prompt) prompt.textContent = "The customer has paid the exact bill. No change is needed.";
      if (action)
        action.innerHTML =
          '<button type="button" class="ls-primary" data-ls-action="finish-sale">Complete sale</button>';
    } else {
      if (prompt)
        prompt.textContent =
          "The bill is " +
          formatMoney(billTotalPaise) +
          ". The customer has given " +
          formatMoney(paymentPaise) +
          ". Work out how much change to return.";
      if (action)
        action.innerHTML =
          '<form class="ls-money-form" data-ls-form="change"><label for="ls-money-answer">How much change will you return?</label><div class="ls-money-input-row"><span>₹</span><input id="ls-money-answer" name="amount" type="text" inputmode="decimal" enterkeyhint="done" autocomplete="off" spellcheck="false" aria-describedby="ls-checkout-feedback" placeholder="Your answer" required><button type="submit" class="ls-primary">Check change</button></div></form>';
    }
  } else if (phase === "ready") {
    if (prompt)
      prompt.textContent =
        "You asked for " +
        formatMoney(additionalPaymentPaise) +
        " more. The customer paid it. " +
        formatMoney(paymentPaise) +
        " + " +
        formatMoney(additionalPaymentPaise) +
        " = " +
        formatMoney(billTotalPaise) +
        ". The bill is settled.";
    if (action)
      action.innerHTML =
        '<button type="button" class="ls-primary" data-ls-action="finish-sale">Complete sale</button>';
  } else if (phase === "change-drawer") {
    if (prompt)
      prompt.textContent =
        "Correct! Return " +
        formatMoney(settlementAmountPaise) +
        " to the customer using the notes and coins below.";
  }

  renderChangeDrawer();
  if (phase === "done") {
    if (sale) {
      const summary = byId("ls-sale-summary");
      if (summary) {
        const returned =
          settlementKind === "change"
            ? " You returned " + formatMoney(settlementAmountPaise) + " in change."
            : "";
        const asked =
          settlementKind === "short"
            ? " The customer paid the remaining amount you asked for."
            : "";
        summary.textContent =
          "Customer " +
          customerNumber +
          ": bill " +
          formatMoney(billTotalPaise) +
          ", paid " +
          formatMoney(billTotalPaise + (settlementKind === "change" ? settlementAmountPaise : 0)) +
          "." +
          returned +
          asked;
      }
    }
  }
}

function startNewCustomer(increment = true) {
  if (increment) customerNumber += 1;
  customer = createCustomerOrder();
  basket.clear();
  phase = "shopping";
  billTotalPaise = 0;
  paymentPaise = 0;
  additionalPaymentPaise = 0;
  settlementKind = null;
  settlementAmountPaise = 0;
  changePieces = [];
  const panel = byId("ls-checkout-panel");
  if (panel) panel.hidden = true;
  const sale = byId("ls-sale-complete");
  if (sale) sale.hidden = true;
  renderCustomer();
  renderBasket();
  renderPayment();
  setStatus("Customer " + customerNumber + " is waiting. Add exactly the fruits requested.");
}

function makeBill() {
  if (phase !== "shopping" || !basketMatchesCustomer()) return;
  billTotalPaise = basketTotalPaise();
  const payment = chooseCustomerPayment(billTotalPaise);
  paymentPaise = payment.paidPaise;
  additionalPaymentPaise = 0;
  settlementKind = payment.kind;
  settlementAmountPaise = Math.abs(billTotalPaise - paymentPaise);
  changePieces = [];
  phase = "payment";
  renderBasket();
  renderPayment();
  setStatus("The basket is billed. Check the money the customer handed over.");
  byId("ls-payment-prompt")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  const nextControl =
    byId("ls-money-answer") ||
    byId("ls-payment-action")?.querySelector("button");
  nextControl?.focus({ preventScroll: true });
}

function finishSale() {
  if (phase === "payment" && settlementKind === "exact") {
    phase = "done";
  } else if (phase === "ready" && settlementKind === "short") {
    phase = "done";
  } else if (phase === "change-drawer" && changeGivenPaise() === settlementAmountPaise) {
    phase = "done";
  } else {
    return;
  }
  renderBasket();
  renderPayment();
  setStatus("Sale complete. The counter is ready for the next customer.");
  byId("ls-sale-complete")?.querySelector('[data-ls-action="next-customer"]')?.focus();
}

function handleSubmit(event) {
  const form = event.target.closest("[data-ls-form]");
  if (!form || !byId("screen-little-shop")?.contains(form)) return;
  event.preventDefault();
  const feedback = byId("ls-checkout-feedback");
  const input = form.querySelector('input[name="amount"]');
  let answer;
  try {
    answer = parseMoney(input?.value || "");
  } catch {
    if (feedback) feedback.textContent = "Enter a valid money amount, such as 12 or 12.50.";
    input?.focus();
    return;
  }
  if (phase !== "payment") return;
  const settlement = getSettlement(billTotalPaise, paymentPaise);
  if (settlement.kind === "short") {
    if (answer !== settlement.amountPaise) {
      if (feedback)
        feedback.textContent =
          "Not quite. Work out the difference between the bill and the money already paid, then try again.";
      input?.select();
      return;
    }
    additionalPaymentPaise = answer;
    settlementKind = "short";
    settlementAmountPaise = settlement.amountPaise;
    phase = "ready";
    if (feedback)
      feedback.textContent =
        "Correct. You ask for " + formatMoney(answer) + " more, and the customer pays it.";
    renderPayment();
    if (feedback)
      feedback.textContent =
        "Correct. You ask for " + formatMoney(answer) + " more, and the customer pays it.";
    byId("ls-payment-action")?.querySelector("button")?.focus();
    return;
  }
  if (settlement.kind === "change") {
    if (answer !== settlement.amountPaise) {
      if (feedback)
        feedback.textContent =
          "Not quite. Subtract the bill from the amount the customer gave, then try again.";
      input?.select();
      return;
    }
    settlementKind = "change";
    settlementAmountPaise = settlement.amountPaise;
    changePieces = [];
    phase = "change-drawer";
    renderPayment();
    if (feedback)
      feedback.textContent = "Correct! Now count out the change using the notes and coins.";
    byId("ls-change-denominations")?.querySelector("button:not(:disabled)")?.focus();
  }
}

function handleClick(event) {
  const button = event.target.closest("[data-ls-action]");
  if (!button || !byId("screen-little-shop")?.contains(button)) return;
  const action = button.dataset.lsAction;
  if (action === "next-customer") {
    if (phase === "done") {
      startNewCustomer(true);
      byId("ls-catalogue")?.querySelector(".ls-add:not(:disabled)")?.focus();
    }
    return;
  }
  if (action === "bill-customer") {
    makeBill();
    return;
  }
  if (action === "ask-more") {
    const actionRoot = byId("ls-payment-action");
    if (actionRoot)
      actionRoot.innerHTML =
        '<form class="ls-money-form" data-ls-form="more"><label for="ls-money-answer">How much more should the customer pay?</label><div class="ls-money-input-row"><span>₹</span><input id="ls-money-answer" name="amount" inputmode="decimal" autocomplete="off" placeholder="Your answer" required><button type="submit" class="ls-primary">Ask for this amount</button></div></form>';
    byId("ls-money-answer")?.focus();
    return;
  }
  if (action === "finish-sale") {
    finishSale();
    return;
  }
  if (action === "give-change") {
    if (phase !== "change-drawer") return;
    const value = Number(button.dataset.value);
    if (!DENOMINATIONS.includes(value) || changeGivenPaise() + value > settlementAmountPaise)
      return;
    changePieces.push(value);
    renderChangeDrawer();
    return;
  }
  if (action === "undo-change") {
    if (phase !== "change-drawer") return;
    changePieces.pop();
    renderChangeDrawer();
    return;
  }
  if (action === "clear-change") {
    if (phase !== "change-drawer") return;
    changePieces = [];
    renderChangeDrawer();
    return;
  }
  if (action === "clear-basket") {
    if (phase !== "shopping") return;
    basket.clear();
    renderBasket();
    setStatus("Basket emptied. Add the fruits the customer asked for.");
    return;
  }
  if (phase !== "shopping") return;
  const id = button.dataset.item;
  if (!itemsById.has(id)) return;
  const quantity = basket.get(id) || 0;
  switch (action) {
    case "add":
    case "increase":
      if (quantity < 99) basket.set(id, quantity + 1);
      setStatus(itemsById.get(id).name + " added to the basket.");
      break;
    case "decrease":
      if (quantity <= 1) basket.delete(id);
      else basket.set(id, quantity - 1);
      setStatus("Basket quantity updated.");
      break;
    case "remove":
      basket.delete(id);
      setStatus(itemsById.get(id).name + " removed from the basket.");
      break;
    default:
      return;
  }
  renderBasket();
}

function init() {
  if (controller) controller.abort();
  controller = new AbortController();
  active = true;
  customerNumber = 1;
  byId("screen-little-shop")?.addEventListener("click", handleClick, { signal: controller.signal });
  byId("screen-little-shop")?.addEventListener("submit", handleSubmit, {
    signal: controller.signal,
  });
  startNewCustomer(false);
  byId("little-shop-title")?.focus({ preventScroll: true });
}

function stop() {
  active = false;
  if (controller) controller.abort();
  controller = null;
}

function isActive() {
  return active;
}

function getState() {
  return {
    active,
    customerNumber,
    customer: customer
      ? { name: customer.name, items: customer.items.map((line) => ({ ...line })) }
      : null,
    phase,
    basket: [...basket.entries()].map(([id, quantity]) => ({ id, quantity })),
    billTotalPaise,
    paymentPaise,
    additionalPaymentPaise,
    settlementKind,
    settlementAmountPaise,
    changeGivenPaise: changeGivenPaise(),
  };
}

if (typeof window !== "undefined") window.LittleShop = {
  init,
  stop,
  isActive,
  getCatalogue: () => CATALOGUE.map((item) => ({ ...item })),
  getState,
};


export { addMoney, changeDue, compareMoney, formatMoney, multiplyMoney, parseMoney, totalBasket, withinBudget, CATALOGUE, chooseCustomerPayment, createCustomerOrder, getSettlement, orderMatches, orderTotalPaise };
