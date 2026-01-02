// All-in-One Financial Calculator JavaScript

// Calculator Configurations
const calculators = {
    'home-loan': {
        title: 'Home Loan EMI Calculator',
        description: 'Calculate your monthly EMI, total interest, and loan details',
        icon: 'fas fa-house-user',
        tip: 'Making prepayments can significantly reduce your total interest burden and loan tenure.',
        inputs: [
            { id: 'loanAmount', label: 'Loan Amount', type: 'number', default: 5000000, min: 100000, max: 100000000, suffix: '₹' },
            { id: 'interestRate', label: 'Interest Rate', type: 'number', default: 8.5, min: 1, max: 20, step: 0.1, suffix: '%' },
            { id: 'loanTenure', label: 'Loan Tenure', type: 'number', default: 20, min: 1, max: 30, suffix: 'years' }
        ],
        calculate: function (inputs) {
            const P = inputs.loanAmount;
            const r = inputs.interestRate / 12 / 100;
            const n = inputs.loanTenure * 12;

            const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalAmount = emi * n;
            const totalInterest = totalAmount - P;

            return {
                cards: [
                    { label: 'Monthly EMI', value: formatCurrency(emi), sublabel: 'Per Month' },
                    { label: 'Total Interest', value: formatCurrency(totalInterest), sublabel: `Over ${inputs.loanTenure} years` },
                    { label: 'Total Payment', value: formatCurrency(totalAmount), sublabel: 'Principal + Interest' }
                ],
                chart: {
                    type: 'pie',
                    data: {
                        labels: ['Principal Amount', 'Total Interest'],
                        datasets: [{
                            data: [P, totalInterest],
                            backgroundColor: ['#FF6D1F', '#3B82F6']
                        }]
                    }
                }
            };
        }
    },

    'sip': {
        title: 'SIP Calculator',
        description: 'Calculate returns on your Systematic Investment Plan',
        icon: 'fas fa-calendar-alt',
        tip: 'SIP helps you benefit from rupee cost averaging and power of compounding.',
        inputs: [
            { id: 'monthlyInvestment', label: 'Monthly Investment', type: 'number', default: 5000, min: 500, max: 100000, suffix: '₹' },
            { id: 'expectedReturn', label: 'Expected Return Rate (p.a.)', type: 'number', default: 12, min: 1, max: 30, step: 0.5, suffix: '%' },
            { id: 'timePeriod', label: 'Time Period', type: 'number', default: 10, min: 1, max: 40, suffix: 'years' }
        ],
        calculate: function (inputs) {
            const P = inputs.monthlyInvestment;
            const r = inputs.expectedReturn / 12 / 100;
            const n = inputs.timePeriod * 12;

            const futureValue = P * (((Math.pow(1 + r, n)) - 1) / r) * (1 + r);
            const invested = P * n;
            const returns = futureValue - invested;

            return {
                cards: [
                    { label: 'Invested Amount', value: formatCurrency(invested), sublabel: `${n} months` },
                    { label: 'Estimated Returns', value: formatCurrency(returns), sublabel: `${inputs.expectedReturn}% p.a.` },
                    { label: 'Total Value', value: formatCurrency(futureValue), sublabel: 'Maturity Amount' }
                ],
                chart: {
                    type: 'doughnut',
                    data: {
                        labels: ['Invested Amount', 'Estimated Returns'],
                        datasets: [{
                            data: [invested, returns],
                            backgroundColor: ['#FF6D1F', '#10B981']
                        }]
                    }
                }
            };
        }
    },

    'fd': {
        title: 'Fixed Deposit (FD) Calculator',
        description: 'Calculate your FD maturity amount and interest earned',
        icon: 'fas fa-piggy-bank',
        tip: 'FD interest is taxable. Senior citizens often get 0.5% higher interest rates.',
        inputs: [
            { id: 'depositAmount', label: 'Deposit Amount', type: 'number', default: 100000, min: 1000, max: 10000000, suffix: '₹' },
            { id: 'interestRate', label: 'Interest Rate', type: 'number', default: 6.5, min: 1, max: 15, step: 0.1, suffix: '%' },
            { id: 'tenure', label: 'Tenure', type: 'number', default: 5, min: 1, max: 10, suffix: 'years' }
        ],
        calculate: function (inputs) {
            const P = inputs.depositAmount;
            const r = inputs.interestRate / 100;
            const t = inputs.tenure;

            // Compound Interest (Quarterly Compounding)
            const maturityAmount = P * Math.pow((1 + r / 4), 4 * t);
            const interest = maturityAmount - P;

            return {
                cards: [
                    { label: 'Deposit Amount', value: formatCurrency(P), sublabel: 'Principal' },
                    { label: 'Interest Earned', value: formatCurrency(interest), sublabel: `@ ${inputs.interestRate}%` },
                    { label: 'Maturity Amount', value: formatCurrency(maturityAmount), sublabel: `After ${t} years` }
                ],
                list: [
                    { label: 'Principal Deposited', value: formatCurrency(P) },
                    { label: 'Total Interest', value: formatCurrency(interest) },
                    { label: 'Maturity Value', value: formatCurrency(maturityAmount) }
                ]
            };
        }
    },

    'retirement': {
        title: 'Retirement Planning Calculator',
        description: 'Calculate the corpus needed for a comfortable retirement',
        icon: 'fas fa-calendar-day',
        tip: 'Start early and invest regularly to build a substantial retirement corpus.',
        inputs: [
            { id: 'currentAge', label: 'Current Age', type: 'number', default: 30, min: 18, max: 60, suffix: 'years' },
            { id: 'retirementAge', label: 'Retirement Age', type: 'number', default: 60, min: 50, max: 70, suffix: 'years' },
            { id: 'monthlyExpense', label: 'Current Monthly Expense', type: 'number', default: 50000, min: 10000, max: 500000, suffix: '₹' },
            { id: 'inflationRate', label: 'Inflation Rate', type: 'number', default: 6, min: 1, max: 15, step: 0.5, suffix: '%' },
            { id: 'expectedReturn', label: 'Expected Return', type: 'number', default: 10, min: 1, max: 20, step: 0.5, suffix: '%' }
        ],
        calculate: function (inputs) {
            const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
            const lifeExpectancy = 80;
            const yearsInRetirement = lifeExpectancy - inputs.retirementAge;

            // Future monthly expense at retirement
            const futureExpense = inputs.monthlyExpense * Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement);

            // Corpus needed at retirement
            const r = (inputs.expectedReturn - inputs.inflationRate) / 100 / 12;
            const n = yearsInRetirement * 12;
            const corpusNeeded = futureExpense * ((1 - Math.pow(1 + r, -n)) / r);

            // Monthly SIP needed
            const rSIP = inputs.expectedReturn / 100 / 12;
            const nSIP = yearsToRetirement * 12;
            const monthlySIP = (corpusNeeded * rSIP) / ((Math.pow(1 + rSIP, nSIP) - 1) * (1 + rSIP));

            return {
                cards: [
                    { label: 'Corpus Needed', value: formatCurrency(corpusNeeded), sublabel: 'At Retirement' },
                    { label: 'Monthly SIP Required', value: formatCurrency(monthlySIP), sublabel: `For ${yearsToRetirement} years` },
                    { label: 'Future Monthly Expense', value: formatCurrency(futureExpense), sublabel: 'At Retirement' }
                ]
            };
        }
    },

    'income-tax': {
        title: 'Income Tax Calculator',
        description: 'Calculate your income tax liability for the financial year',
        icon: 'fas fa-file-invoice',
        tip: 'Utilize tax-saving instruments under Section 80C to reduce your tax liability.',
        inputs: [
            { id: 'annualIncome', label: 'Annual Income', type: 'number', default: 1000000, min: 0, max: 100000000, suffix: '₹' },
            { id: 'deductions', label: 'Deductions (80C, 80D, etc.)', type: 'number', default: 150000, min: 0, max: 500000, suffix: '₹' },
            { id: 'regime', label: 'Tax Regime', type: 'select', options: ['Old Regime', 'New Regime'], default: 'Old Regime' }
        ],
        calculate: function (inputs) {
            const taxableIncome = inputs.annualIncome - (inputs.regime === 'Old Regime' ? inputs.deductions : 0);
            let tax = 0;

            // Simplified tax calculation (Old Regime)
            if (taxableIncome <= 250000) {
                tax = 0;
            } else if (taxableIncome <= 500000) {
                tax = (taxableIncome - 250000) * 0.05;
            } else if (taxableIncome <= 1000000) {
                tax = 12500 + (taxableIncome - 500000) * 0.20;
            } else {
                tax = 112500 + (taxableIncome - 1000000) * 0.30;
            }

            // Add cess
            const cess = tax * 0.04;
            const totalTax = tax + cess;

            return {
                cards: [
                    { label: 'Taxable Income', value: formatCurrency(taxableIncome), sublabel: 'After Deductions' },
                    { label: 'Tax Liability', value: formatCurrency(totalTax), sublabel: 'Including Cess' },
                    { label: 'Net Income', value: formatCurrency(inputs.annualIncome - totalTax), sublabel: 'After Tax' }
                ],
                list: [
                    { label: 'Gross Income', value: formatCurrency(inputs.annualIncome) },
                    { label: 'Deductions', value: formatCurrency(inputs.regime === 'Old Regime' ? inputs.deductions : 0) },
                    { label: 'Taxable Income', value: formatCurrency(taxableIncome) },
                    { label: 'Income Tax', value: formatCurrency(tax) },
                    { label: 'Health & Education Cess (4%)', value: formatCurrency(cess) },
                    { label: 'Total Tax Payable', value: formatCurrency(totalTax) }
                ]
            };
        }
    }

    // Add more calculators here as needed
};

