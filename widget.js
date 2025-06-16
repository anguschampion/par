(function() {
    // --- Configuration ---
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
            return isCurrency ? '£0' : '0';
        }
        const formattedNum = Math.round(num).toLocaleString();
        return isCurrency ? `£${formattedNum}` : formattedNum;
    }

    function calculateAndDisplayCounter(counterElement, annualTotal) {
        const now = new Date();
        const millisecondsSinceStart = now.getTime() - START_DATE.getTime();
        const secondsSinceStart = millisecondsSinceStart / 1000;
        const yearFraction = secondsSinceStart / (365.25 * 24 * 60 * 60);
        const expectedCount = yearFraction * annualTotal;
        const type = counterElement.dataset.counterType;
        const isCurrency = type.startsWith('uk-economy') || type.startsWith('nhs');
        counterElement.textContent = formatNumber(expectedCount, isCurrency);
    }

    // --- Widget Initialization Function ---
    function initParCounterWidget(containerElementId) {
        const container = document.getElementById(containerElementId);
        if (!container) {
            console.error('PAR Counter Widget: Container element not found with ID:', containerElementId);
            return;
        }
        const widgetWidth = container.getAttribute('data-widget-width') || '500px';
        const widgetHeight = container.getAttribute('data-widget-height') || 'auto';
        const widgetBgColor = container.getAttribute('data-widget-background-color') || '#fff';

        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
#${containerElementId} {
    font-family: Arial, sans-serif;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    max-width: ${widgetWidth};
    height: ${widgetHeight};
    margin: 0 auto;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background-color: ${widgetBgColor};
    box-sizing: border-box;
    line-height: 1.5;
}

#${containerElementId} .par-counter-title {
    font-size: 15px;
    text-align: center;
    line-height: 1.3em;
    color: #ED5A5C;
    letter-spacing: 0.05em;
    margin-bottom: 20px;
    font-weight: bold;
}

#${containerElementId} .par-counter-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto 1fr 1fr 1fr;
    gap: 10px 15px;
}

#${containerElementId} .par-counter-metric-group,
#${containerElementId} .par-counter-sub-item {
    display: contents;
}
#${containerElementId} .par-counter-sub-label,
#${containerElementId} .par-counter-sub-item .par-counter-description { /* Hide mobile descriptions on desktop */
    display: none;
}

#${containerElementId} .par-counter-header-item {
    background-color: #0A1E2C;
    border-radius: 15px;
    padding: 15px 20px;
    text-align: center;
    color: #fff;
}
#${containerElementId} .par-counter-header-item .par-counter-label {
    font-size: 16px; letter-spacing: 0.15em; font-weight: bold; margin-bottom: 5px;
}
#${containerElementId} .par-counter-header-item .par-counter-description {
    font-size: 11px; color: #ED5A5C; font-weight: bold; display: block; /* Ensure desktop one is visible */
}

#${containerElementId} .par-counter-main-label {
    background-color: #0A1E2C; color: #fff; border: 1px solid #eee; border-radius: 15px;
    padding: 10px 15px; font-size: 14px; font-weight: bold; letter-spacing: 0.05em;
    text-align: center; display: flex; justify-content: center; align-items: center; min-height: 50px;
}

#${containerElementId} .par-counter-value-cell {
    background-color: #fff;
    color: #ED5A5C;
    border: 1px solid #eee;
    border-radius: 15px;
    padding: 10px 15px;
    font-family: 'Roboto Mono', monospace;
    font-size:28px;
    font-weight: bold;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 20px;
    min-width: 180px;
    width: 180px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    overflow: hidden;
}

/* Grid Placement for Desktop */
#${containerElementId} .par-header-addiction { grid-area: 1 / 2; }
#${containerElementId} .par-header-mental-health { grid-area: 1 / 3; }
#${containerElementId} #economy-group > .par-counter-main-label { grid-area: 2 / 1; }
#${containerElementId} [data-counter-type="uk-economy-addiction"] { grid-area: 2 / 2; }
#${containerElementId} [data-counter-type="uk-economy-mental-health"] { grid-area: 2 / 3; }
#${containerElementId} #nhs-group > .par-counter-main-label { grid-area: 3 / 1; }
#${containerElementId} [data-counter-type="nhs-addiction"] { grid-area: 3 / 2; }
#${containerElementId} [data-counter-type="nhs-mental-health"] { grid-area: 3 / 3; }
#${containerElementId} #deaths-group > .par-counter-main-label { grid-area: 4 / 1; }
#${containerElementId} [data-counter-type="deaths-addiction"] { grid-area: 4 / 2; }
#${containerElementId} [data-counter-type="deaths-mental-health"] { grid-area: 4 / 3; }

#${containerElementId} .par-counter-footer {
    text-align: center; 
    color: #ED5A5C; 
    margin-top: 10px;
}
#${containerElementId} .par-counter-footer a {
    color: #ED5A5C; text-decoration: underline; font-size: 15px;
}

#${containerElementId} .qr-code-section { 
    display: flex; 
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

#${containerElementId} .qr-code-section p {
    margin: 10px 0;
    text-align: center;
}

#${containerElementId} .mobile-link {
    display: none;
}

