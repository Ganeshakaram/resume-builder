document.addEventListener('DOMContentLoaded', function() {
    const togglePasswordButton = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');

    togglePasswordButton.addEventListener('click', function() {
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Dummy login validation (replace with real authentication)
        if (username === 'testuser' && password === 'password') {
            // Store login status
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect to the return URL or default to resume builder
            const urlParams = new URLSearchParams(window.location.search);
            const returnUrl = urlParams.get('returnUrl') || '../resume-builder.html';
            window.location.href = returnUrl;
        } else {
            alert('Invalid credentials');
        }
    });
});
