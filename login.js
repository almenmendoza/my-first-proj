document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const loginAlert = document.getElementById('loginAlert');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Iwas sa page reload

      const usernameInput = document.getElementById('username').value.trim();
      const passwordInput = document.getElementById('password').value.trim();

      if (usernameInput !== '' && passwordInput !== '') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', usernameInput);


        window.location.href = 'dashboard.html';
      } else {
        if (loginAlert) loginAlert.classList.remove('d-none');
      }
    });
  }
});