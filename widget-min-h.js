(function () {
  // --- Configuration ---
  // You'll need to define the starting values and rates of increase.
  const START_DATE = new Date("2025-01-01T00:00:00Z"); // UTC to avoid timezone issues
  const TOTALS = {
    economy: 110500000000 + 49754000000, // Combined UK economy cost
    nhs: 6730000000 + 8175000000, // Combined NHS cost
    deaths: 78021 + 1667, // Combined deaths
  };

  // --- Helper Functions ---

  function formatNumber(num, isCurrency = false) {
    if (typeof num !== "number" || isNaN(num)) {
      return isCurrency ? "£0" : "0"; // Handle invalid numbers gracefully
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
    const isCurrency = type.startsWith("economy") || type.startsWith("nhs");

    // Update the element's text content
    counterElement.textContent = formatNumber(expectedCount, isCurrency);
  }

  // --- Widget Initialization Function ---
  function initParCounterWidget(containerElementId) {
    const container = document.getElementById(containerElementId);
    if (!container) {
      console.error(
        "PAR Counter Widget: Container element not found with ID:",
        containerElementId
      );
      return;
    }
    // --- Read Configuration from Data Attributes ---
    const widgetWidth = container.getAttribute("data-widget-width") || "500px"; // Default if not provided
    const widgetHeight =
      container.getAttribute("data-widget-height") || "100px";
    const widgetBgColor =
      container.getAttribute("data-widget-background-color") || "#fff";

    // Apply styles directly by injecting a <style> tag
    const styleTag = document.createElement("style");
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
                overflow: hidden;
            }

/* Scope all styles to the widget container by using the ID selector */
#${containerElementId} .par-counter-title {
    font-size: 14px;
    text-align: center;
    line-height: 1.3em;
    color: #ED5A5C;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
    font-weight: bold;
}

#${containerElementId} .par-counter-grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px 5px;
    margin-bottom: 10px;
}

#${containerElementId} .par-counter-header-row {
    grid-column: 1 / -1;
    display: contents;
}

#${containerElementId} .par-counter-header-item {
    background-color: #0A1E2C;
    color: #fff;
    border: 1px solid #eee;
    border-radius: 15px;
    padding: 7px 10px;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 20px;
}

#${containerElementId} .par-counter-data-row {
    display: contents;
}

#${containerElementId} .par-counter-value-cell {
    background-color: #fff;
    color: #ED5A5C;
    border: 1px solid #eee;
    border-radius: 15px;
    padding: 10px 15px;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 20px;
    min-width:100px;
    font-variant-numeric: tabular-nums;
}

#${containerElementId} .par-counter-label {
    font-size: 12px;
    letter-spacing: 0.15em;
    color: #fff;
    font-weight: bold;
    margin-bottom: 5px;
}

#${containerElementId} .par-counter-footer {
    font-size: 14px;
    line-height: 1.3em;
    text-align: center;
    color: #ED5A5C;
    letter-spacing: 0.05em;
    margin-top: 10px;
}

#${containerElementId} .par-counter-footer p {
    font-size: 15px;
    color: #0A1E2C;
    font-family: 'Arial', sans-serif;
    line-height: 1.6em;
}

#${containerElementId} .par-counter-footer a {
    color: #ED5A5C;
    text-decoration: underline;
}
    #${containerElementId} .par-counter-empty-cell {
    grid-column: 1;
}

@media (max-width: 600px) {
    #${containerElementId} .par-counter-grid-container {
        grid-template-columns: 1fr;
    }
    #${containerElementId} .par-counter-header-item,
    #${containerElementId} .par-counter-value-cell {
        grid-column: auto !important;
        width: 100%;
        margin-bottom: 10px;
    }
    #${containerElementId} .par-counter-header-item {
        padding: 10px;
    }
    #${containerElementId} .par-counter-value-cell {
        text-align: center;
    }
}
        `;
    document.head.appendChild(styleTag);

    // Dynamically add widget structure
    const widgetHtml = `
            <div class="par-counter-title">
                <a class="par-counter-title" href="https://www.par.global/cost-of-delay-methodology" target="_blank">SINCE 1-1-2025, CONDITIONS TREATABLE BY PSILOCYBIN HAVE LED TO AT LEAST:</A>
            </div>

            <div class="par-counter-grid-container">
                <div class="par-counter-header-row">
                    <div class="par-counter-header-item">
                        <div class="par-counter-label">COST TO UK ECONOMY</div>
                    </div>
                    <div class="par-counter-header-item">
                        <div class="par-counter-label">COST TO THE NHS</div>
                    </div>
                    <div class="par-counter-header-item">
                        <div class="par-counter-label">DEATHS</div>
                    </div>
            
                </div>

                <div class="par-counter-data-row">
                    <div class="par-counter-value-cell" data-counter-type="economy">£0</div>
                    <div class="par-counter-value-cell" data-counter-type="nhs">£0</div>
                    <div class="par-counter-value-cell" data-counter-type="deaths">0</div>
                    
                </div>
            </div>

            
            </div>
        `;

    container.innerHTML = widgetHtml;

    const counterElements = container.querySelectorAll(
      ".par-counter-value-cell"
    );

    function updateAllCounters() {
      counterElements.forEach((el) => {
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
    init: initParCounterWidget,
  };
})();
