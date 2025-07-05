// ==========================
// Rohan Choudhary – SIP Calculator JS (Tailwind Version)
// ==========================

const investedEl = document.getElementById("invested");
const returnsEl = document.getElementById("returns");
const maturityEl = document.getElementById("maturity");
const resultSection = document.getElementById("result");
const chartSection = document.getElementById("chartSection");

let sipChart = null;

// Format number as INR (₹ + commas)
function formatINR(amount) {
  return "₹" + parseFloat(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 0
  });
}

// Main SIP Calculation
function calculateSIP() {
  const monthly = parseFloat(document.getElementById("monthly").value);
  const years = parseFloat(document.getElementById("years").value);
  const rate = parseFloat(document.getElementById("rate").value);

  if (!monthly || !years || !rate || monthly <= 0 || years <= 0 || rate <= 0) {
    alert("❌ Please enter valid values in all fields.");
    return;
  }

  const n = years * 12;
  const r = rate / 12 / 100;

  const maturity = monthly * ((Math.pow(1 + r, n) - 1) * (1 + r)) / r;
  const invested = monthly * n;
  const returns = maturity - invested;

  // Show values
  investedEl.textContent = formatINR(invested);
  returnsEl.textContent = formatINR(returns);
  maturityEl.textContent = formatINR(maturity);

  resultSection.classList.remove("hidden");
  chartSection.classList.remove("hidden");

  renderChart(invested, returns);
}

// Render Doughnut Chart
function renderChart(invested, returns) {
  const ctx = document.getElementById("sipChart").getContext("2d");

  if (sipChart) sipChart.destroy();

  sipChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Invested Amount", "Estimated Returns"],
      datasets: [{
        data: [invested, returns],
        backgroundColor: ["#4169E1", "#FFF44F"],
        hoverOffset: 10,
        borderColor: "#fff",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      animation: { animateScale: true },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: getLegendTextColor(),
            font: { size: 14 }
          }
        },
        tooltip: {
          callbacks: {
            label: context => `${context.label}: ₹${parseInt(context.raw).toLocaleString("en-IN")}`
          }
        }
      }
    }
  });
}

// Legend color for light/dark mode
function getLegendTextColor() {
  return document.documentElement.classList.contains("dark") ? "#f3f4f6" : "#333";
}

// Allow Enter key to trigger Calculate
document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    calculateSIP();
  }
});
