const STORAGE_KEY = "finance-tracker-transactions";

const form = document.getElementById("tx-form");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const formError = document.getElementById("form-error");
const filterInput = document.getElementById("filter");
const list = document.getElementById("tx-list");
const emptyMsg = document.getElementById("empty");
const catList = document.getElementById("cat-list");

const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

function loadTransactions() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let transactions = loadTransactions();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderSummary() {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  document.getElementById("total-income").textContent = currency.format(income);
  document.getElementById("total-expense").textContent = currency.format(expense);
  document.getElementById("balance").textContent = currency.format(income - expense);
}

function renderList() {
  const filter = filterInput.value;
  const shown = transactions
    .filter((t) => filter === "all" || t.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  list.replaceChildren();
  for (const t of shown) {
    const item = el("li", "tx-item");
    const info = el("div", "tx-info");
    info.append(el("p", "tx-desc", t.description), el("p", "tx-meta", `${t.category} · ${t.date}`));

    const sign = t.type === "income" ? "+" : "-";
    const amount = el("span", `tx-amount ${t.type}`, sign + currency.format(t.amount));

    const del = el("button", "delete", "Delete");
    del.type = "button";
    del.setAttribute("aria-label", `Delete ${t.description}`);
    del.addEventListener("click", () => {
      transactions = transactions.filter((x) => x.id !== t.id);
      save();
      render();
    });

    item.append(info, amount, del);
    list.append(item);
  }
  emptyMsg.hidden = shown.length > 0;
}

function renderCategories() {
  const totals = {};
  for (const t of transactions) {
    if (t.type === "expense") totals[t.category] = (totals[t.category] || 0) + t.amount;
  }
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 0;

  catList.replaceChildren();
  if (!entries.length) {
    catList.append(el("li", "empty", "No expenses yet."));
    return;
  }
  for (const [name, total] of entries) {
    const item = el("li", "cat-item");
    const row = el("div", "cat-row");
    row.append(el("span", "", name), el("span", "", currency.format(total)));
    const bar = el("div", "bar");
    const fill = el("div", "bar-fill");
    fill.style.width = `${(total / max) * 100}%`;
    bar.append(fill);
    item.append(row, bar);
    catList.append(item);
  }
}

function render() {
  renderSummary();
  renderList();
  renderCategories();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = Math.round(parseFloat(amountInput.value) * 100) / 100;
  const date = dateInput.value;

  if (!description) {
    formError.textContent = "Please enter a description.";
    descInput.focus();
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    formError.textContent = "Please enter an amount greater than 0.";
    amountInput.focus();
    return;
  }
  if (!date) {
    formError.textContent = "Please choose a date.";
    dateInput.focus();
    return;
  }

  formError.textContent = "";
  transactions.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    description,
    amount,
    type: typeInput.value,
    category: categoryInput.value,
    date,
  });
  save();
  form.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
  render();
});

filterInput.addEventListener("change", renderList);

dateInput.value = new Date().toISOString().slice(0, 10);
render();
