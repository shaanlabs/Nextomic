// Demo Page JavaScript

// EMI Calculator
function calculateEMI() {
    const principal = parseFloat(document.getElementById('loanAmount').value);
    const annualRate = parseFloat(document.getElementById('interestRate').value);
    const years = parseFloat(document.getElementById('loanTenure').value);

    // Convert annual rate to monthly and percentage to decimal
    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = years * 12;

    // Calculate EMI using formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = emi * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Update results with animation
    animateValue('emiResult', 0, emi, 1000, '$');
    animateValue('interestResult', 0, totalInterest, 1000, '$');
    animateValue('totalResult', 0, totalPayment, 1000, '$');
}

// Animate numbers counting up
function animateValue(id, start, end, duration, prefix = '') {
    const element = document.getElementById(id);
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = prefix + current.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }, 16);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('Demo page loaded successfully!');

    // Calculate initial EMI
    if (document.getElementById('loanAmount')) {
        calculateEMI();
    }

    // Add input event listeners for real-time calculation
    const inputs = ['loanAmount', 'interestRate', 'loanTenure'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calculateEMI);
        }
    });

    // Animate progress bars on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.getAttribute('data-width') || entry.target.style.width;
            }
        });
    }, { threshold: 0.5 });

    // Observe all progress fills
    document.querySelectorAll('.progress-fill, .category-fill').forEach(el => {
        const width = el.style.width;
        el.setAttribute('data-width', width);
        el.style.width = '0%';
        observer.observe(el);
    });

    // Smooth scroll to demo sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    console.log('All demo features initialized!');
});
