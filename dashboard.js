document.addEventListener('DOMContentLoaded', function () {

  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  const storedUser = localStorage.getItem('user') || 'Patient';
  const userDisplayName = document.getElementById('user-display-name');
  const greeting = document.getElementById('greeting');

  if (userDisplayName) {
    userDisplayName.textContent = storedUser;
  }

  if (greeting) {
    const hour = new Date().getHours();
    let timeGreeting = 'Good Morning';
    if (hour >= 12 && hour < 18) {
      timeGreeting = 'Good Afternoon';
    } else if (hour >= 18) {
      timeGreeting = 'Good Evening';
    }
    greeting.textContent = `${timeGreeting}, ${storedUser}!`;
  }

  const tableBody = document.getElementById('activityTableBody');
  if (tableBody) {
    const activities = [
      { date: '2026-08-18', desc: 'Blood Pressure Check (120/80)', status: 'Normal', badge: 'bg-success' },
      { date: '2026-08-15', desc: 'Appointment with Dr. Andriane Santos', status: 'Completed', badge: 'bg-primary' },
      { date: '2026-08-10', desc: 'Prescription Refilled: Amoxicillin', status: 'Processed', badge: 'bg-info' },
      { date: '2026-08-01', desc: 'Lab Test Results Uploaded', status: 'Reviewed', badge: 'bg-secondary' }
    ];

    tableBody.innerHTML = activities.map(act => `
      <tr>
        <td>${act.date}</td>
        <td>${act.desc}</td>
        <td><span class="badge ${act.badge}">${act.status}</span></td>
      </tr>
    `).join('');
  }

  function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }

  const topLogoutBtn = document.getElementById('logout-btn');
  if (topLogoutBtn) {
    topLogoutBtn.addEventListener('click', handleLogout);
  }

  const sidebarLogoutLink = document.getElementById('logoutLink');
  if (sidebarLogoutLink) {
    sidebarLogoutLink.addEventListener('click', handleLogout);
  }

});