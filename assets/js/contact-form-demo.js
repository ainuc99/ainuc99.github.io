// ==========================================================================
// CONTACT FORM DEMO VERSION - contact-form-demo.js
// Perfect for portfolios, GitHub Pages, and client demonstrations
// Shows all functionality without needing a server
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Get main form elements
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    /**
     * Display field-specific error messages
     */
    function showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    /**
     * Clear all field error messages
     */
    function clearFieldErrors() {
        const errorElements = contactForm.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
    }

    /**
     * Show success message with personalization
     */
    function showSuccessMessage(message) {
        formError.style.display = 'none';
        formSuccess.style.display = 'flex';
        
        if (message) {
            formSuccess.querySelector('span').textContent = message;
        }

        // Smooth scroll to success message
        setTimeout(() => {
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    /**
     * Setup real-time validation for form fields
     */
    function setupRealTimeValidation() {
        const fields = {
            name: {
                element: contactForm.querySelector('#name'),
                validate: (value) => {
                    if (!value.trim()) return 'Name is required';
                    if (value.trim().length < 2) return 'Name must be at least 2 characters';
                    return null;
                }
            },
            email: {
                element: contactForm.querySelector('#email'),
                validate: (value) => {
                    if (!value.trim()) return 'Email is required';
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) return 'Please enter a valid email address';
                    return null;
                }
            },
            phone: {
                element: contactForm.querySelector('#phone'),
                validate: (value) => {
                    if (value.trim() && !/^[\+]?[1-9][\d\s\-\(\)]{0,15}$/.test(value)) {
                        return 'Please enter a valid phone number';
                    }
                    return null;
                }
            },
            message: {
                element: contactForm.querySelector('#message'),
                validate: (value) => {
                    if (!value.trim()) return 'Message is required';
                    if (value.trim().length < 10) return 'Message must be at least 10 characters';
                    if (value.trim().length > 2000) return 'Message must be less than 2000 characters';
                    return null;
                }
            }
        };

        // Attach event listeners to each field
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const errorElement = document.getElementById(`${fieldName}-error`);

            // Validate on blur
            field.element.addEventListener('blur', function() {
                const error = field.validate(this.value);
                if (error) {
                    showFieldError(fieldName, error);
                } else if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.classList.remove('show');
                }
            });

            // Clear error on input if field becomes valid
            field.element.addEventListener('input', function() {
                if (errorElement && errorElement.classList.contains('show')) {
                    const error = field.validate(this.value);
                    if (!error) {
                        errorElement.textContent = '';
                        errorElement.classList.remove('show');
                    }
                }
            });
        });

        // Privacy policy checkbox validation
        const privacyCheckbox = contactForm.querySelector('input[name="privacy"]');
        privacyCheckbox.addEventListener('change', function() {
            const errorElement = document.getElementById('privacy-error');
            if (this.checked && errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        });
    }

    /**
     * Handle form submission - DEMO SIMULATION
     */
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous messages
        clearFieldErrors();
        formSuccess.style.display = 'none';
        formError.style.display = 'none';

        // Get form data
        const formData = new FormData(contactForm);
        
        // Client-side validation
        let isValid = true;

        if (!formData.get('name').trim()) {
            showFieldError('name', 'Name is required');
            isValid = false;
        }

        if (!formData.get('email').trim()) {
            showFieldError('email', 'Email is required');
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.get('email'))) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }
        }

        if (!formData.get('message').trim()) {
            showFieldError('message', 'Message is required');
            isValid = false;
        } else if (formData.get('message').trim().length < 10) {
            showFieldError('message', 'Message must be at least 10 characters');
            isValid = false;
        }

        if (!formData.get('privacy')) {
            showFieldError('privacy', 'You must accept the privacy policy');
            isValid = false;
        }

        // If validation fails, scroll to first error
        if (!isValid) {
            const firstError = contactForm.querySelector('.form-error.show');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Simulate successful submission
        const userName = formData.get('name').trim();
        const userService = formData.get('service') || 'our services';
        
        // Personalized success message
        const messages = [
            `Thank you ${userName}! Your message has been received. We'll get back to you within 24 hours.`,
            `Hi ${userName}! Thanks for your interest in ${userService}. We'll contact you soon!`,
            `Great to hear from you, ${userName}! Your inquiry is important to us and we'll respond shortly.`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showSuccessMessage(randomMessage);
        
        // Reset form after delay
        setTimeout(() => {
            contactForm.reset();
            updateCharCounter();
        }, 1500);
    });

    // Initialize validation
    setupRealTimeValidation();

    // Character counter for message textarea
    const messageTextarea = contactForm.querySelector('#message');
    const messageGroup = messageTextarea.closest('.form-group');
    
    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.style.cssText = 'font-size: 12px; color: #6b7280; margin-top: 5px; text-align: right;';
    messageGroup.appendChild(charCounter);

    function updateCharCounter() {
        const length = messageTextarea.value.length;
        const maxLength = 2000;
        charCounter.textContent = `${length}/${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            charCounter.style.color = '#f59e0b';
        } else if (length > maxLength) {
            charCounter.style.color = '#dc3545';
        } else {
            charCounter.style.color = '#6b7280';
        }
    }

    messageTextarea.addEventListener('input', updateCharCounter);
    updateCharCounter();

    // Auto-resize textarea
    messageTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });

    // Enhanced UX features
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    formInputs.forEach((input, index) => {
        // Focus styling
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.closest('.form-group').classList.remove('focused');
        });

        // Keyboard navigation
        if (input.type !== 'textarea') {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const nextInput = formInputs[index + 1];
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        submitBtn.click();
                    }
                }
            });
        }
    });

    // Auto-focus budget when service is selected
    const serviceSelect = contactForm.querySelector('#service');
    const budgetSelect = contactForm.querySelector('#budget');
    
    serviceSelect.addEventListener('change', function() {
        if (this.value && !budgetSelect.value) {
            setTimeout(() => budgetSelect.focus(), 100);
        }
    });

    // Analytics tracking (demo mode)
    let formStartTime = null;
    let fieldsInteracted = new Set();

    contactForm.addEventListener('focusin', function() {
        if (!formStartTime) {
            formStartTime = Date.now();
        }
    }, { once: true });

    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            fieldsInteracted.add(this.name || this.id);
        });
    });

    contactForm.addEventListener('submit', function() {
        if (formStartTime) {
            const completionTime = Date.now() - formStartTime;
        }
    });
});