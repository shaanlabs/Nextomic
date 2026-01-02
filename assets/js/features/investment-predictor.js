// Investment Predictor - AI-Powered Growth Projections
class InvestmentPredictor {
    constructor() {
        this.historicalReturns = {
            stocks: { conservative: 0.07, moderate: 0.10, aggressive: 0.12 },
            bonds: { conservative: 0.03, moderate: 0.04, aggressive: 0.05 },
            mixed: { conservative: 0.05, moderate: 0.075, aggressive: 0.095 }
        };
    }

    // Calculate investment growth projection
    calculateProjection(params) {
        const {
            initialAmount,
            monthlyContribution,
            years,
            assetType = 'mixed',
            risk Tolerance = 'moderate'
        } = params;

        const annualReturn = this.historicalReturns[assetType][riskTolerance];
        const monthlyRate = annualReturn / 12;
        const months = years * 12;

        // Calculate scenarios
        const conservative = this.projectGrowth(initialAmount, monthlyContribution, months, monthlyRate * 0.7);
        const expected = this.projectGrowth(initialAmount, monthlyContribution, months, monthlyRate);
        const optimistic = this.projectGrowth(initialAmount, monthlyContribution, months, monthlyRate * 1.3);

        return {
            conservative,
            expected,
            optimistic,
            summary: this.generateSummary(initialAmount, monthlyContribution, years, expected),
            breakdown: this.generateYearlyBreakdown(initialAmount, monthlyContribution, months, monthlyRate)
        };
    }

    // Project growth with compound interest
    projectGrowth(initial, monthly, months, monthlyRate) {
        let balance = initial;
        let totalContributions = initial;

        for (let i = 0; i < months; i++) {
            balance = balance * (1 + monthlyRate) + monthly;
            totalContributions += monthly;
        }

        const totalGains = balance - totalContributions;

        return {
            finalBalance: Math.round(balance * 100) / 100,
            totalContributions,
            totalGains: Math.round(totalGains * 100) / 100,
            roi: totalContributions > 0 ? ((totalGains / totalContributions) * 100).toFixed(2) : 0
        };
    }

    // Generate yearly breakdown
    generateYearlyBreakdown(initial, monthly, totalMonths, monthlyRate) {
        const breakdown = [];
        let balance = initial;
        let contributions = initial;

        for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
            const monthsThisYear = Math.min(12, totalMonths - ((year - 1) * 12));

            for (let m = 0; m < monthsThisYear; m++) {
                balance = balance * (1 + monthlyRate) + monthly;
                contributions += monthly;
            }

            breakdown.push({
                year,
                balance: Math.round(balance * 100) / 100,
                contributions: Math.round(contributions * 100) / 100,
                gains: Math.round((balance - contributions) * 100) / 100
            });
        }

