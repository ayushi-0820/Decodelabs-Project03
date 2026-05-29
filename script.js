const CAT_COLORS = {
  Food:      { light: { bg: "#FFF4E6", text: "#92400E" }, dark: { bg: "#2A1A00", text: "#FCD34D" }, bar: "#F59E0B" },
  Transport: { light: { bg: "#EFF6FF", text: "#1E40AF" }, dark: { bg: "#00112A", text: "#60A5FA" }, bar: "#3B82F6" },
  Shopping:  { light: { bg: "#F5F3FF", text: "#5B21B6" }, dark: { bg: "#1A0030", text: "#C084FC" }, bar: "#8B5CF6" },
  Bills:     { light: { bg: "#FFF7ED", text: "#9A3412" }, dark: { bg: "#2A0E00", text: "#FB923C" }, bar: "#F97316" },
  Health:    { light: { bg: "#F0FDF4", text: "#166534" }, dark: { bg: "#001A0A", text: "#4ADE80" }, bar: "#22C55E" },
  Education: { light: { bg: "#F0F9FF", text: "#075985" }, dark: { bg: "#001824", text: "#38BDF8" }, bar: "#0EA5E9" },
  Salary:    { light: { bg: "#ECFDF5", text: "#065F46" }, dark: { bg: "#001810", text: "#34D399" }, bar: "#10B981" },
  Freelance: { light: { bg: "#FDF4FF", text: "#6B21A8" }, dark: { bg: "#200030", text: "#D8B4FE" }, bar: "#A855F7" },
  Other:     { light: { bg: "#F8FAFC", text: "#475569" }, dark: { bg: "#0E1420", text: "#94A3B8" }, bar: "#94A3B8" },
};

// ---- STATE ----
let transactions = JSON.parse(localStorage.getItem("spendly_data") || "[]");
let currentType   = "income";
let currentFilter = "all";
let selectedMonth = "all";
let isDark        = localStorage.getItem("spendly_theme") === "dark";

// apply saved theme on load
if (isDark) document.body.classList.add("dark");

// ---- HELPERS ----
function formatRs(n) {
  return "Rs. " + Math.abs(n).toLocaleString("en-IN");
}

function getCatStyle(cat) {
  const c = CAT_COLORS[cat] || CAT_COLORS.Other;
  return isDark ? c.dark : c.light;
}

function save() {
  localStorage.setItem("spendly_data", JSON.stringify(transactions));
}

// ---- THEME TOGGLE ----
document.getElementById("theme-btn").addEventListener("click", function () {
  isDark = !isDark;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("spendly_theme", isDark ? "dark" : "light");
  document.getElementById("theme-label").textContent = isDark ? "Dark"  : "Light";
  document.getElementById("theme-icon").textContent  = isDark ? "☽" : "☀";
  render(); // re-render so badge colors update
});

// ---- TYPE TOGGLE (Income / Expense) ----
document.getElementById("btn-income").addEventListener("click", function () {
  currentType = "income";
  document.getElementById("btn-income").className  = "type-btn income-btn active-income";
  document.getElementById("btn-expense").className = "type-btn expense-btn";
});

document.getElementById("btn-expense").addEventListener("click", function () {
  currentType = "expense";
  document.getElementById("btn-income").className  = "type-btn income-btn";
  document.getElementById("btn-expense").className = "type-btn expense-btn active-expense";
});

// ---- ADD TRANSACTION ----
document.getElementById("add-btn").addEventListener("click", addTransaction);

document.getElementById("desc").addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTransaction();
});

document.getElementById("amount").addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTransaction();
});

function addTransaction() {
  var desc     = document.getElementById("desc").value.trim();
  var amount   = parseFloat(document.getElementById("amount").value);
  var category = document.getElementById("category").value;

  if (!desc || isNaN(amount) || amount <= 0) {
    document.getElementById("desc").focus();
    return;
  }

  var now = new Date();

  var tx = {
    id:       Date.now(),
    desc:     desc,
    amount:   amount,
    category: category,
    type:     currentType,
    date:     now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    month:    now.toLocaleDateString("en-IN", { month: "short", year: "numeric" })
  };

  transactions.unshift(tx);
  save();

  document.getElementById("desc").value   = "";
  document.getElementById("amount").value = "";

  render();
}

