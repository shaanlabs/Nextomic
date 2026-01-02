// Spending Analyzer - AI-Powered Expense Categorization and Insights
class SpendingAnalyzer {
    constructor() {
        this.categories = {
            'Food & Dining': { icon: 'utensils', color: '#ef4444', keywords: ['restaurant', 'food', 'cafe', 'grocery', 'meal', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger', 'starbucks', 'mcdonald', 'subway'] },
            'Transportation': { icon: 'car', color: '#3b82f6', keywords: ['uber', 'lyft', 'gas', 'fuel', 'parking', 'metro', 'bus', 'train', 'taxi', 'car', 'auto'] },
            'Entertainment': { icon: 'film', color: '#8b5cf6', keywords: ['netflix', 'spotify', 'movie', 'theater', 'concert', 'game', 'steam', 'ps', 'xbox', 'entertainment'] },
            'Shopping': { icon: 'shopping-bag', color: '#f59e0b', keywords: ['amazon', 'walmart', 'target', 'mall', 'store', 'shop', 'clothing', 'fashion', 'ebay'] },
            'Bills & Utilities': { icon: 'file-invoice', color: '#10b981', keywords: ['electric', 'water', 'gas', 'internet', 'phone', 'utility', 'bill', 'rent', 'mortgage'] },
            'Healthcare': { icon: 'heartbeat', color: '#ec4899', keywords: ['hospital', 'doctor', 'pharmacy', 'medical', 'health', 'medicine', 'dental', 'cvs', 'walgreens'] },
            'Education': { icon: 'graduation-cap', color: '#06b6d4', keywords: ['tuition', 'school', 'course', 'book', 'education', 'university', 'college'] },
            'Other': { icon: 'question', color: '#6b7280', keywords: [] }
        };

        this.expenses = SecureStorage.get('expenses', []);
    }

    // Auto-categorize expense based on description
    categorize(description) {
        const lowerDesc = description.toLowerCase();

        for (const [category, data] of Object.entries(this.categories)) {
            for (const keyword of data.keywords) {
                if (lowerDesc.includes(keyword)) {
                    return category;
                }
            }
        }

        return 'Other';
    }

    // Add expense
    addExpense(description, amount, date = new Date()) {
        const expense = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            date: date instanceof Date ? date.toISOString() : date,
            category: this.categorize(description),
            timestamp: new Date().toISOString()
        };

        this.expenses.push(expense);
        this.saveExpenses();
        return expense;
    }

    // Save to storage
    saveExpenses() {
        SecureStorage.set('expenses', this.expenses);
    }

    // Get expenses by date range
    getExpensesByRange(startDate, endDate) {
        return this.expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate >= startDate && expDate <= endDate;
        });
    }

    // Calculate category totals
    getCategoryTotals(expenses = null) {
        const data = expenses || this.expenses;
        const totals = {};

        Object.keys(this.categories).forEach(cat => {
            totals[cat] = 0;
        });

        data.forEach(exp => {
            totals[exp.category] += exp.amount;
        });

        return totals;
    }

    // Get spending insights
    getInsights() {
        const insights = [];
        const totals = this.getCategoryTotals();
        const total = Object.values(totals).reduce((sum, val) => sum + val, 0);

        // Find top category
        let topCategory = '';
        let topAmount = 0;
        for (const [cat, amount] of Object.entries(totals)) {
            if (amount > topAmount) {
                topAmount = amount;
                topCategory = cat;
            }
        }

        if (topAmount > 0) {
            const percentage = ((topAmount / total) * 100).toFixed(1);
            insights.push({
                type: 'warning',
                icon: 'exclamation-triangle',
                title: `Highest Spending: ${topCategory}`,
                message: `You spent ${Formatters.currency(topAmount)} (${percentage}%) on ${topCategory} this month.`
            });
        }

        // Check if food spending is high
        if (totals['Food & Dining'] > total * 0.35) {
            insights.push({
                type: 'tip',
                icon: 'lightbulb',
                title: 'Reduce Dining Out',
                message: `Food & Dining is ${((totals['Food &Dining'] / total) * 100).toFixed(0)}% of spending. Try meal planning to save $${Math.round(totals['Food & Dining'] * 0.2)}/month.`
            });
        }

        // Check for recurring expenses
        const subscriptions = this.detectSubscriptions();
        if (subscriptions.length > 0) {
            const subsTotal = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
            insights.push({
                type: 'info',
                icon: 'sync',
                title: 'Subscription Alert',
                message: `You have ${subscriptions.length} recurring subscriptions totaling ${Formatters.currency(subsTotal)}/month. Consider canceling unused ones.`
            });
        }

        // Spending trend
        const lastMonth = this.getLastMonthTotal();
        const thisMonth = this.getThisMonthTotal();
        if (lastMonth > 0) {
            const change = ((thisMonth - lastMonth) / lastMonth) * 100;
            if (Math.abs(change) > 10) {
                insights.push({
                    type: change > 0 ? 'warning' : 'success',
                    icon: change > 0 ? 'arrow-up' : 'arrow-down',
                    title: `Spending ${change > 0 ? 'Increased' : 'Decreased'}`,
                    message: `Your spending is ${Math.abs(change).toFixed(0)}% ${change > 0 ? 'higher' : 'lower'} than last month.`
                });
            }
        }

        return insights;
    }

    // Detect subscription payments
    detectSubscriptions() {
        const recurring = [];
        const descMap = {};

        this.expenses.forEach(exp => {
            const key = exp.description.toLowerCase().trim();
            if (!descMap[key]) {
                descMap[key] = [];
            }
            descMap[key].push(exp);
        });

        // Find expenses that repeat monthly with similar amounts
        for (const [desc, exps] of Object.entries(descMap)) {
            if (exps.length >= 2) {
                const amounts = exps.map(e => e.amount);
                const avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
                const variance = amounts.reduce((sum, a) => sum + Math.abs(a - avgAmount), 0) / amounts.length;

                if (variance < avgAmount * 0.05) { // Less than 5% variance
                    recurring.push({
                        description: exps[0].description,
                        amount: avgAmount,
                        frequency: exps.length,
                        category: exps[0].category
                    });
                }
            }
        }

        return recurring;
    }

    // Get this month's total
    getThisMonthTotal() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const monthExpenses = this.getExpensesByRange(startOfMonth, endOfMonth);
        return monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    }

    // Get last month's total
    getLastMonthTotal() {
        const now = new Date();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const lastMonthExpenses = this.getExpensesByRange(startOfLastMonth, endOfLastMonth);
        return lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    }

    // Generate weekly report
    getWeeklyReport() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekExpenses = this.getExpensesByRange(weekAgo, now);

        const total = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const daily = total / 7;
        const categories = this.getCategoryTotals(weekExpenses);

        return {
            total,
            daily,
            count: weekExpenses.length,
            categories,
            topDay: this.getTopSpendingDay(weekExpenses)
        };
    }

    // Get day with highest spending
    getTopSpendingDay(expenses) {
        const dayTotals = {};

        expenses.forEach(exp => {
            const day = new Date(exp.date).toDateString();
            if (!dayTotals[day]) {
                dayTotals[day] = 0;
            }
            dayTotals[day] += exp.amount;
        });

        let topDay = '';
        let topAmount = 0;
        for (const [day, amount] of Object.entries(dayTotals)) {
            if (amount > topAmount) {
                topAmount = amount;
                topDay = day;
            }
        }

        return { day: topDay, amount: topAmount };
    }

    // Clear all expenses
    clear() {
        this.expenses = [];
        this.saveExpenses();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.SpendingAnalyzer = SpendingAnalyzer;
}
