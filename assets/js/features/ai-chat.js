// AI Chat Assistant - Context-Aware Conversation Engine
class AIChat {
    constructor() {
        this.context = [];
        this.maxContextLength = 10;
        this.isProcessing = false;

        this.knowledge = {
            investment: [
                "For beginners, I recommend starting with diversified index funds like S&P 500 ETFs. They offer broad market exposure with low fees.",
                "Dollar-cost averaging is a great strategy - invest a fixed amount regularly regardless of market conditions to reduce timing risk.",
                "Consider your risk tolerance and time horizon. Longer timelines allow for more aggressive allocations in growth stocks.",
                "Dividend stocks can provide steady income while also appreciating in value. Look for companies with consistent dividend histories.",
                "International diversification is important. Consider allocating 10-30% to international stocks for global exposure."
            ],
            budget: [
                "Follow the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings and debt repayment.",
                "Track every expense for at least 30 days to understand your spending patterns. Our Spending Analyzer can help with this.",
                "Start by identifying and cutting unnecessary subscriptions. Most people have 3-5 they've forgotten about.",
                "Build an emergency fund first - aim for 3-6 months of expenses before aggressive investing or debt payoff.",
                "Automate your savings by setting up automatic transfers right after payday. 'Pay yourself first' is key."
            ],
            debt: [
                "Focus on high-interest debt first (avalanche method) or smallest balances first (snowball method) for psychological wins.",
                "Consider debt consolidation if you can secure a lower interest rate, but be careful not to accumulate new debt.",
                "Negotiate with creditors - many are willing to reduce interest rates or create payment plans if you reach out.",
                "Never ignore debt. It compounds rapidly. Even minimum payments are better than nothing while you formulate a plan.",
                "Once debt-free, redirect those payments to savings and investments. You're already used to living without that money."
            ],
            savings: [
                "Start with any amount - even $25/month builds the savings habit. Increase by 1% every time you get a raise.",
                "Use high-yield savings accounts for emergency funds. Online banks often offer better rates than traditional banks.",
                "Separate savings accounts for different goals (emergency, vacation, down payment) helps you stay organized.",
                "Aim to save at least 20% of your income - 10% for retirement, 10% for other goals.",
                "Take advantage of employer 401(k) matches - it's free money. Contribute at least enough to get the full match."
            ],
            retirement: [
                "Start as early as possible. Thanks to compound interest, starting at 25 vs 35 can mean hundreds of thousands more at retirement.",
                "Max out tax-advantaged accounts: 401(k), IRA, HSA. The tax savings are significant over decades.",
                "Use the rule of 110: subtract your age from 110 to get your stock allocation percentage. The rest in bonds.",
                "Consider Roth vs Traditional carefully. Roth = pay taxes now, Traditional = pay later. Choose based on current vs expected future tax bracket.",
                "Review and rebalance annually. Your target allocation drifts as markets move. Rebalancing keeps you on track."
            ],
            tools: [
                "Our AI Risk Assessment helps you understand your investment risk tolerance and get personalized allocation recommendations.",
                "The Spending Analyzer uses AI to automatically categorize your expenses and identify areas where you're overspending.",
                "Our Budget Planner calculates optimal budget allocations based on your income, expenses, and financial goals.",
                "The Investment Predictor shows potential growth scenarios for your investments based on historical data and your contributions.",
                "Fraud Detection monitors your financial activity patterns and alerts you to suspicious transactions in real-time."
            ],
            general: [
                "Financial literacy is a journey, not a destination. Keep learning and adjusting your strategies as your life changes.",
                "Avoid lifestyle inflation - when your income increases, increase savings proportionally rather than spending.",
                "Insurance is important: health, life (if dependents), disability. Don't overlook this essential financial protection.",
                "Estate planning isn't just for the wealthy. Everyone needs a will, beneficiary designations, and a power of attorney.",
                "Review your full financial picture quarterly: net worth, budget progress, investment performance, and goal tracking."
            ]
        };

        this.init();
    }

