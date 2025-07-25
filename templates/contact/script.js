// Contact Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form handling
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.contact-submit-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const formData = new FormData(contactForm);
        const submitButton = event.target.querySelector('.contact-submit-btn');
        
        // Update UI
        setSubmitButtonLoading(submitButton, true);
        hideMessage();
        
        try {
            const response = await fetch('/api/contact/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCsrfToken()
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                clearValidation();
            } else {
                showMessage(result.message || 'Failed to send message. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            setSubmitButtonLoading(submitButton, false);
        }
    }

    function validateForm() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
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
        
        // Subject validation
        if (fieldName === 'subject' && value) {
            if (value.length < 5) {
                showFieldError(field, 'Subject must be at least 5 characters long');
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                showFieldError(field, 'Message must be at least 10 characters long');
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        if (value) {
            field.classList.add('is-valid');
        }
        
        return true;
    }

    // Real-time validation
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('blur', function() {
            if (this.value.trim()) {
                validateField(this);
            }
        });
        
        control.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });

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

    function clearValidation() {
        formControls.forEach(control => {
            control.classList.remove('is-valid', 'is-invalid');
            hideFieldError(control);
        });
    }

    function setSubmitButtonLoading(button, loading) {
        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('.btn-text') || button;
        
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            if (spinner) spinner.style.display = 'inline-block';
            text.textContent = 'Sending...';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            if (spinner) spinner.style.display = 'none';
            text.textContent = 'Send Message';
        }
    }

    function showMessage(message, type) {
        let messageDiv = document.querySelector('.contact-message');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.className = 'contact-message';
            contactForm.parentNode.insertBefore(messageDiv, contactForm);
        }
        
        messageDiv.className = `contact-message ${type} show`;
        messageDiv.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }

    function hideMessage() {
        const messageDiv = document.querySelector('.contact-message');
        if (messageDiv) {
            messageDiv.classList.remove('show');
        }
    }

    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current FAQ
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });

    // Character counter for textarea
    const messageTextarea = document.querySelector('textarea[name="message"]');
    if (messageTextarea) {
        addCharacterCounter(messageTextarea);
    }

    function addCharacterCounter(textarea) {
        const maxLength = textarea.getAttribute('maxlength') || 500;
        
        const counter = document.createElement('small');
        counter.className = 'text-muted character-counter';
        counter.style.float = 'right';
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.className = 'text-warning character-counter';
            } else if (remaining < 20) {
                counter.className = 'text-danger character-counter';
            } else {
                counter.className = 'text-muted character-counter';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    }

    // Social link tracking
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.classList[1]; // second class should be platform name
            trackSocialClick(platform);
        });
    });

    function trackSocialClick(platform) {
        // Track social media clicks for analytics
        try {
            let socialClicks = JSON.parse(localStorage.getItem('socialClicks') || '[]');
            socialClicks.push({
                platform: platform,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 50 clicks
            if (socialClicks.length > 50) {
                socialClicks = socialClicks.slice(-50);
            }
            
            localStorage.setItem('socialClicks', JSON.stringify(socialClicks));
        } catch (error) {
            console.error('Failed to track social click:', error);
        }
    }

    // Contact info card animations
    const infoCards = document.querySelectorAll('.contact-info-card');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            observer.observe(card);
        }, index * 200);
    });

    // Auto-save form data
    function autoSaveForm() {
        const formData = {};
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (input.name && input.value) {
                formData[input.name] = input.value;
            }
        });
        
        try {
            localStorage.setItem('contactFormData', JSON.stringify(formData));
        } catch (error) {
            console.error('Failed to auto-save form:', error);
        }
    }

    function loadSavedFormData() {
        try {
            const savedData = JSON.parse(localStorage.getItem('contactFormData') || '{}');
            
            Object.keys(savedData).forEach(fieldName => {
                const field = contactForm.querySelector(`[name="${fieldName}"]`);
                if (field && !field.value) {
                    field.value = savedData[fieldName];
                }
            });
        } catch (error) {
            console.error('Failed to load saved form data:', error);
        }
    }

    // Set up auto-save
    if (contactForm) {
        loadSavedFormData();
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(autoSaveForm, 1000));
        });
        
        // Clear saved data on successful submit
        contactForm.addEventListener('submit', function() {
            localStorage.removeItem('contactFormData');
        });
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

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-control.is-valid {
            border-color: var(--success-color);
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='m2.3 6.73.66.04.94-1.64L5.3 7.99l1.14-1.85 1.86 1.85h.97l-2.84-2.85'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
        }
        
        .form-control.is-invalid {
            border-color: var(--danger-color);
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23dc3545' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23dc3545' d='m0 0 3 3m0-3L0 3'/%3e%3cpath d='m0 0 3 3m0-3L0 3'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
        }
        
        .character-counter {
            transition: color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
