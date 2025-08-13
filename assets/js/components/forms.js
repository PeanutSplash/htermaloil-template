// Forms Component for Heat Transfer Oil Solutions

import { getCurrentLanguage, translations } from '../translations.js';

// Form validation rules
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 50
    },
    phone: {
        required: true,
        pattern: /^[\+]?[0-9\s\-\(\)]{10,20}$/
    },
    email: {
        required: false,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    message: {
        required: false,
        maxLength: 1000
    }
};

// Validate single field
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true };

    const errors = [];

    // Required validation
    if (rules.required && (!value || value.trim().length === 0)) {
        errors.push(`${fieldName} is required`);
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim().length === 0) {
        return { isValid: errors.length === 0, errors };
    }

    // Length validations
    if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${fieldName} must be no more than ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${fieldName} format is invalid`);
    }

    return { isValid: errors.length === 0, errors };
}

// Validate entire form
function validateForm(formData) {
    const results = {};
    let isFormValid = true;

    Object.keys(validationRules).forEach(fieldName => {
        const value = formData[fieldName] || '';
        const validation = validateField(fieldName, value);
        results[fieldName] = validation;
        
        if (!validation.isValid) {
            isFormValid = false;
        }
    });

    return { isValid: isFormValid, fields: results };
}

// Get form data
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Get values from form elements
    const nameField = form.querySelector('#name');
    const phoneField = form.querySelector('#phone');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');
    
    if (nameField) data.name = nameField.value.trim();
    if (phoneField) data.phone = phoneField.value.trim();
    if (emailField) data.email = emailField.value.trim();
    if (messageField) data.message = messageField.value.trim();
    
    return data;
}

// Create email content
function createEmailContent(formData) {
    const subject = encodeURIComponent('Heat Transfer Oil System Retrofit Solution Inquiry');
    const body = encodeURIComponent(`Dear Heat Transfer Oil Solutions Team,

I am interested in your Heat Transfer Oil System Retrofit Solution and would like to request more information.

Contact Information:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Email: ${formData.email || 'Not provided'}

Requirements:
${formData.message || 'Please provide detailed information about your heat transfer oil system retrofit solution, including technical specifications, pricing, and implementation timeline.'}

I look forward to hearing from you soon.

Best regards,
${formData.name}`);

    return { subject, body };
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = getFormData(form);
    const validation = validateForm(formData);
    
    // Basic validation - at least name and phone required
    if (!formData.name || !formData.phone) {
        const currentLang = getCurrentLanguage();
        const errorMsg = translations[currentLang]['form-validation-error'] || 
                        'Please enter your name and contact phone number';
        alert(errorMsg);
        return;
    }
    
    try {
        // Create email content
        const { subject, body } = createEmailContent(formData);
        
        // Create mailto link
        const mailtoLink = `mailto:Peter.choy.wong@outlook.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        const currentLang = getCurrentLanguage();
        const successMsg = translations[currentLang]['form-success-message'] || 
                          'Email client has been opened. Please send the email to complete your inquiry!';
        alert(successMsg);
        
        // Reset form
        form.reset();
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('formSubmitted', {
            detail: { formData, success: true }
        }));
        
    } catch (error) {
        console.error('Error handling form submission:', error);
        alert('An error occurred. Please try again or contact us directly.');
    }
}

// Add real-time validation feedback
function addFieldValidation(field, fieldName) {
    if (!field) return;
    
    field.addEventListener('blur', function() {
        const value = this.value.trim();
        const validation = validateField(fieldName, value);
        
        // Remove existing validation classes
        this.classList.remove('border-red-500', 'border-green-500');
        
        // Add validation feedback
        if (value && !validation.isValid) {
            this.classList.add('border-red-500');
        } else if (value && validation.isValid) {
            this.classList.add('border-green-500');
        }
    });
    
    // Clear validation on focus
    field.addEventListener('focus', function() {
        this.classList.remove('border-red-500', 'border-green-500');
    });
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.querySelector('form');
    
    if (form) {
        // Add form submission handler
        form.addEventListener('submit', handleFormSubmission);
        
        // Add field validation
        const nameField = form.querySelector('#name');
        const phoneField = form.querySelector('#phone');
        const emailField = form.querySelector('#email');
        const messageField = form.querySelector('#message');
        
        addFieldValidation(nameField, 'name');
        addFieldValidation(phoneField, 'phone');
        addFieldValidation(emailField, 'email');
        addFieldValidation(messageField, 'message');
    }
}

// Initialize security features (disable right-click, etc.)
function initializeSecurityFeatures() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable common developer tool shortcuts
    document.addEventListener('keydown', function(e) {
        // Disable Ctrl+U (view source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
        }
        // Disable Ctrl+Shift+I (developer tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
        }
        // Disable F12 (developer tools)
        if (e.key === 'F12') {
            e.preventDefault();
        }
        // Disable Ctrl+Shift+C (inspect element)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
        }
        // Disable Ctrl+Shift+J (console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
        }
    });
}

// Main forms initialization function
export function initializeForms() {
    try {
        initializeFormValidation();
        initializeSecurityFeatures();
        
        console.log('Forms initialized successfully');
    } catch (error) {
        console.error('Error initializing forms:', error);
    }
}

// Export utility functions for external use
export {
    validateField,
    validateForm,
    getFormData,
    createEmailContent
};
