// Auth Page JavaScript - Form Switching and Validation

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth page loaded');
    
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    
    // Password toggle buttons
    const togglePassword = document.getElementById('togglePassword');
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    
    // Initialize form switching
    initializeFormSwitching();
    
    // Initialize password toggles
    initializePasswordToggles();
    
    // Initialize form validation
    initializeFormValidation();
    
    function initializeFormSwitching() {
        // Handle radio button changes
        if (loginToggle) {
            loginToggle.addEventListener('change', function() {
                if (this.checked) {
                    showLoginForm();
                }
            });
        }
        
        if (registerToggle) {
            registerToggle.addEventListener('change', function() {
                if (this.checked) {
                    showRegisterForm();
                }
            });
        }
        
        // Handle text link switches
        if (switchToRegister) {
            switchToRegister.addEventListener('click', function(e) {
                e.preventDefault();
                registerToggle.checked = true;
                showRegisterForm();
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                loginToggle.checked = true;
                showLoginForm();
            });
        }
        
        // Set initial state
        showLoginForm();
    }
    
    function showLoginForm() {
        if (loginForm && registerForm) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            
            // Add animation classes
            loginForm.classList.remove('fade-out');
            loginForm.classList.add('fade-in');
            registerForm.classList.remove('fade-in');
            registerForm.classList.add('fade-out');
        }
    }
    
    function showRegisterForm() {
        if (loginForm && registerForm) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            
            // Add animation classes
            registerForm.classList.remove('fade-out');
            registerForm.classList.add('fade-in');
            loginForm.classList.remove('fade-in');
            loginForm.classList.add('fade-out');
        }
    }
    
    function initializePasswordToggles() {
        // Login password toggle
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const passwordInput = loginForm.querySelector('input[name="password"]');
                const icon = this.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'bi bi-eye-slash';
                } else {
                    passwordInput.type = 'password';
                    icon.className = 'bi bi-eye';
                }
            });
        }
        
        // Register password toggle
        if (toggleRegisterPassword) {
            toggleRegisterPassword.addEventListener('click', function() {
                const passwordInput = registerForm.querySelector('input[name="password"]');
                const icon = this.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'bi bi-eye-slash';
                } else {
                    passwordInput.type = 'password';
                    icon.className = 'bi bi-eye';
                }
            });
        }
    }
    
    function initializeFormValidation() {
        // Real-time validation for email fields
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', validateEmail);
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateEmail.call(this);
                }
            });
        });
        
        // Real-time validation for password fields
        const passwordInputs = document.querySelectorAll('input[name="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('blur', validatePassword);
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validatePassword.call(this);
                }
            });
        });
        
        // Username validation
        const usernameInputs = document.querySelectorAll('input[name="username"]');
        usernameInputs.forEach(input => {
            input.addEventListener('blur', validateUsername);
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateUsername.call(this);
                }
            });
        });
    }
    
    function validateEmail() {
        const email = this.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailPattern.test(email)) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
            showFieldError(this, 'Please enter a valid email address');
        } else if (email) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            hideFieldError(this);
        } else {
            this.classList.remove('is-invalid', 'is-valid');
            hideFieldError(this);
        }
    }
    
    function validatePassword() {
        const password = this.value;
        const minLength = 8;
        
        if (password && password.length < minLength) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
            showFieldError(this, `Password must be at least ${minLength} characters long`);
        } else if (password) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            hideFieldError(this);
        } else {
            this.classList.remove('is-invalid', 'is-valid');
            hideFieldError(this);
        }
    }
    
    function validateUsername() {
        const username = this.value.trim();
        const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
        
        if (username && !usernamePattern.test(username)) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
            showFieldError(this, 'Username must be 3-20 characters, letters, numbers, and underscores only');
        } else if (username) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            hideFieldError(this);
        } else {
            this.classList.remove('is-invalid', 'is-valid');
            hideFieldError(this);
        }
    }
    
    function showFieldError(field, message) {
        hideFieldError(field); // Remove existing error
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function hideFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // Form submission handling
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    }
    
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
        
        return isValid;
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.3s ease-in-out;
    }
    
    .fade-out {
        animation: fadeOut 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-20px); }
    }
    
    .auth-form {
        transition: all 0.3s ease-in-out;
    }
    
    .invalid-feedback {
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: #dc3545;
    }
`;
document.head.appendChild(style);
