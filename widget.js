(function() {
    // --- Configuration ---
    // You'll need to define the starting values and rates of increase.
    const START_DATE = new Date('2025-01-01T00:00:00Z'); // UTC to avoid timezone issues
    const TOTALS = {
        'uk-economy-addiction': 110500000000,
        'nhs-addiction': 6730000000,
        'deaths-addiction': 78021,

        'uk-economy-mental-health': 49754000000,
        'nhs-mental-health': 8175000000,
        'deaths-mental-health': 1667
    };

    // --- Helper Functions ---

    function formatNumber(num, isCurrency = false) {
        if (typeof num !== 'number' || isNaN(num)) {
            return isCurrency ? '£0' : '0'; // Handle invalid numbers gracefully
        }
        // Use toLocaleString for comma formatting
        const formattedNum = Math.round(num).toLocaleString();
        return isCurrency ? `£${formattedNum}` : formattedNum;
    }

    /**
     * Calculates the current value for a counter based on an annual total
     * and the time elapsed since the START_DATE.
     * @param {HTMLElement} counterElement - The DOM element to update.
     * @param {number} annualTotal - The total value expected per year.
     */
    function calculateAndDisplayCounter(counterElement, annualTotal) {
        const now = new Date();
        const millisecondsSinceStart = now.getTime() - START_DATE.getTime();
        const secondsSinceStart = millisecondsSinceStart / 1000;

        // Calculate the fraction of a year passed.
        // Using 365.25 days/year accounts for leap years on average.
        const yearFraction = secondsSinceStart / (365.25 * 24 * 60 * 60);

        // Calculate the current expected count.
        const expectedCount = yearFraction * annualTotal;

        // Determine if it's a currency display
        const type = counterElement.dataset.counterType;
        const isCurrency = type.startsWith('uk-economy') || type.startsWith('nhs');

        // Update the element's text content
        counterElement.textContent = formatNumber(expectedCount, isCurrency);
    }

    // --- Widget Initialization Function ---
    function initParCounterWidget(containerElementId) {
        const container = document.getElementById(containerElementId);
        if (!container) {
            console.error('PAR Counter Widget: Container element not found with ID:', containerElementId);
            return;
        }

        // Add CSS link if not already present
        if (!document.querySelector('link[href*="widget.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'widget.css';
            document.head.appendChild(link);
        }

        // Add widget class to container
        container.classList.add('par-counter-widget');

        // Dynamically add widget structure
        const widgetHtml = `
            <div class="par-counter-title">
                SINCE 1ST JANUARY 2025, DEPRESSION, ANXIETY, EATING DISORDERS, ALCOHOLISM AND ADDICTION HAVE LED TO AT LEAST:
            </div>

            <div class="par-counter-grid-container">
                <div class="par-counter-header-row">
                    <div class="par-counter-empty-cell"></div> <div class="par-counter-header-item">
                        <div class="par-counter-label">ADDICTION</div>
                        <div class="par-counter-description">Alcohol, smoking, &nbsp;substance abuse</div>
                    </div>
                    <div class="par-counter-header-item">
                        <div class="par-counter-label">MENTAL HEALTH</div>
                        <div class="par-counter-description">Depression, anxiety, eating disorders</div>
                    </div>
                </div>

                <div class="par-counter-data-row">
                    <div class="par-counter-label-cell">COST TO THE UK ECONOMY</div>
                    <div class="par-counter-value-cell" data-counter-type="uk-economy-addiction">£0</div>
                    <div class="par-counter-value-cell" data-counter-type="uk-economy-mental-health">£0</div>
                </div>
                <div class="par-counter-data-row">
                    <div class="par-counter-label-cell">COST TO THE NHS</div>
                    <div class="par-counter-value-cell" data-counter-type="nhs-addiction">£0</div>
                    <div class="par-counter-value-cell" data-counter-type="nhs-mental-health">£0</div>
                </div>
                <div class="par-counter-data-row">
                    <div class="par-counter-label-cell">DEATHS</div>
                    <div class="par-counter-value-cell" data-counter-type="deaths-addiction">0</div>
                    <div class="par-counter-value-cell" data-counter-type="deaths-mental-health">0</div>
                </div>
            </div>

            <div class="par-counter-footer">
                SCIENCE SUGGESTS PSILOCYBIN CAN HELP TO TREAT ALL THESE CONDITIONS.
                <br>Australia has rescheduled.
                <br>Americans and Canadians have access.
                <br>Due to government inaction
                <br>we continue to suffer.
                <div class="qr-code-section">
                    <img src="https://static.wixstatic.com/media/dbb738_1a365071da78481d82b0dfca69fb988e~mv2.png/v1/fill/w_76,h_74,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/QRnoBG.png" alt="QR Code" class="par-qr-code">
                    <p>SCAN QRC OR <a href="https://www.par.global/cost-of-delay-methodology" target="_blank">CLICK</a> TO SEE THE EVIDENCE</p>
                </div>
            </div>
        `;

        container.innerHTML = widgetHtml;

        const counterElements = container.querySelectorAll('.par-counter-value-cell');

        function updateAllCounters() {
            counterElements.forEach(el => {
                const type = el.dataset.counterType;
                const total = TOTALS[type];
                if (total !== undefined) {
                    // Pass the specific element and its total to the function
                    calculateAndDisplayCounter(el, total);
                }
            });
        }

        // Update counters immediately and then every 100 milliseconds for a smoother animation
        updateAllCounters();
        setInterval(updateAllCounters, 100);
    }

    // Expose the initialization function globally
    window.ParCounterWidget = {
        init: initParCounterWidget
    };
})();