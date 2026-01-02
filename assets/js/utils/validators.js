// Input Validation Utilities
const Validators = {
    // Email validation
    email(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            valid: regex.test(value),
            message: 'Please enter a valid email address'
        };
    },

    // Phone validation (US format)
    phone(value) {
        const cleaned = value.replace(/\D/g, '');
        const regex = /^\d{10}$/;
        return {
            valid: regex.test(cleaned),
            message: 'Please enter a valid 10-digit phone number'
        };
    },

    // Required field
    required(value) {
        const isValid = value !== null && value !== undefined && value.toString().trim() !== '';
        return {
            valid: isValid,
            message: 'This field is required'
        };
    },

    // Minimum length
    minLength(value, min) {
        const isValid = value && value.length >= min;
        return {
            valid: isValid,
            message: `Must be at least ${min} characters`
        };
    },

    // Maximum length
    maxLength(value, max) {
        const isValid = !value || value.length <= max;
        return {
            valid: isValid,
            message: `Must be no more than ${max} characters`
        };
    },

    // Number range
    numberRange(value, min, max) {
        const num = parseFloat(value);
        const isValid = !isNaN(num) && num >= min && num <= max;
        return {
            valid: isValid,
            message: `Must be between ${min} and ${max}`
        };
    },

    // Positive number
    positiveNumber(value) {
        const num = parseFloat(value);
        const isValid = !isNaN(num) && num > 0;
        return {
            valid: isValid,
            message: 'Must be a positive number'
        };
    },

    // Currency amount
    currency(value) {
        const regex = /^\d+(\.\d{1,2})?$/;
        return {
            valid: regex.test(value),
            message: 'Please enter a valid amount (e.g., 100.00)'
        };
    },

    // Date validation (YYYY-MM-DD)
    date(value) {
        const date = new Date(value);
        const isValid = date instanceof Date && !isNaN(date);
        return {
            valid: isValid,
            message: 'Please enter a valid date'
        };
    },

    // Future date
    futureDate(value) {
        const date = new Date(value);
        const now = new Date();
        const isValid = date > now;
        return {
            valid: isValid,
            message: 'Date must be in the future'
        };
    },

    // URL validation
    url(value) {
        try {
            new URL(value);
            return { valid: true, message: '' };
        } catch {
            return { valid: false, message: 'Please enter a valid URL' };
        }
    },

    // Custom regex
    pattern(value, pattern, message = 'Invalid format') {
        const regex = new RegExp(pattern);
        return {
            valid: regex.test(value),
            message: message
        };
    }
};

// Form validator class
class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.errors = {};
        this.rules = {};
    }

    // Add validation rule to a field
    addRule(fieldName, validations) {
        this.rules[fieldName] = validations;
    }

    // Validate single field
    validateField(fieldName, value) {
        const fieldRules = this.rules[fieldName];
        if (!fieldRules) return { valid: true };

        for (const rule of fieldRules) {
            const result = rule.validator(value, ...rule.params || []);
            if (!result.valid) {
                return { valid: false, message: result.message };
            }
        }

        return { valid: true };
    }

    // Validate entire form
    validate() {
        this.errors = {};
        let isValid = true;

        for (const [fieldName, rules] of Object.entries(this.rules)) {
            const input = this.form.querySelector(`[name="${fieldName}"]`);
            if (!input) continue;

            const result = this.validateField(fieldName, input.value);
            if (!result.valid) {
                this.errors[fieldName] = result.message;
                this.showError(input, result.message);
                isValid = false;
            } else {
                this.clearError(input);
            }
        }

        return isValid;
    }

    // Show error message
    showError(input, message) {
        input.classList.add('error');

        // Remove existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }

    // Clear error message
    clearError(input) {
        input.classList.remove('error');
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    // Get all errors
    getErrors() {
        return this.errors;
    }

    // Clear all errors
    clearAllErrors() {
        this.errors = {};
        this.form.querySelectorAll('.error').forEach(input => {
            this.clearError(input);
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.Validators = Validators;
    window.FormValidator = FormValidator;
}