        return breakdown;
    }

    // Generate summary with insights
    generateSummary(initial, monthly, years, expected) {
        const totalInvested = initial + (monthly * years * 12);
        const gains = expected.totalGains;
        const avgMonthlyGain = gains / (years * 12);

        const insights = [];

        // Time value of money
        insights.push({
            icon: 'clock',
            title: 'Time is Your Asset',
            message: `Over ${years} years, compound interest can turn your $${Formatters.compactNumber(totalInvested)} into $${Formatters.compactNumber(expected.finalBalance)}.`
        });

        // Contribution power
        if (monthly > 0) {
            const contributionGains = expected.final Balance - totalInvested;
            insights.push({
                icon: 'chart-line',
                title: 'Consistency Pays Off',
                message: `Your regular $${monthly}/month contributions will generate approximately $${Formatters.compactNumber(contributionGains)} in gains.`
            });
        }

        // ROI comparison
        if (expected.roi > 50) {
            insights.push({
                icon: 'trophy',
                title: 'Strong Returns Expected',
                message: `With ${expected.roi}% ROI, you're on track for excellent wealth building. Stay the course!`
            });
        }

        return {
            totalInvested,
            expectedValue: expected.finalBalance,
            expectedGains: gains,
            avgMonthlyGain: Math.round(avgMonthlyGain * 100) / 100,
            roi: expected.roi,
            insights
        };
    }

    // Calculate required monthly contribution for a goal
    calculateRequiredContribution(targetAmount, years, riskTolerance = 'moderate') {
        const annualReturn = this.historicalReturns.mixed[riskTolerance];
        const monthlyRate = annualReturn / 12;
        const months = years * 12;

        // Use future value of annuity formula solved for payment
        // FV = PMT * ((1 + r)^n - 1) / r
        // PMT = FV * r / ((1 + r)^n - 1)

        const futureValue = targetAmount;
        const payment = futureValue * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);

        return {
            monthlyContribution: Math.round(payment * 100) / 100,
            totalContributions: Math.round(payment * months * 100) / 100,
            totalGains: targetAmount - (payment * months),
            years,
            targetAmount
        };
    }

    // Compare different investment scenarios
    compareScenarios(baseParams) {
        const scenarios = [];

        // Scenario 1: Start now
        scenarios.push({
            name: 'Start Today',
            ...this.calculateProjection(baseParams)
        });

        // Scenario 2: Wait 5 years
        if (baseParams.years > 5) {
            scenarios.push({
                name: 'Wait 5 Years',
                ...this.calculateProjection({
                    ...baseParams,
                    years: baseParams.years - 5
                })
            });
        }

        // Scenario 3: Double monthly contribution
        scenarios.push({
            name: 'Double Contributions',
            ...this.calculateProjection({
                ...baseParams,
                monthlyContribution: baseParams.monthlyContribution * 2
            })
        });

        // Calculate opportunity cost of waiting
        if (scenarios.length >= 2) {
            const opportunityCost = scenarios[0].expected.finalBalance - scenarios[1].expected.finalBalance;
            scenarios[1].opportunityCost = Math.round(opportunityCost);
        }

        return scenarios;
    }

    // Calculate retirement needs
    estimateRetirementNeeds(params) {
        const {
            currentAge,
            retirementAge = 65,
            desiredAnnualIncome = 50000,
            currentSavings = 0,
            lifeExpectancy = 90,
            inflation = 0.03
        } = params;

        const yearsToRetirement = retirementAge - currentAge;
        const yearsInRetirement = lifeExpectancy - retirementAge;

        // Adjust future income for inflation
        const futureAnnualIncome = desiredAnnualIncome * Math.pow(1 + inflation, yearsToRetirement);

        // Simplified calculation (ignores retirement account growth during drawdown)
        const totalNeeded = futureAnnualIncome * yearsInRetirement;

        // Calculate required monthly savings
        const required = this.calculateRequiredContribution(
            totalNeeded - currentSavings,
            yearsToRetirement,
            'moderate'
        );

        return {
            yearsToRetirement,
            yearsInRetirement,
            totalNeeded: Math.round(totalNeeded),
            currentSavings,
            gap: Math.round(totalNeeded - currentSavings),
            monthlyRequired: required.monthlyContribution,
            futureAnnualIncome: Math.round(futureAnnualIncome),
            confidence: yearsToRetirement > 10 ? 'high' : yearsToRetirement > 5 ? 'medium' : 'low'
        };
    }

    // Risk-adjusted returns
    calculateRiskAdjustedReturns(params) {
        const volatility = {
            conservative: 0.05,
            moderate: 0.15,
            aggressive: 0.25
        };

        const projection = this.calculateProjection(params);
        const stdDev = volatility[params.riskTolerance || 'moderate'];

        // Calculate confidence intervals (simplified)
        const expected = projection.expected.finalBalance;
        const range = expected * stdDev;

        return {
            expected,
            range68: { low: expected - range, high: expected + range }, // ~68% confidence
            range95: { low: expected - (2 * range), high: expected + (2 * range) }, // ~95% confidence
            recommendation: this.getRiskRecommendation(params.riskTolerance, params.years)
        };
    }

    // Get risk recommendation based on time horizon
    getRiskRecommendation(riskTolerance, years) {
        if (years < 3 && riskTolerance === 'aggressive') {
            return {
                type: 'warning',
                message: 'Aggressive strategy with short timeline (<3 years) increases risk of losses. Consider moderating risk.'
            };
        } else if (years > 20 && riskTolerance === 'conservative') {
            return {
                type: 'info',
                message: 'Long timeline (20+ years) allows for more aggressive growth. Consider increasing stock allocation.'
            };
        } else {
            return {
                type: 'success',
                message: 'Your risk tolerance aligns well with your investment timeline.'
            };
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.InvestmentPredictor = InvestmentPredictor;
}
