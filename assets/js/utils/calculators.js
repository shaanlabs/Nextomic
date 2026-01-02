// Financial Calculation Utilities
const Calculators = {
    // Calculate compound interest
    compoundInterest(principal, rate, time, frequency = 12) {
        // principal: initial amount
        // rate: annual interest rate (as decimal, e.g., 0.07 for 7%)
        // time: years
        // frequency: compounding frequency per year (12 = monthly, 4 = quarterly, 1 = annual)

        const amount = principal * Math.pow((1 + rate / frequency), frequency * time);
        return {
            finalAmount: Math.round(amount * 100) / 100,
            interest: Math.round((amount - principal) * 100) / 100,
            principal: principal
        };
    },

    // Calculate monthly payment for a loan
    loanPayment(principal, annualRate, years) {
        const monthlyRate = annualRate / 12;
        const numPayments = years * 12;

        if (monthlyRate === 0) {
            return principal / numPayments;
        }

        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
            (Math.pow(1 + monthlyRate, numPayments) - 1);

        return Math.round(payment * 100) / 100;
    },

    // Calculate loan amortization schedule
    amortizationSchedule(principal, annualRate, years) {
        const monthlyPayment = this.loanPayment(principal, annualRate, years);
        const monthlyRate = annualRate / 12;
        const numPayments = years * 12;

        let balance = principal;
        const schedule = [];

        for (let month = 1; month <= numPayments; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;

            schedule.push({
                month,
                payment: monthlyPayment,
                principal: Math.round(principalPayment * 100) / 100,
                interest: Math.round(interestPayment * 100) / 100,
                balance: Math.round(Math.max(0, balance) * 100) / 100
            });
        }

        return schedule;
    },

    // Calculate retirement savings needed
    retirementNeeded(currentAge, retirementAge, desiredAnnualIncome, lifeExpectancy = 90, inflationRate = 0.03) {
        const yearsInRetirement = lifeExpectancy - retirementAge;
        const yearsUntilRetirement = retirementAge - currentAge;

        // Adjust for inflation
        const futureAnnualIncome = desiredAnnualIncome * Math.pow(1 + inflationRate, yearsUntilRetirement);

        // Calculate total needed (simple calculation)
        const totalNeeded = futureAnnualIncome * yearsInRetirement;

        return {
            totalNeeded: Math.round(totalNeeded),
            futureAnnualIncome: Math.round(futureAnnualIncome),
            yearsToSave: yearsUntilRetirement,
            monthlyContribution: Math.round((totalNeeded / (yearsUntilRetirement * 12)) * 100) / 100
        };
    },

    // Calculate investment returns with regular contributions
    investmentGrowth(initialAmount, monthlyContribution, annualReturn, years) {
        const monthlyRate = annualReturn / 12;
        const months = years * 12;

        let balance = initialAmount;
        const history = [];

        for (let month = 1; month <= months; month++) {
            balance = balance * (1 + monthlyRate) + monthlyContribution;

            if (month % 12 === 0) {
                history.push({
                    year: month / 12,
                    balance: Math.round(balance * 100) / 100,
                    contributions: initialAmount + (monthlyContribution * month),
                    gains: Math.round((balance - initialAmount - (monthlyContribution * month)) * 100) / 100
                });
            }
        }

        return {
            finalBalance: Math.round(balance * 100) / 100,
            totalContributions: initialAmount + (monthlyContribution * months),
            totalGains: Math.round((balance - initialAmount - (monthlyContribution * months)) * 100) / 100,
            history: history
        };
    },

    // Calculate emergency fund needed
    emergencyFund(monthlyExpenses, months = 6) {
        return {
            recommended: monthlyExpenses * months,
            minimum: monthlyExpenses * 3,
            ideal: monthlyExpenses * 12
        };
    },

    // Calculate debt-to-income ratio
    debtToIncome(monthlyDebt, monthlyIncome) {
        if (monthlyIncome === 0) return 0;
        const ratio = (monthlyDebt / monthlyIncome) * 100;

        let rating = 'Excellent';
        if (ratio > 43) rating = 'Poor';
        else if (ratio > 36) rating = 'Fair';
        else if (ratio > 28) rating = 'Good';

        return {
            ratio: Math.round(ratio * 10) / 10,
            rating: rating,
            recommendation: this.getDTIRecommendation(ratio)
        };
    },

    getDTIRecommendation(ratio) {
        if (ratio <= 28) return 'Your debt-to-income ratio is excellent. You have good financial flexibility.';
        if (ratio <= 36) return 'Your debt-to-income ratio is good. Consider paying down debt to improve it further.';
        if (ratio <= 43) return 'Your debt-to-income ratio is manageable but high. Focus on reducing debt.';
        return 'Your debt-to-income ratio is high. Prioritize debt reduction immediately.';
    },

    // Calculate savings rate
    savingsRate(monthlyIncome, monthlySavings) {
        if (monthlyIncome === 0) return 0;
        const rate = (monthlySavings / monthlyIncome) * 100;

        let rating = 'Excellent';
        if (rate < 5) rating = 'Poor';
        else if (rate < 10) rating = 'Fair';
        else if (rate < 20) rating = 'Good';

        return {
            rate: Math.round(rate * 10) / 10,
            rating: rating,
            recommendation: this.getSavingsRateRecommendation(rate)
        };
    },

    getSavingsRateRecommendation(rate) {
        if (rate >= 20) return 'Excellent savings rate! You\'re on track for strong financial security.';
        if (rate >= 10) return 'Good savings rate. Try to increase to 20% or more for faster wealth building.';
        if (rate >= 5) return 'You\'re saving, but try to increase your rate. Start with the 20% rule.';
        return 'Your savings rate is low. Start with at least 5% and increase gradually.';
    },

    // Calculate asset allocation based on age (rule of thumb)
    assetAllocation(age, riskTolerance = 'moderate') {
        const baseStockPercent = 110 - age; // Conservative rule

        const adjustments = {
            conservative: -10,
            moderate: 0,
            aggressive: +10
        };

        let stockPercent = baseStockPercent + (adjustments[riskTolerance] || 0);
        stockPercent = Math.max(20, Math.min(90, stockPercent)); // Clamp between 20-90%

        const bondPercent = 100 - stockPercent;

        return {
            stocks: stockPercent,
            bonds: bondPercent,
            recommended: {
                stocks: Math.round(stockPercent * 0.6), // Large cap
                internationalStocks: Math.round(stockPercent * 0.3), // International
                smallCapStocks: Math.round(stockPercent * 0.1), // Small cap
                bonds: bondPercent
            }
        };
    },

    // Calculate tax bracket (simplified US example)
    estimateTaxes(income, filingStatus = 'single') {
        // 2024 tax brackets (simplified)
        const brackets = {
            single: [
                { limit: 11000, rate: 0.10 },
                { limit: 44725, rate: 0.12 },
                { limit: 95375, rate: 0.22 },
                { limit: 182100, rate: 0.24 },
                { limit: 231250, rate: 0.32 },
                { limit: 578125, rate: 0.35 },
                { limit: Infinity, rate: 0.37 }
            ]
        };

        let tax = 0;
        let previousLimit = 0;

        for (const bracket of brackets[filingStatus]) {
            if (income <= previousLimit) break;

            const taxableInBracket = Math.min(income - previousLimit, bracket.limit - previousLimit);
            tax += taxableInBracket * bracket.rate;
            previousLimit = bracket.limit;
        }

        return {
            totalTax: Math.round(tax),
            effectiveRate: Math.round((tax / income) * 1000) / 10,
            afterTax: Math.round(income - tax)
        };
    },

    // Calculate break-even point
    breakEven(fixedCosts, pricePerUnit, variableCostPerUnit) {
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        if (contributionMargin === 0) return Infinity;

        return Math.ceil(fixedCosts / contributionMargin);
    }
};

// Export
if (typeof window !== 'undefined') {
    window.Calculators = Calculators;
}
