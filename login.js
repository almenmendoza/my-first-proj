document.addEventListener('DOMContentLoaded', function () {

  const loginBtn = document.getElementById('login-btn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const feedbackDiv = document.getElementById('login-alert');

  if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'dashboard.html';
    return;
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', function (event) {
      event.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      feedbackDiv.textContent = '';
      feedbackDiv.classList.add('d-none');

      if (username === '' || password === '') {
        showFeedback('Please enter both username and password.', 'danger');
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', username);

      showFeedback('Login successful! Redirecting to dashboard...', 'success');

      setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }

  function showFeedback(message, type) {
    feedbackDiv.className = `alert alert-${type}`;
    feedbackDiv.textContent = message;
    feedbackDiv.classList.remove('d-none');
  }

});