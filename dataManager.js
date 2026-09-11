class DataManager {
  constructor() {
    this.productsData = [];
  }

  async initializeData() {
    try {
      const response = await fetch('api/activities.php');
      this.productsData = await response.json();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  getProducts() {
    return this.productsData;
  }

  getProductById(id) {
    return this.productsData.find(p => p.id == id);
  }

  getProductsByCategory(category) {
    if (!category || category === 'ALL') return this.productsData;
    return this.productsData.filter(p => p.category === category);
  }

  getLowStockProducts() {
    return this.productsData.filter(p => p.quantity <= p.reorderLevel);
  }

  getStockStatistics() {
    const totalProducts = this.productsData.length;
    const totalValue = this.productsData.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const lowStockCount = this.getLowStockProducts().length;
    return { totalProducts, totalValue, lowStockCount };
  }

  filterProducts(query = '', category = 'ALL', status = 'ALL', minPrice = 0, maxPrice = Infinity) {
    const cleanQuery = query.toLowerCase().trim();

    return this.productsData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(cleanQuery) || item.sku.toLowerCase().includes(cleanQuery);
      const matchesCategory = (category === 'ALL' || item.category === category);
      const matchesStatus = (status === 'ALL' || item.status === status);
      const matchesPrice = (item.price >= minPrice && item.price <= maxPrice);

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });
  }

  exportToCSV(dataToExport) {
    let csv = 'ID,Name,SKU,Category,Price,Quantity,Status\n';
    dataToExport.forEach(row => {
      csv += `"${row.id}","${row.name}","${row.sku}","${row.category}","${row.price}","${row.quantity}","${row.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Inventory_Report_${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
  }
}

window.dataManager = new DataManager();