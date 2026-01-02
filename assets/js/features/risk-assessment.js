// Risk Assessment Tool - AI-Powered Financial Risk Profiling
class RiskAssessment {
    constructor() {
        this.questions = [
            {
                id: 1,
                category: 'time',
                question: 'What is your investment time horizon?',
                options: [
                    { text: 'Less than 3 years', score: 1, explanation: 'Short-term goal' },
                    { text: '3-5 years', score: 2, explanation: 'Mid-term goal' },
                    { text: '5-10 years', score: 3, explanation: 'Long-term goal' },
                    { text: 'More than 10 years', score: 4, explanation: 'Very long-term goal' }
                ]
            },
            {
                id: 2,
                category: 'financial',
                question: 'How much of your annual income can you invest?',
                options: [
                    { text: 'Less than 10%', score: 1, explanation: 'Limited capacity' },
                    { text: '10-20%', score: 2, explanation: 'Moderate capacity' },
                    { text: '20-30%', score: 3, explanation: 'Good capacity' },
                    { text: 'More than 30%', score: 4, explanation: 'Strong capacity' }
                ]
            },
            {
                id: 3,
                category: 'comfort',
                question: 'If your investment lost 20% in a month, what would you do?',
                options: [
                    { text: 'Sell immediately', score: 1, explanation: 'Very risk-averse' },
                    { text: 'Worry but hold', score: 2, explanation: 'Cautious' },
                    { text: 'Hold without worry', score: 3, explanation: 'Comfortable with volatility' },
                    { text: 'Buy more at lower price', score: 4, explanation: 'Opportunistic investor' }
                ]
            },
            {
                id: 4,
                category: 'experience',
                question: 'What is your investment experience level?',
                options: [
                    { text: 'Beginner', score: 1, explanation: 'New to investing' },
                    { text: 'Some experience', score: 2, explanation: '1-3 years' },
                    { text: 'Experienced', score: 3, explanation: '3-7 years' },
                    { text: 'Very experienced', score: 4, explanation: '7+ years' }
                ]
            },
            {
                id: 5,
                category: 'financial',
                question: 'Do you have an emergency fund covering 6 months of expenses?',
                options: [
                    { text: 'No emergency fund', score: 1, explanation: 'Build this first' },
                    { text: '1-3 months', score: 2, explanation: 'Getting there' },
                    { text: '3-6 months', score: 3, explanation: 'Almost ideal' },
                    { text: 'Yes, 6+ months', score: 4, explanation: 'Well prepared' }
                ]
            },
            {
                id: 6,
                category: 'comfort',
                question: 'What matters most to you?',
                options: [
                    { text: 'Preserving capital', score: 1, explanation: 'Safety first' },
                    { text: 'Stable modest returns', score: 2, explanation: 'Conservative growth' },
                    { text: 'Balanced growth', score: 3, explanation: 'Moderate risk' },
                    { text: 'Maximum growth', score: 4, explanation: 'Aggressive growth' }
                ]
            },
            {
                id: 7,
                category: 'time',
                question: 'When do you plan to retire?',
                options: [
                    { text: 'Within 5 years', score: 1, explanation: 'Soon' },
                    { text: '5-10 years', score: 2, explanation: 'Mid-term' },
                    { text: '10-20 years', score: 3, explanation: 'Long way' },
                    { text: 'More than 20 years', score: 4, explanation: 'Very long term' }
                ]
            },
            {
                id: 8,
                category: 'financial',
                question: 'How stable is your income?',
                options: [
                    { text: 'Irregular/uncertain', score: 1, explanation: 'Variable income' },
                    { text: 'Somewhat stable', score: 2, explanation: 'Some variation' },
                    { text: 'Very stable', score: 3, explanation: 'Predictable' },
                    { text: 'Multiple income streams', score: 4, explanation: 'Diversified income' }
                ]
            },
            {
                id: 9,
                category: 'experience',
                question: 'How comfortable are you with complex financial products?',
                options: [
                    { text: 'Not comfortable', score: 1, explanation: 'Stick to simple' },
                    { text: 'Somewhat comfortable', score: 2, explanation: 'Learning' },
                    { text: 'Very comfortable', score: 3, explanation: 'Knowledgeable' },
                    { text: 'Expert level', score: 4, explanation: 'Advanced investor' }
                ]
            },
            {
                id: 10,
                category: 'comfort',
                question: 'How do you typically make investment decisions?',
                options: [
                    { text: 'Always seek advice', score: 1, explanation: 'Guidance needed' },
                    { text: 'Research + advice', score: 2, explanation: 'Collaborative' },
                    { text: 'Mostly own research', score: 3, explanation: 'Self-directed' },
                    { text: 'Fully independent', score: 4, explanation: 'Confident decision-maker' }
                ]
            }
        ];

        this.currentQuestion = 0;
        this.answers = [];
        this.init();
    }

    init() {
        this.renderQuestion();
    }

