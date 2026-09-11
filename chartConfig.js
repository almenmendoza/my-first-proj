class ChartManager {
  constructor() {
    this.barChartInstance = null;
    this.doughnutChartInstance = null;
  }

  initInventoryBarChart(canvasId, categories, values) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    this.barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Total Value (₱)',
          data: values,
          backgroundColor: '#0d5c3e',
          borderColor: '#083e29',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Value in PHP' }
          }
        }
      }
    });
  }

  initStatusDoughnutChart(canvasId, statusCounts) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    this.doughnutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['In Stock', 'Low Stock', 'Out of Stock'],
        datasets: [{
          data: statusCounts,
          backgroundColor: ['#198754', '#ffc107', '#dc3545']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

window.chartManager = new ChartManager();