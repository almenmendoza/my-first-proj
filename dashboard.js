document.addEventListener('DOMContentLoaded', async function () {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  await window.dataManager.initializeData();

  let products = window.dataManager.getProducts();
  renderTable(products);

  const categorySummary = window.dataManager.getCategorySummary ? window.dataManager.getCategorySummary() : { categories: ['Antibiotics', 'Cardiovascular', 'Analgesics', 'Antidiabetic', 'Gastrointestinal'], values: [1875, 200, 1500, 150, 0] };
  window.chartManager.initInventoryBarChart('inventoryBarChart', categorySummary.categories, categorySummary.values);
  
  const stats = window.dataManager.getStockStatistics();
  window.chartManager.initStatusDoughnutChart('statusDoughnutChart', [
    products.filter(p => p.status === 'In Stock').length,
    products.filter(p => p.status === 'Low Stock').length,
    products.filter(p => p.status === 'Out of Stock').length
  ]);

  checkLowStockAlerts();

  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  const minPriceInput = document.getElementById('minPriceInput');
  const maxPriceInput = document.getElementById('maxPriceInput');
  const resetBtn = document.getElementById('resetFiltersBtn');

  function applyAllFilters() {
    const query = searchInput ? searchInput.value : '';
    const cat = categoryFilter ? categoryFilter.value : 'ALL';
    const stat = statusFilter ? statusFilter.value : 'ALL';
    const minP = minPriceInput && minPriceInput.value !== '' ? parseFloat(minPriceInput.value) : 0;
    const maxP = maxPriceInput && maxPriceInput.value !== '' ? parseFloat(maxPriceInput.value) : Infinity;

    const filtered = window.dataManager.filterProducts(query, cat, stat, minP, maxP);
    renderTable(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyAllFilters);
  if (categoryFilter) categoryFilter.addEventListener('change', applyAllFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyAllFilters);
  if (minPriceInput) minPriceInput.addEventListener('input', applyAllFilters);
  if (maxPriceInput) maxPriceInput.addEventListener('input', applyAllFilters);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = 'ALL';
      if (statusFilter) statusFilter.value = 'ALL';
      if (minPriceInput) minPriceInput.value = '';
      if (maxPriceInput) maxPriceInput.value = '';
      renderTable(window.dataManager.getProducts());
    });
  }

  const exportBtn = document.getElementById('exportCsvBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      window.dataManager.exportToCSV(window.dataManager.getProducts());
    });
  }

  function renderTable(data) {
    const tableBody = document.getElementById('inventoryTableBody');
    if (!tableBody) return;

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No matching products found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = data.map(p => {
      let badgeClass = 'bg-success';
      if (p.status === 'Low Stock') badgeClass = 'bg-warning text-dark';
      if (p.status === 'Out of Stock') badgeClass = 'bg-danger';

      return `
        <tr>
          <td>${p.id}</td>
          <td class="fw-bold">${p.name}</td>
          <td><code>${p.sku}</code></td>
          <td>${p.category}</td>
          <td>₱${parseFloat(p.price).toFixed(2)}</td>
          <td>${p.quantity}</td>
          <td><span class="badge ${badgeClass}">${p.status}</span></td>
        </tr>
      `;
    }).join('');
  }

  function checkLowStockAlerts() {
    const alertBanner = document.getElementById('alertBanner');
    const lowStockItems = window.dataManager.getLowStockProducts();

    if (lowStockItems.length > 0) {
      alertBanner.classList.remove('d-none');
    } else {
      alertBanner.classList.add('d-none');
    }
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  }
});