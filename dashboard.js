document.addEventListener('DOMContentLoaded', async () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  const username = localStorage.getItem('user') || 'Admin';
  const userDisplay = document.getElementById('user-display-name');
  if (userDisplay) userDisplay.textContent = username;

  await window.dataManager.initializeData();
  const products = window.dataManager.getProducts();

  renderTable(products);
  initCharts(products);
  updateStockSummaryCards(products);
  checkAlerts(products);

  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  const minPriceInput = document.getElementById('minPriceInput');
  const maxPriceInput = document.getElementById('maxPriceInput');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  function applyFilters() {
    const query = searchInput.value;
    const category = categoryFilter.value;
    const status = statusFilter.value;
    const minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : 0;
    const maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity;

    const filtered = window.dataManager.filterProducts(query, category, status, minPrice, maxPrice);
    renderTable(filtered);
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  minPriceInput.addEventListener('input', applyFilters);
  maxPriceInput.addEventListener('input', applyFilters);

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = 'ALL';
    statusFilter.value = 'ALL';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    renderTable(window.dataManager.getProducts());
  });

  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const currentProducts = window.dataManager.getProducts();
      window.dataManager.exportToCSV(currentProducts);
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  }
});

function renderTable(products) {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No matching products found.</td></tr>`;
    return;
  }

  products.forEach(item => {
    let badgeClass = 'bg-secondary';
    if (item.status === 'In Stock') badgeClass = 'bg-success';
    else if (item.status === 'Low Stock') badgeClass = 'bg-warning text-dark';
    else if (item.status === 'Out of Stock') badgeClass = 'bg-danger';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td class="fw-bold">${item.name}</td>
      <td><span class="text-muted small">${item.sku}</span></td>
      <td>${item.category}</td>
      <td>₱${parseFloat(item.price).toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td><span class="badge ${badgeClass}">${item.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function initCharts(products) {
  const categoriesMap = {};
  products.forEach(p => {
    const totalVal = p.quantity * p.price;
    if (!categoriesMap[p.category]) categoriesMap[p.category] = 0;
    categoriesMap[p.category] += totalVal;
  });

  const categories = Object.keys(categoriesMap);
  const values = Object.values(categoriesMap);

  if (window.chartManager) {
    window.chartManager.initInventoryBarChart('inventoryBarChart', categories, values);

    const inStockCount = products.filter(p => p.status === 'In Stock').length;
    const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
    const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;

    window.chartManager.initStatusDoughnutChart('statusDoughnutChart', [inStockCount, lowStockCount, outOfStockCount]);
  }
}

function updateStockSummaryCards(products) {
  const lowStockItems = products.filter(p => p.status === 'Low Stock');
  const outOfStockItems = products.filter(p => p.status === 'Out of Stock');

  const lowStockCountEl = document.getElementById('lowStockCount');
  const outOfStockCountEl = document.getElementById('outOfStockCount');

  if (lowStockCountEl) lowStockCountEl.textContent = lowStockItems.length;
  if (outOfStockCountEl) outOfStockCountEl.textContent = outOfStockItems.length;
}

function checkAlerts(products) {
  const alertBanner = document.getElementById('alertBanner');
  const lowStockItems = products.filter(p => p.status === 'Low Stock');
  const outOfStockItems = products.filter(p => p.status === 'Out of Stock');

  if (alertBanner && (lowStockItems.length > 0 || outOfStockItems.length > 0)) {
    alertBanner.classList.remove('d-none');
  }
}
