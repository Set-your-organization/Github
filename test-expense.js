const assert = require('assert');

// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => {
    store[key] = String(val);
  },
  removeItem: (key) => {
    delete store[key];
  },
  clear: () => {
    Object.keys(store).forEach((k) => delete store[k]);
  },
};

// Require app module
const app = require('./app.js');

console.log('Testing Expense Tracker logic...');

// Test 1: Initially empty
assert.deepStrictEqual(app.getExpenses(), [], 'Should return empty array when no data in localStorage');

// Test 2: Calculate total
const testExpenses = [
  { id: '1', title: 'Coffee', amount: 4.5, category: 'Food & Dining', date: '2025-01-01' },
  { id: '2', title: 'Groceries', amount: 45.25, category: 'Groceries', date: '2025-01-02' },
  { id: '3', title: 'Bus ticket', amount: 2.75, category: 'Transportation', date: '2025-01-03' },
];

const total = app.calculateTotal(testExpenses);
assert.strictEqual(total, 52.5, 'Total should equal 52.50');

// Test 3: formatCurrency
const formatted = app.formatCurrency(52.5);
assert.strictEqual(formatted, '$52.50', 'Currency should format as $52.50');

// Test 4: Save & Retrieve from localStorage
app.saveExpenses(testExpenses);
const retrieved = app.getExpenses();
assert.strictEqual(retrieved.length, 3, 'Should retrieve 3 expenses');
assert.strictEqual(retrieved[0].title, 'Coffee');
assert.strictEqual(retrieved[1].amount, 45.25);
assert.strictEqual(retrieved[2].category, 'Transportation');

// Test 5: Verify calculate total on retrieved
assert.strictEqual(app.calculateTotal(retrieved), 52.5);

// Test 6: Verify JSON format in localStorage
const rawSaved = global.localStorage.getItem(app.STORAGE_KEY);
assert.ok(rawSaved, 'Data should exist in localStorage');
assert.deepStrictEqual(JSON.parse(rawSaved), testExpenses);

console.log('All tests passed successfully!');
