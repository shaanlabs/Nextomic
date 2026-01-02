// Budget Planner - Intelligent Budget Calculator
class BudgetPlanner {
    constructor() {
        this.budgetData = SecureStorage.get('budget', null);
        this.rules = {
            '50/30/20': { needs: 0.50, wants: 0.30, savings: 0.20 },
            '70/20/10': { needs: 0.70, wants: 0.20, savings: 0.10 },
            '80/20': { needs: 0.80, wants: 0, savings: 0.20 },
            'custom': { needs: 0, wants: 0, savings: 0 }
        };
    }

    // Create budget based on income
    createBudget(monthlyIncome, rule = '50/30/20', customRatios = null) {
        let ratios = this.rules[rule];

        if (rule === 'custom' && customRatios) {
            ratios = customRatios;
        }

        const budget = {
            income: monthlyIncome,
            rule: rule,
            needs: monthlyIncome * ratios.needs,
            wants: monthlyIncome * ratios.wants,
            savings: monthlyIncome * ratios.savings,
            categories: this.getDefaultCategories(monthlyIncome, ratios),
            created: new Date().toISOString()
        };

        this.budgetData = budget;
        this.save();
        return budget;
    }

    // Get default category allocations
    getDefaultCategories(income, ratios) {
        const needsAmount = income * ratios.needs;
        const wantsAmount = income * ratios.wants;

        return {
            housing: needsAmount * 0.35,
            transportation: needsAmount * 0.15,
            groceries: needsAmount * 0.12,
            utilities: needsAmount * 0.10,
            insurance: needsAmount * 0.10,
            healthcare: needsAmount * 0.08,
            debt_payments: needsAmount * 0.10,
            dining_out: wantsAmount * 0.30,
            entertainment: wantsAmount * 0.25,
            shopping: wantsAmount * 0.25,
            subscriptions: wantsAmount * 0.20,
            emergency_fund: income * ratios.savings * 0.40,
            retirement: income * ratios.savings * 0.35,
            goals: income * ratios.savings * 0.25
        };
    }

    // Calculate budget recommendations based on actual spending
    analyzeAndRecommend(actualSpending) {
        if (!this.budgetData) {
            return { error: 'No budget created yet' };
        }

        const analysis = {
            overBudget: [],
            underBudget: [],
            onTrack: [],
            totalOverage: 0,
            totalUnderUsed: 0
        };

        for (const [category, budgeted] of Object.entries(this.budgetData.categories)) {
            const actual = actualSpending[category] || 0;
            const difference = actual - budgeted;
            const percentDiff = budgeted > 0 ? (difference / budgeted) * 100 : 0;

            const item = {
                category,
                budgeted,
                actual,
                difference,
                percentDiff
            };

            if (Math.abs(percentDiff) < 5) {
                analysis.onTrack.push(item);
            } else if (difference > 0) {
                analysis.overBudget.push(item);
                analysis.totalOverage += difference;
            } else {
                analysis.underBudget.push(item);
                analysis.totalUnderUsed += Math.abs(difference);
            }
        }

        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis);

        return analysis;
    }

    // Generate actionable recommendations
    generateRecommendations(analysis) {
        const recs = [];

        // Over budget categories
        if (analysis.overBudget.length > 0) {
            analysis.overBudget.sort((a, b) => b.difference - a.difference);
            const top = analysis.overBudget[0];

            recs.push({
                priority: 'high',
                category: top.category,
                message: `You're $${top.difference.toFixed(2)} over budget on ${this.formatCategory(top.category)}. Consider reducing spending by ${Math.abs(top.percentDiff).toFixed(0)}%.`,
                action: `Set a weekly limit of $${((top.budgeted / 4)).toFixed(2)} to stay on track.`
            });
        }

        // Reallocation opportunities
        if (analysis.underBudget.length > 0 && analysis.overBudget.length > 0) {
            const underUsed = analysis.underBudget[0];
            const overSpent = analysis.overBudget[0];

            recs.push({
                priority: 'medium',
                category: 'reallocation',
                message: `You have $${Math.abs(underUsed.difference).toFixed(2)} unused in ${this.formatCategory(underUsed.category)}.`,
                action: `Consider reallocating some to ${this.formatCategory(overSpent.category)} where you're over budget.`
            });
        }

        // Savings rate check
        const savingsRate = (this.budgetData.savings / this.budgetData.income) * 100;
        if (savingsRate < 15) {
            recs.push({
                priority: 'medium',
                category: 'savings',
                message: `Your savings rate is ${savingsRate.toFixed(1)}%, below the recommended 20%.`,
                action: `Try to increase savings by $${((this.budgetData.income * 0.20) - this.budgetData.savings).toFixed(2)}/month.`
            });
        }

        // High discretionary spending
        const discretionary = (this.budgetData.wants / this.budgetData.income) * 100;
        if (discretionary > 35) {
            recs.push({
                priority: 'low',
                category: 'discretionary',
                message: `${discretionary.toFixed(0)}% of income goes to discretionary spending.`,
                action: 'Look for subscription services or entertainment costs you can reduce.'
            });
        }

        return recs;
    }

    // Format category name for display
    formatCategory(category) {
        return category.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Calculate how much can be saved based on goals
    calculateGoalContributions(goals) {
        if (!this.budgetData) return null;

        const availableForGoals = this.budgetData.categories.goals;
        const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

        return goals.map(goal => {
            const proportion = goal.targetAmount / totalGoalAmount;
            const monthlyContribution = availableForGoals * proportion;
            const monthsNeeded = Math.ceil(goal.targetAmount / monthlyContribution);

            return {
                name: goal.name,
                targetAmount: goal.targetAmount,
                monthlyContribution,
                monthsNeeded,
                completionDate: this.addMonths(new Date(), monthsNeeded)
            };
        });
    }

    // Helper: Add months to date
    addMonths(date, months) {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + months);
        return newDate;
    }

    // Get budget summary
    getSummary() {
        if (!this.budgetData) return null;

        return {
            income: this.budgetData.income,
            needs: this.budgetData.needs,
            wants: this.budgetData.wants,
            savings: this.budgetData.savings,
            rule: this.budgetData.rule,
            needsPercent: (this.budgetData.needs / this.budgetData.income) * 100,
            wantsPercent: (this.budgetData.wants / this.budgetData.income) * 100,
            savingsPercent: (this.budgetData.savings / this.budgetData.income) * 100
        };
    }

    // Save budget
    save() {
        SecureStorage.set('budget', this.budgetData);
    }

    // Load budget
    load() {
        this.budgetData = SecureStorage.get('budget', null);
        return this.budgetData;
    }

    // Clear budget
    clear() {
        this.budgetData = null;
        SecureStorage.remove('budget');
    }
}

// Export
if (typeof window !== 'undefined') {
    window.BudgetPlanner = BudgetPlanner;
}