// ---- DELETE TRANSACTION ----
function deleteTransaction(id) {
  transactions = transactions.filter(function (t) { return t.id !== id; });
  save();
  render();
}

// ---- CLEAR ALL ----
document.getElementById("clear-btn").addEventListener("click", function () {
  if (transactions.length === 0) return;
  if (!confirm("Are you sure you want to clear all transactions?")) return;
  transactions = [];
  save();
  render();
});

// ---- FILTER PILLS ----
document.querySelectorAll(".filter-pills .pill").forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll(".filter-pills .pill").forEach(function (p) {
      p.classList.remove("active");
    });
    btn.classList.add("active");
    render();
  });
});

// ---- SEARCH ----
document.getElementById("search-input").addEventListener("input", render);

// ---- MAIN RENDER FUNCTION ----
function render() {
  renderSummaryCards();
  renderQuickStats();
  renderMonthTabs();
  renderBreakdown();
  renderTransactions();
}

// ---- SUMMARY CARDS ----
function renderSummaryCards() {
  var totalIncome  = 0;
  var totalExpense = 0;

  transactions.forEach(function (t) {
    if (t.type === "income")  totalIncome  += t.amount;
    if (t.type === "expense") totalExpense += t.amount;
  });

  var balance = totalIncome - totalExpense;

  document.getElementById("total-income").textContent  = formatRs(totalIncome);
  document.getElementById("total-expense").textContent = formatRs(totalExpense);

  var balEl  = document.getElementById("balance");
  var subEl  = document.getElementById("balance-sub");
  balEl.textContent = formatRs(balance);
  balEl.className   = "card-amount" + (balance > 0 ? " pos" : balance < 0 ? " neg" : "");
  subEl.textContent = balance > 0 ? "You are in profit" : balance < 0 ? "You are over budget" : "No transactions yet";

  var incTx = transactions.filter(function (t) { return t.type === "income"; });
  var expTx = transactions.filter(function (t) { return t.type === "expense"; });
  document.getElementById("income-count").textContent  = incTx.length + " transaction" + (incTx.length !== 1 ? "s" : "");
  document.getElementById("expense-count").textContent = expTx.length + " transaction" + (expTx.length !== 1 ? "s" : "");
}

