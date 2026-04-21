// ==========================================================================
// CONTACT FORM PRODUCTION VERSION - contact-form-production.js
// Full functionality with real PHP submission, email sending, and debug logging
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Get main form elements
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    // Debug panel (optional - can be disabled in production)
    const DEBUG_MODE = false; // Set to false to disable debug panel

    /**
     * Create debug panel for development
     */
    function createDebugPanel() {
        if (!DEBUG_MODE) return null;
        
        const debugDiv = document.createElement('div');
        debugDiv.id = 'debug-panel';
        debugDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>📊 Debug Log</strong>
                <button onclick="this.parentElement.parentElement.style.display='none'" style="background: none; border: none; color: #e2e8f0; cursor: pointer;">×</button>
            </div>
            <div id="debug-content"></div>
        `;
        debugDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            max-height: 250px;
            background: #1e293b;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 11px;
            overflow-y: auto;
            z-index: 9999;
            border: 1px solid #22c55e;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        `;
        document.body.appendChild(debugDiv);
        return debugDiv;
    }

    /**
     * Debug logging function
     */
    function debugLog(message, data = null) { 
        if (!DEBUG_MODE) return;
        
        const debugPanel = document.getElementById('debug-panel') || createDebugPanel();
        if (!debugPanel) return;
        
        const debugContent = document.getElementById('debug-content');
        const timestamp = new Date().toLocaleTimeString();
        
        let logEntry = `<div style="margin: 5px 0; padding: 5px; background: rgba(34, 197, 94, 0.1); border-radius: 4px;">
            <strong>${timestamp}:</strong> ${message}
        `;
        
        if (data) {
            logEntry += `<br><pre style="margin: 5px 0; font-size: 10px; color: #94a3b8;">${JSON.stringify(data, null, 2)}</pre>`;
        }
        
        logEntry += '</div>';
        debugContent.innerHTML += logEntry;
        debugContent.scrollTop = debugContent.scrollHeight;
    }

    /**
     * Display field-specific error messages
     */
    function showFieldError(fieldName, message) {
        debugLog(`❌ Field error - ${fieldName}:`, message);
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
        debugLog('🧹 Cleared all field errors');
    }

    /**
     * Show success message
     */
    function showSuccessMessage(message) {
        debugLog('🎉 Showing success message:', message);
        formError.style.display = 'none';
        formSuccess.style.display = 'flex';
        
        if (message) {
            formSuccess.querySelector('span').textContent = message;
        }

        setTimeout(() => {
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    /**
     * Show error message
     */
    function showErrorMessage(message) {
        debugLog('❌ Showing error message:', message);
        formSuccess.style.display = 'none';
        formError.style.display = 'flex';
        
        if (message) {
            formError.querySelector('span').textContent = message;
        }

        setTimeout(() => {
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    /**
     * Setup real-time validation
     */
    function setupRealTimeValidation() {
        debugLog('🔧 Setting up real-time validation');
        
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

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const errorElement = document.getElementById(`${fieldName}-error`);

            field.element.addEventListener('blur', function() {
                const error = field.validate(this.value);
                if (error) {
                    showFieldError(fieldName, error);
                } else if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.classList.remove('show');
                }
            });

            field.element.addEventListener('input', function() {
                if (errorElement && errorElement.classList.contains('show')) {
                    const error = field.validate(this.value);
                    if (!error) {
                        errorElement.textContent = '';
                        errorElement.classList.remove('show');
                        debugLog(`✅ Field ${fieldName} is now valid`);
                    }
                }
            });
        });

        const privacyCheckbox = contactForm.querySelector('input[name="privacy"]');
        privacyCheckbox.addEventListener('change', function() {
            const errorElement = document.getElementById('privacy-error');
            if (this.checked && errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                debugLog('✅ Privacy policy accepted');
            }
        });
    }

    /**
     * Handle form submission with REAL PHP backend
     */
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        debugLog('📤 Form submission started');
        debugLog('🌍 Current URL:', window.location.href);

        // Clear previous messages
        clearFieldErrors();
        formSuccess.style.display = 'none';
        formError.style.display = 'none';

        // Get form data
        const formData = new FormData(contactForm);
        
        // Debug: Show form data
        const formDataObj = {};
        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }
        debugLog('📝 Form data to send:', formDataObj);

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

        if (!isValid) {
            debugLog('❌ Validation failed, stopping submission');
            const firstError = contactForm.querySelector('.form-error.show');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        debugLog('✅ Validation passed, sending to PHP...');

        // Show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';

        try {
            debugLog('🌐 Making HTTP request to contact.php');
            
            const response = await fetch('contact.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            debugLog(`📡 Response received - Status: ${response.status} ${response.statusText}`);

            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Check content type
            const contentType = response.headers.get('content-type');
            debugLog(`📋 Content-Type: ${contentType}`);

            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                debugLog('⚠️ Non-JSON response received:', textResponse.substring(0, 200) + '...');
                
                // Try to show useful error to user
                if (textResponse.includes('Parse error') || textResponse.includes('Fatal error')) {
                    showErrorMessage('Server configuration error. Please contact support.');
                } else {
                    showErrorMessage('Server returned invalid response format. Please try again.');
                }
                return;
            }

            const result = await response.json();
            debugLog('📦 Parsed JSON response:', result);

            if (result.success) {
                debugLog('🎉 SUCCESS: Message sent successfully!');
                const userName = formData.get('name').trim();
                showSuccessMessage(result.message || `Thank you ${userName}! Your message has been sent successfully.`);
                
                // Reset form after 1.5 seconds
                setTimeout(() => {
                    contactForm.reset();
                    updateCharCounter();
                    debugLog('🔄 Form reset completed');
                }, 1500);
                
                // Track successful submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'contact',
                        event_label: 'success'
                    });
                }
                
            } else {
                debugLog('❌ ERROR: Server returned error:', result);
                
                if (result.errors) {
                    // Show field-specific errors
                    Object.keys(result.errors).forEach(fieldName => {
                        showFieldError(fieldName, result.errors[fieldName]);
                    });
                    
                    // Scroll to first error
                    const firstError = contactForm.querySelector('.form-error.show');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    showErrorMessage(result.message || 'An error occurred. Please try again.');
                }
                
                // Track failed submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'contact',
                        event_label: 'validation_error'
                    });
                }
            }

        } catch (error) {
            debugLog('💥 JavaScript error occurred:', error.toString());
            console.error('Complete error object:', error);
            
            // User-friendly error messages based on error type
            let userMessage = 'An unexpected error occurred. Please try again.';
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                userMessage = 'Unable to connect to server. Please check your internet connection.';
            } else if (error.message.includes('HTTP 404')) {
                userMessage = 'Contact form not properly configured. Please try again later.';
            } else if (error.message.includes('HTTP 403')) {
                userMessage = 'Access denied. Please refresh the page and try again.';
            } else if (error.message.includes('HTTP 500')) {
                userMessage = 'Server error. Please try again in a few minutes.';
            }
            
            showErrorMessage(userMessage);
            
            // Track network errors
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'contact',
                    event_label: 'network_error'
                });
            }
            
        } finally {
            // Always restore button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            debugLog('🔄 Button restored to normal state');
        }
    });

    // Initialize everything
    setupRealTimeValidation();
    debugLog('🎬 Production contact form initialized');

    // Character counter
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
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.closest('.form-group').classList.remove('focused');
        });

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

    // Form analytics
    let formStartTime = null;
    let fieldsInteracted = new Set();

    contactForm.addEventListener('focusin', function() {
        if (!formStartTime) {
            formStartTime = Date.now();
            debugLog('⏱️ User started interacting with form');
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
            const analytics = {
                mode: 'production',
                completionTime: Math.round(completionTime / 1000) + 's',
                fieldsInteracted: fieldsInteracted.size,
                totalFields: formInputs.length,
                timestamp: new Date().toISOString()
            };
            debugLog('📊 Form Analytics:', analytics);
            
            // Send to Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_interaction', {
                    event_category: 'contact',
                    custom_parameter_completion_time: analytics.completionTime,
                    custom_parameter_fields_used: analytics.fieldsInteracted
                });
            }
        }
    });
});