// Default calculator templates for other types
const defaultCalculators = {
    'car-loan': 'home-loan',
    'personal-loan': 'home-loan',
    'education-loan': 'home-loan',
    'lumpsum': 'sip',
    'mutual-fund': 'sip',
    'rd': 'fd',
    'ppf': 'fd'
};

// Current calculator
let currentCalculator = 'home-loan';
let chartInstance = null;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeCalculator();
    attachEventListeners();
    loadCalculator('home-loan');
});

function initializeCalculator() {
    // Attach category toggle
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', function () {
            this.parentElement.classList.toggle('collapsed');
        });
    });

    // Attach calc item click
    document.querySelectorAll('.calc-item').forEach(item => {
        item.addEventListener('click', function () {
            const calcId = this.getAttribute('data-calc');
            loadCalculator(calcId);

            // Update active state
            document.querySelectorAll('.calc-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search functionality
    const searchInput = document.getElementById('calcSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            document.querySelectorAll('.calc-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }
}

function loadCalculator(calcId) {
    currentCalculator = calcId;

    // Get calculator config (or use default template)
    let config = calculators[calcId];
    if (!config && defaultCalculators[calcId]) {
        const templateId = defaultCalculators[calcId];
        config = { ...calculators[templateId] };
        // Customize title based on calcId
        config.title = calcId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Calculator';
    }

    if (!config) {
        console.error('Calculator not found:', calcId);
        return;
    }

    // Update header
    document.querySelector('.calc-icon').className = 'calc-icon ' + config.icon;
    document.getElementById('calcTitle').textContent = config.title;
    document.getElementById('calcDescription').textContent = config.description;
    document.getElementById('calculatorTip').textContent = config.tip;

    // Render inputs
    renderInputs(config.inputs);

    // Clear results
    document.getElementById('calculatorResults').innerHTML = '<div class="empty-state"><i class="fas fa-chart-bar"></i><p>Enter values and click Calculate</p></div>';

    // Hide chart
    document.getElementById('chartArea').style.display = 'none';
}

function renderInputs(inputs) {
    const container = document.getElementById('calculatorInputs');
    container.innerHTML = '';

    inputs.forEach(input => {
        const group = document.createElement('div');

        if (input.type === 'select') {
            group.className = 'input-group';
            group.innerHTML = `
                <label for="${input.id}">${input.label}</label>
                <select id="${input.id}">
                    ${input.options.map(opt => `<option value="${opt}" ${opt === input.default ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
            `;
        } else {
            group.className = 'slider-group';
            group.innerHTML = `
                <div class="slider-label">
                    <span>${input.label}</span>
                    <span class="slider-value" id="${input.id}Value">${input.default} ${input.suffix || ''}</span>
                </div>
                <input type="range" id="${input.id}" min="${input.min}" max="${input.max}" value="${input.default}" step="${input.step || 1}">
                <div class="slider-limits">
                    <span>${formatNumber(input.min)} ${input.suffix || ''}</span>
                    <span>${formatNumber(input.max)} ${input.suffix || ''}</span>
                </div>
            `;
        }

        container.appendChild(group);
    });

    // Attach slider listeners
    container.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', function () {
            const valueSpan = document.getElementById(this.id + 'Value');
            const suffix = this.parentElement.querySelector('.slider-limits span').textContent.split(' ')[1] || '';
            valueSpan.textContent = `${formatNumber(this.value)} ${suffix}`;
        });
    });
}

function calculate() {
    const config = calculators[currentCalculator] || calculators[defaultCalculators[currentCalculator]];
    if (!config) return;

    // Gather inputs
    const inputs = {};
    config.inputs.forEach(input => {
        const element = document.getElementById(input.id);
        inputs[input.id] = input.type === 'select' ? element.value : parseFloat(element.value);
    });

    // Calculate
    const results = config.calculate(inputs);

    // Display results
    displayResults(results);
}

function displayResults(results) {
    const container = document.getElementById('calculatorResults');
    container.innerHTML = '';

    if (results.cards) {
        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'result-cards';

        results.cards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'result-card';
            cardDiv.innerHTML = `
                <div class="result-label">${card.label}</div>
                <div class="result-value">${card.value}</div>
                ${card.sublabel ? `<div class="result-sublabel">${card.sublabel}</div>` : ''}
            `;
            cardsDiv.appendChild(cardDiv);
        });

        container.appendChild(cardsDiv);
    }

    if (results.list) {
        const listUl = document.createElement('ul');
        listUl.className = 'result-list';

        results.list.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="label">${item.label}</span><span class="value">${item.value}</span>`;
            listUl.appendChild(li);
        });

        container.appendChild(listUl);
    }

    // Display chart
    if (results.chart) {
        displayChart(results.chart);
    }
}

function displayChart(chartConfig) {
    const chartArea = document.getElementById('chartArea');
    const canvas = document.getElementById('resultChart');

    chartArea.style.display = 'block';

    // Destroy previous chart
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create new chart
    chartInstance = new Chart(canvas, {
        type: chartConfig.type,
        data: chartConfig.data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Utility Functions
function formatCurrency(value) {
    return '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatNumber(value) {
    return parseFloat(value).toLocaleString('en-IN');
}

function resetCalculator() {
    loadCalculator(currentCalculator);
}

function saveCalculation() {
    alert('Calculation saved! (Feature coming soon)');
}

function printResults() {
    window.print();
}

function attachEventListeners() {
    // Any additional event listeners
}