    renderQuestion() {
        const container = document.getElementById('riskQuestionnaire');
        const question = this.questions[this.currentQuestion];

        container.innerHTML = `
            <div class="question-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((this.currentQuestion + 1) / this.questions.length) * 100}%"></div>
                </div>
                <div class="progress-text">Question ${this.currentQuestion + 1} of ${this.questions.length}</div>
            </div>

            <div class="question-content">
                <h3 class="question-text">${question.question}</h3>
                <div class="question-options">
                    ${question.options.map((option, index) => `
                        <button class="option-button" data-score="${option.score}" data-index="${index}">
                            <span class="option-text">${option.text}</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    `).join('')}
                </div>
            </div>

            ${this.currentQuestion > 0 ? `
                <div class="question-navigation">
                    <button class="btn btn-secondary" onclick"riskAssessment.previousQuestion()">
                        <i class="fas fa-chevron-left"></i>
                        Previous
                    </button>
                </div>
            ` : ''}
        `;

        // Add click handlers
        const buttons = container.querySelectorAll('.option-button');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const score = parseInt(btn.dataset.score);
                this.selectAnswer(score);
            });
        });
    }

    selectAnswer(score) {
        const question = this.questions[this.currentQuestion];
        this.answers[this.currentQuestion] = {
            questionId: question.id,
            category: question.category,
            score: score
        };

        // Animate transition
        const container = document.getElementById('riskQuestionnaire');
        container.style.opacity = '0';

        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion++;
                this.renderQuestion();
            } else {
                this.calculateResults();
            }
            container.style.opacity = '1';
        }, 300);
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
        }
    }

    calculateResults() {
        // Calculate overall score
        const totalScore = this.answers.reduce((sum, ans) => sum + ans.score, 0);
        const maxScore = this.questions.length * 4;
        const scorePercentage = (totalScore / maxScore) * 100;

        // Calculate category scores
        const categories = {
            time: this.getCategoryScore('time'),
            financial: this.getCategoryScore('financial'),
            comfort: this.getCategoryScore('comfort'),
            experience: this.getCategoryScore('experience')
        };

        // Determine risk profile
        let profile = '';
        let profileColor = '';
        if (scorePercentage < 30) {
            profile = 'Conservative';
            profileColor = '#10b981';
        } else if (scorePercentage < 50) {
            profile = 'Moderately Conservative';
            profileColor = '#3b82f6';
        } else if (scorePercentage < 70) {
            profile = 'Moderate';
            profileColor = '#f59e0b';
        } else if (scorePercentage < 85) {
            profile = 'Moderately Aggressive';
            profileColor = '#ef4444';
        } else {
            profile = 'Aggressive';
            profileColor = '#dc2626';
        }

        // Show results
        this.displayResults(scorePercentage, profile, profileColor, categories);

        // Save to storage
        SecureStorage.set('risk_profile', {
            score: scorePercentage,
            profile: profile,
            categories: categories,
            date: new Date().toISOString()
        });
    }

    getCategoryScore(category) {
        const categoryAnswers = this.answers.filter(ans => ans.category === category);
        if (categoryAnswers.length === 0) return 0;

        const total = categoryAnswers.reduce((sum, ans) => sum + ans.score, 0);
        const max = categoryAnswers.length * 4;
        return Math.round((total / max) * 100);
    }

    displayResults(score, profile, color, categories) {
        // Hide questionnaire, show results
        document.getElementById('riskQuestionnaire').style.display = 'none';
        const resultsDiv = document.getElementById('riskResults');
        resultsDiv.style.display = 'block';

        // Animate score circle
        this.animateScore(score, profile, color);

        // Display breakdown
        document.getElementById('timeHorizonValue').textContent = `${categories.time}%`;
        document.getElementById('financialCapacityValue').textContent = `${categories.financial}%`;
        document.getElementById('riskComfortValue').textContent = `${categories.comfort}%`;
        document.getElementById('experienceValue').textContent = `${categories.experience}%`;

        // Calculate and display asset allocation
        const allocation = this.calculateAllocation(score);
        this.displayAllocation(allocation);

        // Generate recommendations
        this.displayRecommendations(profile, score, categories);
    }

    animateScore(targetScore, profile, color) {
        const scoreNumber = document.getElementById('scoreNumber');
        const scoreLabel = document.getElementById('scoreLabel');
        const scoreFill = document.getElementById('scoreFill');

        scoreLabel.textContent = profile;
        scoreLabel.style.color = color;

        // Animate number
        let current = 0;
        const duration = 2000;
        const steps = 60;
        const increment = targetScore / steps;
        const stepDuration = duration / steps;

        const interval = setInterval(() => {
            current += increment;
            if (current >= targetScore) {
                current = targetScore;
                clearInterval(interval);
            }
            scoreNumber.textContent = Math.round(current);
        }, stepDuration);

        // Animate circle
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (targetScore / 100) * circumference;
        scoreFill.style.strokeDasharray = `${circumference} ${circumference}`;
        scoreFill.style.strokeDashoffset = circumference;
        scoreFill.style.stroke = color;

        setTimeout(() => {
            scoreFill.style.strokeDashoffset = offset;
        }, 100);
    }

    calculateAllocation(score) {
        // Calculate asset allocation based on risk score
        let stocks = 0;
        let bonds = 0;
        let cash = 0;

        if (score < 30) {
            stocks = 20;
            bonds = 60;
            cash = 20;
        } else if (score < 50) {
            stocks = 40;
            bonds = 50;
            cash = 10;
        } else if (score < 70) {
            stocks = 60;
            bonds = 35;
            cash = 5;
        } else if (score < 85) {
            stocks = 75;
            bonds = 20;
            cash = 5;
        } else {
            stocks = 90;
            bonds = 10;
            cash = 0;
        }

        return { stocks, bonds, cash };
    }

    displayAllocation(allocation) {
        const chartDiv = document.getElementById('allocationChart');
        const legendDiv = document.getElementById('allocationLegend');

        // Create bar chart
        chartDiv.innerHTML = `
            <div class="allocation-bar">
                <div class="allocation-segment stocks" style="width: ${allocation.stocks}%">${allocation.stocks}%</div>
                <div class="allocation-segment bonds" style="width: ${allocation.bonds}%">${allocation.bonds}%</div>
                ${allocation.cash > 0 ? `<div class="allocation-segment cash" style="width: ${allocation.cash}%">${allocation.cash}%</div>` : ''}
            </div>
        `;

        // Create legend
        legendDiv.innerHTML = `
            <div class="legend-item">
                <span class="legend-color stocks"></span>
                <span>Stocks (${allocation.stocks}%)</span>
            </div>
            <div class="legend-item">
                <span class="legend-color bonds"></span>
                <span>Bonds (${allocation.bonds}%)</span>
            </div>
            ${allocation.cash > 0 ? `
                <div class="legend-item">
                    <span class="legend-color cash"></span>
                    <span>Cash (${allocation.cash}%)</span>
                </div>
            ` : ''}
        `;
    }

    displayRecommendations(profile, score, categories) {
        const recDiv = document.getElementById('recommendationsList');

        const recommendations = this.generateRecommendations(profile, score, categories);

        recDiv.innerHTML = recommendations.map((rec, index) => `
            <div class="recommendation-card" style="animation-delay: ${index * 0.1}s">
                <div class="rec-icon ${rec.type}">
                    <i class="fas ${rec.icon}"></i>
                </div>
                <div class="rec-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
            </div>
        `).join('');
    }

    generateRecommendations(profile, score, categories) {
        const recs = [];

        // Based on profile
        if (profile === 'Conservative' || profile === 'Moderately Conservative') {
            recs.push({
                type: 'info',
                icon: 'fa-shield-alt',
                title: 'Focus on Capital Preservation',
                description: 'Prioritize low-risk investments like bonds, treasury securities, and stable dividend stocks. Consider certificates of deposit (CDs) for guaranteed returns.'
            });
        } else if (profile === 'Aggressive' || profile === 'Moderately Aggressive') {
            recs.push({
                type: 'warning',
                icon: 'fa-chart-line',
                title: 'Embrace Growth Opportunities',
                description: 'Your risk tolerance allows for higher growth potential. Consider growth stocks, emerging markets, and sector-specific funds. Maintain diversification despite aggressive stance.'
            });
        }

        // Based on time horizon
        if (categories.time < 40) {
            recs.push({
                type: 'info',
                icon: 'fa-clock',
                title: 'Short-Term Focus',
                description: 'With a shorter time horizon, prioritize liquidity and stability. Avoid high-volatility investments and focus on preserving capital you\'ll need soon.'
            });
        } else if (categories.time > 70) {
            recs.push({
                type: 'success',
                icon: 'fa-seedling',
                title: 'Long-Term Growth Advantage',
                description: 'Your long timeline allows you to weather market volatility. Take advantage by investing in growth-oriented assets that historically outperform over long periods.'
            });
        }

        // Based on experience
        if (categories.experience < 50) {
            recs.push({
                type: 'info',
                icon: 'fa-graduation-cap',
                title: 'Build Your Knowledge',
                description: 'Start with simple, diversified investments like index funds and ETFs. Gradually expand into more complex products as you gain experience and confidence.'
            });
        }

        // Based on financial capacity
        if (categories.financial < 40) {
            recs.push({
                type: 'warning',
                icon: 'fa-piggy-bank',
                title: 'Strengthen Your Foundation',
                description: 'Before aggressive investing, ensure you have a solid emergency fund and manageable debt levels. Start investing small amounts regularly to build the habit.'
            });
        }

        // Always add diversification
        recs.push({
            type: 'success',
            icon: 'fa-chart-pie',
            title: 'Diversify Your Portfolio',
            description: `As a ${profile} investor, spread your investments across different asset classes, sectors, and geographies to manage risk effectively.`
        });

        // Add rebalancing recommendation
        recs.push({
            type: 'info',
            icon: 'fa-sync-alt',
            title: 'Regular Rebalancing',
            description: 'Review and rebalance your portfolio quarterly or annually to maintain your target asset allocation and risk level.'
        });

        return recs.slice(0, 5); // Return top 5 recommendations
    }
}

// Initialize on page load
let riskAssessment;
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('riskQuestionnaire')) {
        riskAssessment = new RiskAssessment();
    }
});
