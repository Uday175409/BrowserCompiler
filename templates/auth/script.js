// Auth Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    
    // Initialize page
    initializePage();
    
    function initializePage() {
        // Add initial animations
        if (loginSection) {
            loginSection.classList.add('slide-in-left');
        }
        if (registerSection) {
            registerSection.classList.add('slide-in-right');
        }
        
        // Load saved form data
        loadSavedFormData();
        
        // Set up form validation
        setupFormValidation();
        
        // Set up password features
        setupPasswordFeatures();
        
        // Set up auto-save
        setupAutoSave();
    }

    // Form switching
    window.switchToRegister = function() {
        if (loginSection && registerSection) {
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
            registerSection.classList.add('slide-in-right');
        }
    };

    window.switchToLogin = function() {
        if (loginSection && registerSection) {
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
            loginSection.classList.add('slide-in-left');
        }
    };

    // Password toggle
    window.togglePassword = function(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        const passwordInput = form.querySelector('input[name="password"]');
        const toggleButton = form.querySelector('.password-toggle');
        const icon = toggleButton.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'bi bi-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'bi bi-eye';
        }
    };

    // Form validation
    function setupFormValidation() {
        // Login form
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
            setupRealTimeValidation(loginForm);
        }
        
        // Register form
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegisterSubmit);
            setupRealTimeValidation(registerForm);
        }
    }

    function setupRealTimeValidation(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    validateField(input);
                }
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        
        // Clear previous validation
        field.classList.remove('is-valid', 'is-invalid');
        hideFieldError(field);
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            field.classList.add('is-invalid');
            return false;
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        // Username validation
        if (fieldName === 'username' && value) {
            if (value.length < 3) {
                showFieldError(field, 'Username must be at least 3 characters long');
                field.classList.add('is-invalid');
                return false;
            }
            if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                showFieldError(field, 'Username can only contain letters, numbers, and underscores');
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        // Name validation
        if (fieldName === 'name' && value) {
            if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters long');
                field.classList.add('is-invalid');
                return false;
            }
            if (!/^[a-zA-Z\s]+$/.test(value)) {
                showFieldError(field, 'Name can only contain letters and spaces');
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        // Phone validation
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                showFieldError(field, 'Please enter a valid phone number');
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        // Password validation
        if (fieldName === 'password' && value) {
            const strength = calculatePasswordStrength(value);
            if (strength.score < 3) {
                showFieldError(field, 'Password is too weak. Use a mix of letters, numbers, and symbols');
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        // Confirm password validation
        if (fieldName === 'confirm_password' && value) {
            const passwordField = document.getElementById('registerPassword');
            if (passwordField && value !== passwordField.value) {
                showFieldError(field, 'Passwords do not match');
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        if (value) {
            field.classList.add('is-valid');
        }
        
        return true;
    }

    function showFieldError(field, message) {
        let errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    function hideFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    // Password strength
    function setupPasswordFeatures() {
        const registerPassword = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (registerPassword) {
            registerPassword.addEventListener('input', function() {
                const strength = calculatePasswordStrength(this.value);
                showPasswordStrength(this, strength);
            });
        }
        
        if (confirmPassword) {
            confirmPassword.addEventListener('input', function() {
                validatePasswordMatch(this);
            });
        }
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score += 1;
        else feedback.push('at least 8 characters');
        
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('lowercase letters');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('uppercase letters');
        
        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('numbers');
        
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('special characters');
        
        const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        
        return {
            score: score,
            level: levels[Math.min(score, 4)],
            feedback: feedback
        };
    }

    function showPasswordStrength(field, strength) {
        let strengthDiv = document.getElementById('passwordStrength');
        if (!strengthDiv) {
            strengthDiv = document.createElement('div');
            strengthDiv.id = 'passwordStrength';
            strengthDiv.className = 'password-strength';
            field.parentNode.appendChild(strengthDiv);
        }
        
        const colors = ['danger', 'danger', 'warning', 'info', 'success'];
        const widths = [20, 40, 60, 80, 100];
        
        const colorClass = colors[Math.min(strength.score, 4)];
        const width = widths[Math.min(strength.score, 4)];
        
        strengthDiv.innerHTML = `
            <div class="progress">
                <div class="progress-bar bg-${colorClass}" style="width: ${width}%"></div>
            </div>
            <small class="text-${colorClass}">
                Password strength: ${strength.level}
                ${strength.feedback.length > 0 ? ' - Add ' + strength.feedback.join(', ') : ''}
            </small>
        `;
    }

    function validatePasswordMatch(confirmField) {
        const passwordField = document.getElementById('registerPassword');
        if (!passwordField) return;
        
        if (confirmField.value && confirmField.value !== passwordField.value) {
            showFieldError(confirmField, 'Passwords do not match');
            confirmField.classList.add('is-invalid');
        } else if (confirmField.value) {
            hideFieldError(confirmField);
            confirmField.classList.remove('is-invalid');
            confirmField.classList.add('is-valid');
        }
    }

    // Form submission
    async function handleLoginSubmit(event) {
        event.preventDefault();
        
        if (!validateAllFields(loginForm)) {
            return;
        }
        
        const submitButton = loginForm.querySelector('.auth-btn');
        setButtonLoading(submitButton, true);
        
        try {
            const formData = new FormData(loginForm);
            
            const response = await fetch(loginForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCsrfToken()
                }
            });
            
            if (response.ok) {
                clearSavedFormData('login');
                window.location.href = '/'; // Redirect to home
            } else {
                const result = await response.json();
                showFormError(result.message || 'Login failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showFormError('Network error. Please check your connection and try again.');
        } finally {
            setButtonLoading(submitButton, false);
        }
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        
        if (!validateAllFields(registerForm)) {
            return;
        }
        
        const submitButton = registerForm.querySelector('.auth-btn');
        setButtonLoading(submitButton, true);
        
        try {
            const formData = new FormData(registerForm);
            
            const response = await fetch(registerForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCsrfToken()
                }
            });
            
            if (response.ok) {
                clearSavedFormData('register');
                showFormSuccess('Account created successfully! Please check your email to verify your account.');
                registerForm.reset();
            } else {
                const result = await response.json();
                showFormError(result.message || 'Registration failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            showFormError('Network error. Please check your connection and try again.');
        } finally {
            setButtonLoading(submitButton, false);
        }
    }

    function validateAllFields(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Form messages
    function showFormError(message) {
        showFormMessage(message, 'danger');
    }

    function showFormSuccess(message) {
        showFormMessage(message, 'success');
    }

    function showFormMessage(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show mt-4`;
        alert.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.auth-container .container');
        if (container) {
            container.appendChild(alert);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        }
    }

    // Social login
    window.socialLogin = function(provider) {
        window.location.href = `/auth/social/${provider}/`;
    };

    // Auto-save functionality
    function setupAutoSave() {
        const autoSaveFields = document.querySelectorAll('[data-autosave]');
        autoSaveFields.forEach(field => {
            field.addEventListener('input', debounce(() => {
                saveFormData();
            }, 1000));
        });
    }

    function saveFormData() {
        const loginData = {};
        const registerData = {};
        
        if (loginForm) {
            const loginInputs = loginForm.querySelectorAll('[data-autosave]');
            loginInputs.forEach(input => {
                if (input.name && input.value && input.type !== 'password') {
                    loginData[input.name] = input.value;
                }
            });
        }
        
        if (registerForm) {
            const registerInputs = registerForm.querySelectorAll('[data-autosave]');
            registerInputs.forEach(input => {
                if (input.name && input.value && input.type !== 'password') {
                    registerData[input.name] = input.value;
                }
            });
        }
        
        try {
            localStorage.setItem('authFormData', JSON.stringify({
                login: loginData,
                register: registerData
            }));
        } catch (error) {
            console.error('Failed to save form data:', error);
        }
    }

    function loadSavedFormData() {
        try {
            const savedData = JSON.parse(localStorage.getItem('authFormData') || '{}');
            
            if (savedData.login && loginForm) {
                Object.keys(savedData.login).forEach(fieldName => {
                    const field = loginForm.querySelector(`[name="${fieldName}"]`);
                    if (field && !field.value) {
                        field.value = savedData.login[fieldName];
                    }
                });
            }
            
            if (savedData.register && registerForm) {
                Object.keys(savedData.register).forEach(fieldName => {
                    const field = registerForm.querySelector(`[name="${fieldName}"]`);
                    if (field && !field.value) {
                        field.value = savedData.register[fieldName];
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load saved form data:', error);
        }
    }

    function clearSavedFormData(formType) {
        try {
            const savedData = JSON.parse(localStorage.getItem('authFormData') || '{}');
            if (formType) {
                delete savedData[formType];
            } else {
                savedData.login = {};
                savedData.register = {};
            }
            localStorage.setItem('authFormData', JSON.stringify(savedData));
        } catch (error) {
            console.error('Failed to clear saved form data:', error);
        }
    }

    // Utility functions
    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter to submit active form
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            const activeForm = document.activeElement.closest('form');
            if (activeForm) {
                e.preventDefault();
                activeForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to clear current form
        if (e.key === 'Escape') {
            const activeForm = document.activeElement.closest('form');
            if (activeForm) {
                activeForm.reset();
                clearValidation(activeForm);
            }
        }
    });

    function clearValidation(form) {
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
            hideFieldError(input);
        });
    }
});