/* --- Mobile Styles (max-width: 600px) --- */
@media (max-width: 600px) {
    #${containerElementId} { height: auto !important; }

    #${containerElementId} .par-counter-grid-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        grid-template-columns: none;
        grid-template-rows: none;
    }
    
    #${containerElementId} .par-counter-header-item { display: none; }

    #${containerElementId} .qr-code-section { 
        display: none; 
    }

    #${containerElementId} .par-qr-code { 
        display: none; 
    }

    #${containerElementId} .mobile-link {
        display: block;
        text-align: center;
        margin-top: 10px;
    }

    #${containerElementId} .par-counter-metric-group { 
        display: block;
        margin-bottom: 5px;
    }
    
    #${containerElementId} .par-counter-metric-group > .par-counter-main-label {
        padding: 5px 10px;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0.05em;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: unset;
        grid-area: auto;
        margin-bottom: 5px;
    }

    #${containerElementId} .par-counter-sub-item {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        margin-bottom: 5px;
        gap: 5px;
    }

    #${containerElementId} .par-counter-sub-label {
        display: block;
        font-size: 14px;
        font-weight: bold;
        color: #000;
        text-align: left;
    }
    
    #${containerElementId} .par-counter-sub-label-group {
        background-color: #fff;
        border-radius: 15px;
        padding: 5px 10px;
        text-align: left;
        color: #fff;
    }

    #${containerElementId} .par-counter-sub-item .par-counter-description {
        display: block;
        font-size: 12px;
        font-style: italic;
        color: #ED5A5C;
        font-weight: normal;
        margin-top: 2px;
    }
    
    #${containerElementId} .par-counter-metric-group .par-counter-value-cell {
        background: none;
        border: none;
        padding: 5px;
        text-align: right;
        min-height: unset;
        min-width: unset;
        font-size: 14px;
        justify-content: flex-end;
        grid-area: auto;
    }
}
        `;
        document.head.appendChild(styleTag);

        // --- UPDATED HTML Structure ---
        // Added descriptions to each sub-item for mobile view.
        const widgetHtml = `
            <div class="par-counter-title">
                SINCE 1ST JANUARY 2025, DEPRESSION, ANXIETY, EATING DISORDERS, ALCOHOLISM AND ADDICTION HAVE LED TO AT LEAST:
            </div>
            <div class="par-counter-grid-container">
                <div class="par-counter-header-item par-header-addiction">
                    <div class="par-counter-label">ADDICTION</div>
                    <div class="par-counter-description">Alcohol, smoking, substance abuse</div>
                </div>
                <div class="par-counter-header-item par-header-mental-health">
                    <div class="par-counter-label">MENTAL HEALTH</div>
                    <div class="par-counter-description">Depression, anxiety, eating disorders</div>
                </div>
                <div class="par-counter-metric-group" id="economy-group">
                    <div class="par-counter-main-label">COST TO THE UK ECONOMY</div>
                    <div class="par-counter-sub-item">
                        <div class="par-counter-sub-label-group">
                            <div class="par-counter-sub-label">ADDICTION</div>
                            <div class="par-counter-description">Alcohol, smoking, substance abuse</div>
                        </div>
                        <div class="par-counter-value-cell" data-counter-type="uk-economy-addiction">£0</div>
                    </div>
                    <div class="par-counter-sub-item">
                        <div class="par-counter-sub-label-group">
                            <div class="par-counter-sub-label">MENTAL HEALTH</div>
                            <div class="par-counter-description">Depression, anxiety, eating disorders</div>
                        </div>
                        <div class="par-counter-value-cell" data-counter-type="uk-economy-mental-health">£0</div>
                    </div>
                </div>
                <div class="par-counter-metric-group" id="nhs-group">
                    <div class="par-counter-main-label">COST TO THE NHS</div>
                    <div class="par-counter-sub-item">
                        <div class="par-counter-sub-label-group">
                            <div class="par-counter-sub-label">ADDICTION</div>
                            <div class="par-counter-description">Alcohol, smoking, substance abuse</div>
                        </div>
                        <div class="par-counter-value-cell" data-counter-type="nhs-addiction">£0</div>
                    </div>
                    <div class="par-counter-sub-item">
                         <div class="par-counter-sub-label-group">
                            <div class="par-counter-sub-label">MENTAL HEALTH</div>
                            <div class="par-counter-description">Depression, anxiety, eating disorders</div>
                        </div>
                        <div class="par-counter-value-cell" data-counter-type="nhs-mental-health">£0</div>
                    </div>
                </div>
                <div class="par-counter-metric-group" id="deaths-group">
                    <div class="par-counter-main-label">DEATHS</div>
                    <div class="par-counter-sub-item">
                        <div class="par-counter-sub-label-group">
                            <div class="par-counter-sub-label">ADDICTION</div>
                            <div class="par-counter-description">Alcohol, smoking, substance abuse</div>
                        </div>
                        <div class="par-counter-value-cell" data-counter-type="deaths-addiction">0</div>
                    </div>
                    <div class="par-counter-sub-item">
                        <div class="par-counter-sub-label-group">
                            <div class="par-counter-sub-label">MENTAL HEALTH</div>
                            <div class="par-counter-description">Depression, anxiety, eating disorders</div>
                        </div>
                        <div class="par-counter-value-cell" data-counter-type="deaths-mental-health">0</div>
                    </div>
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
                <div class="mobile-link">
                    <a href="https://www.par.global/cost-of-delay-methodology" target="_blank">CLICK TO SEE THE EVIDENCE</a>
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
                    calculateAndDisplayCounter(el, total);
                }
            });
        }

        updateAllCounters();
        setInterval(updateAllCounters, 100);
    }

    window.ParCounterWidget = {
        init: initParCounterWidget
    };
})();