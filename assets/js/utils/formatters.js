// Data Formatting Utilities
const Formatters = {
    // Format currency with symbol
    currency(amount, currency = 'USD', decimals = 2) {
        const symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            INR: '₹',
            JPY: '¥'
        };

        const formatted = parseFloat(amount).toFixed(decimals);
        const withCommas = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${symbols[currency] || '$'}${withCommas}`;
    },

    // Format large numbers (1000 -> 1K, 1000000 -> 1M)
    compactNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // Format percentage
    percentage(value, decimals = 1) {
        return `${parseFloat(value).toFixed(decimals)}%`;
    },

    // Format date to readable format
    date(dateString, format = 'short') {
        const date = new Date(dateString);

        const formats = {
            short: { month: 'short', day: 'numeric', year: 'numeric' },
            long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' },
            full: { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        };

        return date.toLocaleDateString('en-US', formats[format] || formats.short);
    },

    // Relative time (2 days ago, 3 hours ago, etc.)
    relativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 30) return this.date(dateString);
        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        return 'Just now';
    },

    // Format phone number
    phone(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phoneNumber;
    },

    // Capitalize first letter
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Title case
    titleCase(str) {
        return str.toLowerCase().split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    },

    // Truncate text with ellipsis
    truncate(text, length = 50, suffix = '...') {
        if (text.length <= length) return text;
        return text.slice(0, length).trim() + suffix;
    },

    // Format file size
    fileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    // Format duration (seconds to readable format)
    duration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    },

    // Format credit card number
    creditCard(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        return cleaned.replace(/(\d{4})/g, '$1 ').trim();
    },

    // Mask sensitive data
    mask(value, visibleChars = 4, maskChar = '•') {
        if (value.length <= visibleChars) return value;
        const masked = maskChar.repeat(value.length - visibleChars);
        return masked + value.slice(-visibleChars);
    },

    // Format number with ordinal suffix (1st, 2nd, 3rd, etc.)
    ordinal(number) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = number % 100;
        return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }
};

// Export
if (typeof window !== 'undefined') {
    window.Formatters = Formatters;
}
