// Expense Tracker Application
const STORAGE_KEY = 'expense_tracker_items';

// Safe DOM element helper
const getEl = (id) => (typeof document !== 'undefined' ? document.getElementById(id) : null);

// DOM Elements
const form = getEl('expense-form');
const titleInput = getEl('expense-title');
const amountInput = getEl('expense-amount');
const categoryInput = getEl('expense-category');
const dateInput = getEl('expense-date');
const formError = getEl('form-error');

const totalAmountEl = getEl('total-amount');
const totalCountEl = getEl('total-count');
const expenseList = getEl('expense-list');
const emptyState = getEl('empty-state');
const filterCategory = getEl('filter-category');
const clearAllBtn = getEl('clear-all-btn');

// Initialize date input with today's date
if (dateInput) {
  dateInput.value = new Date().toISOString().split('T')[0];
}

/**
 * Load expenses from Local Storage
 * @returns {Array<{id: string, title: string, amount: number, category: string, date: string}>}
 */
function getExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse expenses from localStorage:', err);
    return [];
  }
}

/**
 * Save expenses array to Local Storage
 * @param {Array} expenses
 */
function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses to localStorage:', err);
  }
}

/**
 * Format number as currency string ($X.XX)
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Calculate total expense sum
 * @param {Array} expenses
 * @returns {number}
 */
function calculateTotal(expenses) {
  return expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

/**
 * Render the expenses list and summary totals
 */
function render() {
  const allExpenses = getExpenses();
  const selectedFilter = filterCategory.value;

  const filteredExpenses =
    selectedFilter === 'ALL'
      ? allExpenses
      : allExpenses.filter((item) => item.category === selectedFilter);

  // Update summary based on total expenses
  const total = calculateTotal(allExpenses);
  totalAmountEl.textContent = formatCurrency(total);
  totalCountEl.textContent = `${allExpenses.length} ${allExpenses.length === 1 ? 'transaction' : 'transactions'}`;

  // Clear list
  expenseList.innerHTML = '';

  if (filteredExpenses.length === 0) {
    emptyState.style.display = 'block';
    if (selectedFilter !== 'ALL' && allExpenses.length > 0) {
      emptyState.textContent = `No expenses found in "${selectedFilter}".`;
    } else {
      emptyState.textContent = 'No expenses added yet. Add your first expense above!';
    }
  } else {
    emptyState.style.display = 'none';

    // Render items sorted by date descending (newest first)
    const sorted = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach((expense) => {
      const li = document.createElement('li');
      li.className = 'expense-item';
      li.dataset.id = expense.id;

      const infoDiv = document.createElement('div');
      infoDiv.className = 'expense-info';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'expense-title';
      titleSpan.textContent = expense.title;

      const metaDiv = document.createElement('div');
      metaDiv.className = 'expense-meta';

      const categoryTag = document.createElement('span');
      categoryTag.className = 'category-tag';
      categoryTag.textContent = expense.category;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'expense-date';
      dateSpan.textContent = expense.date;

      metaDiv.appendChild(categoryTag);
      metaDiv.appendChild(dateSpan);
      infoDiv.appendChild(titleSpan);
      infoDiv.appendChild(metaDiv);

      const rightDiv = document.createElement('div');
      rightDiv.className = 'expense-right';

      const amountSpan = document.createElement('span');
      amountSpan.className = 'expense-amount';
      amountSpan.textContent = formatCurrency(Number(expense.amount));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.setAttribute('aria-label', `Delete ${expense.title}`);
      deleteBtn.setAttribute('title', 'Delete expense');
      deleteBtn.innerHTML = '&times;';
      deleteBtn.addEventListener('click', () => deleteExpense(expense.id));

      rightDiv.appendChild(amountSpan);
      rightDiv.appendChild(deleteBtn);

      li.appendChild(infoDiv);
      li.appendChild(rightDiv);

      expenseList.appendChild(li);
    });
  }
}

/**
 * Handle adding a new expense
 * @param {Event} e
 */
function handleAddExpense(e) {
  e.preventDefault();
  hideError();

  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!title) {
    showError('Please enter a description for the expense.');
    titleInput.focus();
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    showError('Please enter a valid amount greater than $0.00.');
    amountInput.focus();
    return;
  }

  if (!category) {
    showError('Please select an expense category.');
    categoryInput.focus();
    return;
  }

  if (!date) {
    showError('Please select a valid date.');
    dateInput.focus();
    return;
  }

  const newExpense = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    title,
    amount: Math.round(amount * 100) / 100,
    category,
    date,
  };

  const expenses = getExpenses();
  expenses.unshift(newExpense);
  saveExpenses(expenses);

  // Reset form
  titleInput.value = '';
  amountInput.value = '';
  categoryInput.selectedIndex = 0;
  dateInput.value = new Date().toISOString().split('T')[0];

  render();
}

/**
 * Delete expense by ID
 * @param {string} id
 */
function deleteExpense(id) {
  const expenses = getExpenses().filter((item) => item.id !== id);
  saveExpenses(expenses);
  render();
}

/**
 * Clear all expenses
 */
function clearAllExpenses() {
  const expenses = getExpenses();
  if (expenses.length === 0) return;

  if (confirm('Are you sure you want to delete all expenses?')) {
    saveExpenses([]);
    render();
  }
}

function showError(msg) {
  formError.textContent = msg;
  formError.style.display = 'block';
}

function hideError() {
  formError.textContent = '';
  formError.style.display = 'none';
}

// Event Listeners
if (form) {
  form.addEventListener('submit', handleAddExpense);
}

if (filterCategory) {
  filterCategory.addEventListener('change', render);
}

if (clearAllBtn) {
  clearAllBtn.addEventListener('click', clearAllExpenses);
}

// Initial render
if (typeof document !== 'undefined') {
  render();
}

// Export for testing in Node / CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STORAGE_KEY,
    getExpenses,
    saveExpenses,
    formatCurrency,
    calculateTotal,
  };
}
