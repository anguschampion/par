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
        // --- Read Configuration from Data Attributes ---
        const widgetWidth = container.getAttribute('data-widget-width') || '500px'; // Default if not provided
        const widgetHeight = container.getAttribute('data-widget-height') || '100px';
        const widgetBgColor = container.getAttribute('data-widget-background-color') || '#fff';

        // Apply styles directly by injecting a <style> tag
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `

#${containerElementId} {
                font-family: Arial, sans-serif;
                padding: 20px;
                border: 1px solid #eee;
                border-radius: 8px;
                max-width: ${widgetWidth}; /* Use configured width */
                height: ${widgetHeight};   /* Use configured height */
                margin: 0 auto;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                background-color: ${widgetBgColor}; /* Use configured background color */
                box-sizing: border-box;
                line-height: 1.5;
                overflow: hidden; /* Prevent text overflow if height is fixed */
            }

.par-counter-widget {
    font-family: Arial, sans-serif;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    max-width: 700px;
    margin: 0 auto;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background-color: #fff;
    color: #333;
    box-sizing: border-box;
    line-height: 1.5;
}

/* Scope all styles to the widget container */
.par-counter-widget .par-counter-title {
    font-size: 15px;
    text-align: center;
    line-height: 1.3em;
    color: #ED5A5C;
    letter-spacing: 0.05em;
    margin-bottom: 20px;
    font-weight: bold;
}

.par-counter-widget .par-counter-grid-container {
    display: grid;
    grid-template-columns: 1fr repeat(2, 1fr);
    gap: 10px 15px;
    margin-bottom: 20px;
}

.par-counter-widget .par-counter-header-row {
    grid-column: 1 / -1;
    display: contents;
}

.par-counter-widget .par-counter-empty-cell {
    grid-column: 1;
}

.par-counter-widget .par-counter-header-item {
    background-color: #0A1E2C;
    border-radius: 15px;
    padding: 15px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
}

.par-counter-widget .par-counter-data-row {
    display: contents;
}

.par-counter-widget .par-counter-label-cell {
    background-color: #0A1E2C;
    color: #fff;
    border: 1px solid #eee;
    border-radius: 15px;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50px;
}

.par-counter-widget .par-counter-value-cell {
    background-color: #fff;
    color: #ED5A5C;
    border: 1px solid #eee;
    border-radius: 15px;
    padding: 10px 15px;
    font-family: 'Poppins', sans-serif;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    min-width:220px;
    font-variant-numeric: tabular-nums;
}

.par-counter-widget .par-counter-data-row:last-child .par-counter-value-cell {
    font-size: 32px;
}

.par-counter-widget .par-counter-label {
    font-size: 16px;
    letter-spacing: 0.15em;
    color: #fff;
    font-weight: bold;
    margin-bottom: 5px;
}

.par-counter-widget .par-counter-description {
    font-size: 11px;
    color: #ED5A5C;
    font-weight: bold;
    margin-bottom: 0;
}

.par-counter-widget .par-counter-footer {
    font-size: 15px;
    line-height: 1.3em;
    text-align: center;
    color: #ED5A5C;
    letter-spacing: 0.05em;
    margin-top: 20px;
}

.par-counter-widget .par-counter-footer p {
    font-size: 15px;
    color: #0A1E2C;
    font-family: 'Arial', sans-serif;
    line-height: 1.6em;
}

.par-counter-widget .par-counter-footer a {
    color: #ED5A5C;
    text-decoration: underline;
}

.par-counter-widget .qr-code-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.par-counter-widget .par-qr-code {
    width: 76px;
    height: 74px;
    margin-bottom: 10px;
}

.par-counter-widget .qr-code-section p {
    font-size: 12px;
    color: #ED5A5C;
    line-height: 1.2;
}

@media (max-width: 600px) {
    .par-counter-widget .par-counter-grid-container {
        grid-template-columns: 1fr;
    }
    .par-counter-widget .par-counter-empty-cell {
        display: none;
    }
    .par-counter-widget .par-counter-header-item,
    .par-counter-widget .par-counter-label-cell,
    .par-counter-widget .par-counter-value-cell {
        grid-column: auto !important;
        width: 100%;
        margin-bottom: 10px;
    }
    .par-counter-widget .par-counter-header-item {
        padding: 10px;
    }
    .par-counter-widget .par-counter-label-cell {
        text-align: center;
        margin-bottom: 5px;
    }
    .par-counter-widget .par-counter-value-cell {
        text-align: center;
    }
}
        `;
        document.head.appendChild(styleTag);

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