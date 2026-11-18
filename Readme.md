# Expense Tracker

A lightweight, modern web-based Expense Tracker application that allows users to manage and monitor their spending.

## Features

- **Add Expenses**: Add expenses with title, amount, category, and date.
- **Dynamic Category Selection**: Categorize expenses (Food & Dining, Groceries, Transportation, Utilities, Entertainment, Shopping, Healthcare, and more).
- **Total Calculation**: Automatically computes and displays the real-time sum total and count of expenses.
- **Local Storage Persistence**: All expense records are automatically persisted in `localStorage` so data remains saved across browser sessions.
- **Filter & Management**: Filter expenses by category, delete individual entries, or clear all entries.
- **Responsive & Accessible UI**: Clean card-based design with mobile responsiveness and form validation.

## File Structure

- `index.html`: Web interface structure and form controls.
- `style.css`: Modern responsive styles, theme variables, and layouts.
- `app.js`: Application logic, state management, calculation routines, and `localStorage` persistence.
- `test-expense.js`: Automated unit test suite verifying calculations and storage operations.
