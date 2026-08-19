document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
        return;
    }

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const feedbackDiv = document.getElementById('feedback');

    function showFeedback(message, type) {
        if (feedbackDiv) {
            feedbackDiv.className = `alert alert-${type} mt-3`;
            feedbackDiv.textContent = message;
            feedbackDiv.classList.remove('d-none');
        } else {
            alert(message);
        }
    }

    function handleLogin() {
        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        if (!username || !password) {
            showFeedback('Please fill in both username and password.', 'warning');
            return;
        }

        if (username === 'admin' && password === 'password123') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', username);
            
            showFeedback('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showFeedback('Invalid credentials. Only admin can log in.', 'danger');
        }
    }

    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
});
