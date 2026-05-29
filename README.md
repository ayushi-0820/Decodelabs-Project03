# Spendly — Expense Tracker

A clean, interactive expense tracker built with vanilla HTML, CSS, and JavaScript as part of the Frontend Development Industrial Training (Project 3) at DecodeLabs.

No frameworks. No libraries. Pure DOM manipulation.

---

## Features

- Add income and expense transactions with description, amount, and category
- Live balance, total income, and total expense summary cards
- Category-wise spending breakdown with progress bars
- Month-wise filtering — tabs appear automatically as you add data
- Search transactions by name or category
- Quick stats — total count, average expense, top spending category, savings rate
- Dark / Light mode toggle with preference saved in localStorage
- Data persists across page reloads using localStorage
- Delete individual transactions or clear all at once
- Smooth entry animations and hover interactions

---

## Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, dark mode, animations, layout |
| JavaScript (ES5/ES6) | DOM manipulation, event handling, state management |
| localStorage | Persisting transaction data and theme preference |

---

## JavaScript Concepts Used

- `addEventListener` — for all button clicks, keyboard events, and input changes
- `createElement` + `appendChild` — dynamically building transaction cards, breakdown items, month tabs
- `textContent` — safe DOM text updates for balance, stats, amounts
- `classList.toggle` / `classList.add` / `classList.remove` — dark mode switching, active states
- Array methods — `filter`, `forEach`, `reduce`, `map`, `includes` for data processing
- `localStorage.getItem` / `setItem` — saving and loading data
- State variables — `currentType`, `currentFilter`, `selectedMonth`, `isDark` for managing UI state

---

## Project Structure

```
spendly/
├── index.html      # Page structure and layout
├── style.css       # All styling including dark mode
└── app.js          # All logic, event listeners, DOM updates
```

---

## How to Run

1. Download or clone the repository
2. Make sure all three files are in the same folder
3. Open `index.html` in any browser
4. No build step, no server required
OR Just use this 
LIVE LINK : https://spendly-trackerr.netlify.app/
---

## Project Context

This project was built as **Project 3 — Interactive Web Elements** for the Frontend Development track at DecodeLabs (Industrial Training, Batch 2026).

The goal was to move beyond static layouts and demonstrate the ability to use JavaScript to manipulate the DOM and create pages that respond to user actions in real time — following the Input → Process → Output (IPO) loop.

---
