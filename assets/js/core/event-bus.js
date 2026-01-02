// Event Bus - Simple pub/sub for component communication
class EventBus {
    constructor() {
        this.events = {};
    }

    // Subscribe to an event
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    // Unsubscribe from an event
    off(event, callback) {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    // Emit an event
    emit(event, data) {
        if (!this.events[event]) return;

        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        });
    }

    // Subscribe once (auto-unsubscribe after first call)
    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    // Clear all listeners for an event
    clear(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
}

// State Manager - Simple state management
class StateManager {
    constructor() {
        this.state = {};
        this.listeners = {};
        this.history = [];
        this.maxHistory = 50;
    }

    // Get state value
    get(key, defaultValue = null) {
        return this.state.hasOwnProperty(key) ? this.state[key] : defaultValue;
    }

    // Set state value
    set(key, value) {
        const oldValue = this.state[key];

        // Add to history
        this.history.push({
            timestamp: Date.now(),
            key: key,
            oldValue: oldValue,
            newValue: value
        });

        // Maintain history limit
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        this.state[key] = value;

        // Notify listeners
        this.notify(key, value, oldValue);
    }

    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);

        // Return unsubscribe function
        return () => this.unsubscribe(key, callback);
    }

    // Unsubscribe from state changes
    unsubscribe(key, callback) {
        if (!this.listeners[key]) return;

        this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    }

    // Notify listeners of state change
    notify(key, newValue, oldValue) {
        if (!this.listeners[key]) return;

        this.listeners[key].forEach(callback => {
            try {
                callback(newValue, oldValue);
            } catch (error) {
                console.error(`Error in state listener for ${key}:`, error);
            }
        });
    }

    // Get entire state
    getAll() {
        return { ...this.state };
    }

    // Set multiple state values at once
    setMultiple(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    // Clear state
    clear() {
        const keys = Object.keys(this.state);
        keys.forEach(key => {
            this.set(key, null);
        });
    }

    // Get history
    getHistory(key = null) {
        if (key) {
            return this.history.filter(item => item.key === key);
        }
        return this.history;
    }

    // Compute derived state
    compute(dependencies, computeFn) {
        const values = dependencies.map(key => this.get(key));
        return computeFn(...values);
    }
}

// Export as singletons
if (typeof window !== 'undefined') {
    window.EventBus = new EventBus();
    window.StateManager = new StateManager();
}
