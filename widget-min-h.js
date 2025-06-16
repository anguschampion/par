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
      const widgetWidth = container.getAttribute("data-widget-width") || "500px";
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
          display: flex;
          flex-direction: column;
          justify-content: space-between;
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
        
        #${containerElementId} .par-counter-title a {
          color: #ED5A5C;
          text-decoration: none;
        }
  
        #${containerElementId} .par-counter-grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
  
        #${containerElementId} .par-counter-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
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
          min-width: 180px;
        }
  
        #${containerElementId} .par-counter-value-cell {
          background-color: #fff;
          color: #ED5A5C;
          border: 1px solid #eee;
          border-radius: 15px;
          padding: 10px 15px;
          font-family: 'Roboto Mono', monospace;
          font-size: 14px;
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
  
        /* --- Mobile Styles --- */
        @media (max-width: 600px) {
          #${containerElementId} {
            height: auto !important; /* Let height adjust to content */
            max-width: 100%;
          }
          
          #${containerElementId} .par-counter-grid-container {
            grid-template-columns: 1fr; /* Stack items vertically */
            gap: 15px; /* Space between rows */
          }
  
          #${containerElementId} .par-counter-item {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 10px;
            flex-direction: row;
          }
  
          #${containerElementId} .par-counter-header-item {
            background: none;
            border: none;
            padding: 0;
            justify-content: flex-start;
            text-align: left;
            min-height: unset;
          }
  
          #${containerElementId} .par-counter-header-item .par-counter-label {
            color: #0A1E2C;
          }
          
          #${containerElementId} .par-counter-value-cell {

        background: none;
        border: none;
        padding: 5px;
        text-align: right;
        min-height: unset;
        min-width: unset;
        width: auto;
        font-size: 14px;
        justify-content: flex-end;
        grid-area: auto;
        overflow: visible;



          }
        }
      `;
      document.head.appendChild(styleTag);
  
      // --- UPDATED HTML STRUCTURE ---
      // Each statistic is now wrapped in a "par-counter-item" div
      // for easier styling on both desktop and mobile.
      const widgetHtml = `
        <div class="par-counter-title">
          <a href="https://www.par.global/cost-of-delay-methodology" target="_blank">SINCE 1-1-2025, CONDITIONS TREATABLE BY PSILOCYBIN HAVE LED TO AT LEAST:</a>
        </div>
  
        <div class="par-counter-grid-container">
          <div class="par-counter-item">
            <div class="par-counter-header-item">
              <div class="par-counter-label">UK ECONOMY COST</div>
            </div>
            <div class="par-counter-value-cell" data-counter-type="economy">£0</div>
          </div>
  
          <div class="par-counter-item">
            <div class="par-counter-header-item">
              <div class="par-counter-label">NHS COST</div>
            </div>
            <div class="par-counter-value-cell" data-counter-type="nhs">£0</div>
          </div>
  
          <div class="par-counter-item">
            <div class="par-counter-header-item">
              <div class="par-counter-label">DEATHS</div>
            </div>
            <div class="par-counter-value-cell" data-counter-type="deaths">0</div>
          </div>
        </div>
      `;
  
      container.innerHTML = widgetHtml;
  
      const counterElements = container.querySelectorAll(".par-counter-value-cell");
  
      function updateAllCounters() {
        counterElements.forEach((el) => {
          const type = el.dataset.counterType;
          const total = TOTALS[type];
          if (total !== undefined) {
            calculateAndDisplayCounter(el, total);
          }
        });
      }
  
      // Update counters immediately and then every 100 milliseconds
      updateAllCounters();
      setInterval(updateAllCounters, 100);
    }
  
    // Expose the initialization function globally
    window.ParCounterWidget = {
      init: initParCounterWidget,
    };
  })();