// ---- QUICK STATS ----
function renderQuickStats() {
  var expTx = transactions.filter(function (t) { return t.type === "expense"; });
  var totalExpense = expTx.reduce(function (s, t) { return s + t.amount; }, 0);
  var totalIncome  = transactions.filter(function (t) { return t.type === "income"; }).reduce(function (s, t) { return s + t.amount; }, 0);

  document.getElementById("stat-count").textContent = transactions.length;

  if (expTx.length > 0) {
    document.getElementById("stat-avg").textContent = "Rs." + Math.round(totalExpense / expTx.length).toLocaleString("en-IN");
  } else {
    document.getElementById("stat-avg").textContent = "Rs.0";
  }

  // top category by spend
  var catTotals = {};
  expTx.forEach(function (t) {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  var sorted = Object.entries(catTotals).sort(function (a, b) { return b[1] - a[1]; });
  document.getElementById("stat-top").textContent = sorted.length > 0 ? sorted[0][0] : "—";

  // savings rate
  var rate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;
  document.getElementById("stat-savings").textContent = rate + "%";
}

// ---- MONTH TABS ----
function renderMonthTabs() {
  var months = [];
  transactions.forEach(function (t) {
    if (!months.includes(t.month)) months.push(t.month);
  });

  var container = document.getElementById("month-tabs");
  container.innerHTML = "";

  if (months.length <= 1) return;

  // "All" tab
  var allBtn = document.createElement("button");
  allBtn.className = "month-tab" + (selectedMonth === "all" ? " active" : "");
  allBtn.textContent = "All";
  allBtn.addEventListener("click", function () {
    selectedMonth = "all";
    render();
  });
  container.appendChild(allBtn);

  // one tab per month (max 4)
  months.slice(0, 4).forEach(function (m) {
    var btn = document.createElement("button");
    btn.className = "month-tab" + (selectedMonth === m ? " active" : "");
    btn.textContent = m;
    btn.addEventListener("click", function () {
      selectedMonth = m;
      render();
    });
    container.appendChild(btn);
  });
}

// ---- CATEGORY BREAKDOWN ----
function renderBreakdown() {
  var base = selectedMonth === "all"
    ? transactions
    : transactions.filter(function (t) { return t.month === selectedMonth; });

  var expenses = base.filter(function (t) { return t.type === "expense"; });

  var catTotals = {};
  expenses.forEach(function (t) {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });

  var total  = expenses.reduce(function (s, t) { return s + t.amount; }, 0);
  var sorted = Object.entries(catTotals).sort(function (a, b) { return b[1] - a[1]; });
  var grid   = document.getElementById("breakdown-grid");

  if (sorted.length === 0) {
    grid.innerHTML = '<p class="no-data-msg">No expense data yet</p>';
    return;
  }

  grid.innerHTML = "";

  sorted.forEach(function (entry) {
    var cat  = entry[0];
    var amt  = entry[1];
    var pct  = Math.round((amt / total) * 100);
    var cs   = getCatStyle(cat);
    var c    = CAT_COLORS[cat] || CAT_COLORS.Other;

    var item = document.createElement("div");
    item.className = "breakdown-item";
    item.innerHTML =
      '<div class="breakdown-top">' +
        '<span class="breakdown-name">' + cat + '</span>' +
        '<span class="breakdown-amt">' + formatRs(amt) + '</span>' +
      '</div>' +
      '<div class="bar-track">' +
        '<div class="bar-fill" style="width:' + pct + '%; background:' + c.bar + '"></div>' +
      '</div>' +
      '<div class="breakdown-pct">' + pct + '% of expenses</div>';

    grid.appendChild(item);
  });
}

// ---- TRANSACTIONS LIST ----
function renderTransactions() {
  var search = document.getElementById("search-input").value.toLowerCase().trim();

  var list = transactions.slice();

  // filter by type
  if (currentFilter !== "all") {
    list = list.filter(function (t) { return t.type === currentFilter; });
  }

  // filter by month
  if (selectedMonth !== "all") {
    list = list.filter(function (t) { return t.month === selectedMonth; });
  }

  // filter by search
  if (search) {
    list = list.filter(function (t) {
      return t.desc.toLowerCase().includes(search) || t.category.toLowerCase().includes(search);
    });
  }

  var container = document.getElementById("tx-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML =
      '<div class="empty-state">' +
        '<div class="empty-icon">—</div>' +
        '<p>No transactions found</p>' +
      '</div>';
    return;
  }

  list.forEach(function (t) {
    var cs       = getCatStyle(t.category);
    var initials = t.category.slice(0, 2).toUpperCase();
    var sign     = t.type === "income" ? "+" : "-";
    var amtClass = t.type === "income" ? "inc" : "exp";

    var item = document.createElement("div");
    item.className = "tx-item";
    item.innerHTML =
      '<div class="cat-badge" style="background:' + cs.bg + '; color:' + cs.text + '">' + initials + '</div>' +
      '<div class="tx-info">' +
        '<div class="tx-name">' + t.desc + '</div>' +
        '<div class="tx-meta">' + t.category + ' &middot; ' + t.date + '</div>' +
      '</div>' +
      '<div class="tx-right">' +
        '<div class="tx-amount ' + amtClass + '">' + sign + ' ' + formatRs(t.amount) + '</div>' +
        '<button class="del-btn" title="Delete">&#10005;</button>' +
      '</div>';

    // delete button listener
    item.querySelector(".del-btn").addEventListener("click", function () {
      deleteTransaction(t.id);
    });

    container.appendChild(item);
  });
}

// ---- INIT ----
render();