    init() {
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');
        const chatToggle = document.getElementById('chatToggle');
        const chatClose = document.getElementById('chatClose');
        const chatContainer = document.getElementById('chatContainer');

        if (chatToggle && chatContainer) {
            chatToggle.addEventListener('click', () => {
                chatContainer.classList.toggle('open');
                chatContainer.style.display = chatContainer.classList.contains('open') ? 'flex' : 'none';
                if (chatContainer.classList.contains('open')) {
                    chatInput.focus();
                }
            });
        }

        if (chatClose && chatContainer) {
            chatClose.addEventListener('click', () => {
                chatContainer.classList.remove('open');
                chatContainer.style.display = 'none';
            });
        }

        if (chatSend && chatInput) {
            chatSend.addEventListener('click', () => this.sendMessage());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();

        if (!message || this.isProcessing) return;

        // Add user message
        this.addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        this.isProcessing = true;
        this.showTypingIndicator();

        // Simulate processing delay (realistic feel)
        await this.delay(800 + Math.random() * 1200);

        // Get AI response
        const response = this.generateResponse(message);

        // Remove typing indicator
        this.hideTypingIndicator();

        // Add AI response
        this.addMessage(response, 'bot');

        // Update context
        this.updateContext(message, response);

        this.isProcessing = false;
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';

        messageDiv.innerHTML = `
            <div class="message-content">${this.formatMessage(text)}</div>
        `;

        chatMessages.appendChild(messageDiv);

        // Animate in
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatMessage(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        // Convert line breaks
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Detect intent
        let category = 'general';
        let confidence = 0.5;

        // Investment keywords
        if (lowerMessage.match(/invest|stock|portfolio|etf|fund|market|trading|dividend/i)) {
            category = 'investment';
            confidence = 0.9;
        }
        // Budget keywords
        else if (lowerMessage.match(/budget|spend|expense|money|afford|save/i)) {
            category = 'budget';
            confidence = 0.85;
        }
        // Debt keywords
        else if (lowerMessage.match(/debt|loan|credit|borrow|owe|payment|interest/i)) {
            category = 'debt';
            confidence = 0.9;
        }
        // Savings keywords
        else if (lowerMessage.match(/save|saving|emergency|rainy day|nest egg/i)) {
            category = 'savings';
            confidence = 0.85;
        }
        // Retirement keywords
        else if (lowerMessage.match(/retire|retirement|401k|ira|pension|roth/i)) {
            category = 'retirement';
            confidence = 0.9;
        }
        // Tools keywords
        else if (lowerMessage.match(/tool|feature|calculator|analyzer|assessment|planner/i)) {
            category = 'tools';
            confidence = 0.95;
        }

        // Select appropriate response
        const responses = this.knowledge[category];
        let response = responses[Math.floor(Math.random() * responses.length)];

        // Add context-aware prefix for natural conversation
        const prefixes = [
            "Great question! ",
            "I can help with that. ",
            "Based on my financial expertise, ",
            "Here's what I recommend: ",
            "Let me explain: "
        ];

        if (confidence > 0.7) {
            response = prefixes[Math.floor(Math.random() * prefixes.length)] + response;
        }

        // Add follow-up suggestion
        if (Math.random() > 0.6) {
            const followUps = [
                "\n\nWould you like me to explain more about this topic?",
                "\n\nWant to see how our tools can help with this?",
                "\n\nLet me know if you'd like specific examples!",
                "\n\nI can dive deeper into any aspect of this - just ask!"
            ];
            response += followUps[Math.floor(Math.random() * followUps.length)];
        }

        return response;
    }

    updateContext(userMessage, aiResponse) {
        this.context.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: new Date().toISOString()
        });

        // Maintain context window
        if (this.context.length > this.maxContextLength) {
            this.context.shift();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getContext() {
        return this.context;
    }

    clearContext() {
        this.context = [];
    }
}

// Initialize globally
if (typeof window !== 'undefined') {
    window.AIChat = AIChat;

    document.addEventListener('DOMContentLoaded', () => {
        window.aiChatInstance = new AIChat();
    });
}
