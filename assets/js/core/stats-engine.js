// Stats Engine - Centralized statistics calculation and management
class StatsEngine {
    constructor() {
        this.storageKey = 'nextomic_stats';
        this.initializeStats();
    }

    initializeStats() {
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) {
            // Initialize with realistic demo data
            this.stats = {
                users: {
                    total: 12847,
                    active: 8923,
                    new_this_month: 1247
                },
                tools: {
                    chat_assistant: { uses: 45623, savings: 12500, rating: 4.8 },
                    spending_analyzer: { uses: 23451, savings: 8750, rating: 4.7 },
                    budget_planner: { uses: 18932, savings: 15600, rating: 4.9 },
                    investment_predictor: { uses: 12456, savings: 25800, rating: 4.6 },
                    fraud_detection: { uses: 8934, savings: 3200, rating: 4.5 },
                    portfolio_builder: { uses: 6723, savings: 18900, rating: 4.8 },
                    risk_assessment: { uses: 5621, savings: 7400, rating: 4.7 }
                },
                platform: {
                    total_savings: 92150,
                    avg_savings_per_user: 734,
                    total_transactions: 156789,
                    uptime: 99.8
                }
            };
            this.saveStats();
        } else {
            this.stats = JSON.parse(stored);
        }
    }

    saveStats() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    }

    // Calculate tool usage percentage
    calculateToolUsagePercent(toolId) {
        const tool = this.stats.tools[toolId];
        if (!tool) return 0;
        
        const totalUses = Object.values(this.stats.tools).reduce((sum, t) => sum + t.uses, 0);
        return ((tool.uses / totalUses) * 100).toFixed(1);
    }

    // Get favorite tool based on usage
    getFavoriteTool() {
        let maxUses = 0;
        let favTool = 'chat_assistant';
        
        for (const [toolId, data] of Object.entries(this.stats.tools)) {
            if (data.uses > maxUses) {
                maxUses = data.uses;
                favTool = toolId;
            }
        }
        
        return {
            id: favTool,
            name: this.formatToolName(favTool),
            usagePercent: this.calculateToolUsagePercent(favTool),
            uses: this.stats.tools[favTool].uses
        };
    }

    // Format tool ID to readable name
    formatToolName(toolId) {
        const names = {
            chat_assistant: 'AI Chat Assistant',
            spending_analyzer: 'Spending Analyzer',
            budget_planner: 'Budget Planner',
            investment_predictor: 'Investment Predictor',
            fraud_detection: 'Fraud Detection',
            portfolio_builder: 'Portfolio Builder',
            risk_assessment: 'Risk Assessment'
        };
        return names[toolId] || toolId;
    }

    // Get total savings across all tools
    getTotalSavings() {
        return Object.values(this.stats.tools).reduce((sum, tool) => sum + tool.savings, 0);
    }

    // Get total users
    getTotalUsers() {
        return this.stats.users.total;
    }

    // Increment tool usage
    incrementToolUsage(toolId, savingsAmount = 0) {
        if (this.stats.tools[toolId]) {
            this.stats.tools[toolId].uses++;
            if (savingsAmount > 0) {
                this.stats.tools[toolId].savings += savingsAmount;
            }
            this.saveStats();
        }
    }

    // Calculate monthly growth
    calculateMonthlyGrowth() {
        const newUsers = this.stats.users.new_this_month;
        const totalUsers = this.stats.users.total;
        return ((newUsers / (totalUsers - newUsers)) * 100).toFixed(1);
    }

    // Get platform stats
    getPlatformStats() {
        return {
            totalSavings: this.getTotalSavings(),
            totalUsers: this.getTotalUsers(),
            activeUsers: this.stats.users.active,
            monthlyGrowth: this.calculateMonthlyGrowth(),
            uptime: this.stats.platform.uptime
        };
    }

    // Update AI-powered results section
    updateAIResultsDisplay() {
        const favTool = this.getFavoriteTool();
        const totalSavings = this.getTotalSavings();
        const totalUsers = this.getTotalUsers();
        const activeUsers = this.stats.users.active;

        // Update favorite tool
        const favToolElement = document.querySelector('[data-stat="favorite-tool"]');
        if (favToolElement) {
            favToolElement.textContent = `${favTool.usagePercent}%`;
        }

        // Update total saved
        const totalSavedElement = document.querySelector('[data-stat="total-saved"]');
        if (totalSavedElement) {
            totalSavedElement.textContent = `$${totalSavings.toLocaleString()}`;
        }

        // Update number of users
        const usersElement = document.querySelector('[data-stat="total-users"]');
        if (usersElement) {
            usersElement.textContent = activeUsers.toLocaleString();
        }

        // Update benefit to users
        const benefitElement = document.querySelector('[data-stat="benefit-users"]');
        if (benefitElement) {
            const benefitPercent = ((activeUsers / totalUsers) * 100).toFixed(0);
            benefitElement.textContent = `${benefitPercent}%`;
        }
    }

    // Simulate realistic growth
    simulateGrowth() {
        // Add random small growth to make stats feel alive
        const randomIncrease = Math.floor(Math.random() * 5) + 1;
        this.stats.users.active += randomIncrease;
        this.stats.users.total += Math.floor(randomIncrease * 1.2);
        this.saveStats();
    }
}

// Export as singleton
if (typeof window !== 'undefined') {
    window.StatsEngine = new StatsEngine();
}
