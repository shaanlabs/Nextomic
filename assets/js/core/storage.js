// Secure Storage Layer - Simulated encryption for demo purposes
class SecureStorage {
    constructor() {
        this.prefix = 'nextomic_';
        this.encryptionKey = 'demo_key_not_for_production'; // In production, use Web Crypto API
    }

    // Simple obfuscation (NOT real encryption - for demo only)
    obfuscate(data) {
        return btoa(JSON.stringify(data));
    }

    deobfuscate(data) {
        try {
            return JSON.parse(atob(data));
        } catch (e) {
            return null;
        }
    }

    // Save data securely
    set(key, value, options = {}) {
        const fullKey = this.prefix + key;
        const data = {
            value: value,
            timestamp: Date.now(),
            expires: options.expires || null
        };

        const obfuscated = this.obfuscate(data);
        localStorage.setItem(fullKey, obfuscated);
        return true;
    }

    // Retrieve data securely
    get(key, defaultValue = null) {
        const fullKey = this.prefix + key;
        const stored = localStorage.getItem(fullKey);

        if (!stored) return defaultValue;

        const data = this.deobfuscate(stored);
        if (!data) return defaultValue;

        // Check expiration
        if (data.expires && Date.now() > data.expires) {
            this.remove(key);
            return defaultValue;
        }

        return data.value;
    }

    // Remove data
    remove(key) {
        const fullKey = this.prefix + key;
        localStorage.removeItem(fullKey);
    }

    // Clear all Nextomic data
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    // Get all keys
    getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.replace(this.prefix, ''));
    }

    // Check if key exists
    has(key) {
        return this.get(key) !== null;
    }

    // Get storage size
    getStorageSize() {
        let size = 0;
        const keys = this.getAllKeys();
        keys.forEach(key => {
            const value = this.get(key);
            size += JSON.stringify(value).length;
        });
        return size; // bytes
    }
}

// Export as singleton
if (typeof window !== 'undefined') {
    window.SecureStorage = new SecureStorage();
}
