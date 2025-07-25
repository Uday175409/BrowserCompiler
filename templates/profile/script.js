// Profile Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Image preview functionality
    const imageInput = document.getElementById('profile_pic');
    const imagePreview = document.querySelector('.profile-image-preview');
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.animation = 'fadeInScale 0.5s ease-out';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Form validation
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            const requiredFields = profileForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    showFieldError(field, 'This field is required');
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                    hideFieldError(field);
                }
            });
            
            // Email validation
            const emailField = document.getElementById('email');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('is-invalid');
                    showFieldError(emailField, 'Please enter a valid email address');
                }
            }
            
            // Username validation
            const usernameField = document.getElementById('username');
            if (usernameField && usernameField.value) {
                const usernameRegex = /^[a-zA-Z0-9_]+$/;
                if (!usernameRegex.test(usernameField.value)) {
                    isValid = false;
                    usernameField.classList.add('is-invalid');
                    showFieldError(usernameField, 'Username can only contain letters, numbers, and underscores');
                }
            }
            
            if (!isValid) {
                event.preventDefault();
                showNotification('Please correct the errors before submitting', 'error');
            }
        });
    }

    // Real-time field validation
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('blur', function() {
            validateField(this);
        });
        
        control.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        
        // Clear previous validation
        field.classList.remove('is-valid', 'is-invalid');
        hideFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            field.classList.add('is-invalid');
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('is-invalid');
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Username validation
        if (field.id === 'username' && value) {
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(value)) {
                field.classList.add('is-invalid');
                showFieldError(field, 'Username can only contain letters, numbers, and underscores');
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

    // Password strength indicator
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            showPasswordStrength(this, strength);
        });
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        return {
            score: score,
            level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong',
            text: score < 2 ? 'Weak' : score < 4 ? 'Medium' : 'Strong'
        };
    }

    function showPasswordStrength(field, strength) {
        let strengthDiv = field.parentNode.querySelector('.password-strength');
        if (!strengthDiv) {
            strengthDiv = document.createElement('div');
            strengthDiv.className = 'password-strength mt-2';
            field.parentNode.appendChild(strengthDiv);
        }
        
        const colorClass = strength.level === 'weak' ? 'danger' : 
                          strength.level === 'medium' ? 'warning' : 'success';
        
        strengthDiv.innerHTML = `
            <div class="progress" style="height: 5px;">
                <div class="progress-bar bg-${colorClass}" 
                     style="width: ${(strength.score / 5) * 100}%"></div>
            </div>
            <small class="text-${colorClass}">Password strength: ${strength.text}</small>
        `;
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Auto-save functionality for forms
    const autoSaveFields = document.querySelectorAll('[data-autosave]');
    autoSaveFields.forEach(field => {
        // Load saved value
        const savedValue = localStorage.getItem(`profile_${field.id}`);
        if (savedValue && !field.value) {
            field.value = savedValue;
        }
        
        // Save on change
        field.addEventListener('input', debounce(function() {
            localStorage.setItem(`profile_${field.id}`, field.value);
        }, 1000));
    });

    // Debounce function for auto-save
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

    // Clear auto-saved data on form submit
    if (profileForm) {
        profileForm.addEventListener('submit', function() {
            autoSaveFields.forEach(field => {
                localStorage.removeItem(`profile_${field.id}`);
            });
        });
    }

    // Animate profile stats on load
    const statNumbers = document.querySelectorAll('.profile-stat-number');
    statNumbers.forEach(stat => {
        const targetNumber = parseInt(stat.textContent);
        let currentNumber = 0;
        const increment = targetNumber / 50;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentNumber);
        }, 20);
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .password-strength {
            transition: all 0.3s ease;
        }
        
        .form-control.is-valid {
            border-color: var(--success-color);
            padding-right: calc(1.5em + 0.75rem);
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='m2.3 6.73.66.04.94-1.64L5.3 7.99l1.14-1.85 1.86 1.85h.97l-2.84-2.85'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
        }
        
        .form-control.is-invalid {
            border-color: var(--danger-color);
            padding-right: calc(1.5em + 0.75rem);
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23dc3545' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23dc3545' d='m0 0 3 3m0-3L0 3'/%3e%3cpath d='m0 0 3 3m0-3L0 3'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
        }
    `;
    document.head.appendChild(style);
});
