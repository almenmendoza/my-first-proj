// filterSearch.js - Search and Filtering Logic for Mr. Mendoza Health Center

class FilterSearchManager {
  constructor() {
    this.searchInput = null;
    this.statusFilter = null;
    this.resetBtn = null;
  }

  init(searchInputId, statusFilterId, resetBtnId, onFilterCallback) {
    this.searchInput = document.getElementById(searchInputId);
    this.statusFilter = document.getElementById(statusFilterId);
    this.resetBtn = document.getElementById(resetBtnId);

    const handleFilterChange = () => {
      const query = this.searchInput ? this.searchInput.value : '';
      const selectedStatus = this.statusFilter ? this.statusFilter.value : 'ALL';

      const filteredData = window.dataManager.filterActivities(query, selectedStatus);
      
      if (typeof onFilterCallback === 'function') {
        onFilterCallback(filteredData);
      }
    };

    if (this.searchInput) {
      this.searchInput.addEventListener('input', handleFilterChange);
    }

    if (this.statusFilter) {
      this.statusFilter.addEventListener('change', handleFilterChange);
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        if (this.searchInput) this.searchInput.value = '';
        if (this.statusFilter) this.statusFilter.value = 'ALL';
        
        const resetData = window.dataManager.getActivities();
        if (typeof onFilterCallback === 'function') {
          onFilterCallback(resetData);
        }
      });
    }
  }
}

// Export instance globally
window.filterSearchManager = new FilterSearchManager();