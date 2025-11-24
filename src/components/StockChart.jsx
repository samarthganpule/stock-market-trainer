import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

function StockChart({ labels, prices, symbol }) {
  const data = {
    labels,
    datasets: [
      {
        label: `${symbol} Price`,
        data: prices,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#06b6d4",
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#fff",
          font: {
            size: 16,
            weight: "bold",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(6, 182, 212, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#06b6d4",
        borderWidth: 2,
        padding: 16,
        displayColors: true,
        titleFont: {
          size: 16,
          weight: "bold",
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: function (context) {
            return `Price: $${context.parsed.y.toFixed(2)}`;
          },
          afterLabel: function(context) {
            const currentPrice = context.parsed.y;
            const previousPrice = context.dataIndex > 0 ? prices[context.dataIndex - 1] : currentPrice;
            const change = currentPrice - previousPrice;
            const changePercent = ((change / previousPrice) * 100).toFixed(2);
            if (context.dataIndex > 0) {
              return `Change: ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: "#a5b4fc",
          font: {
            size: 13,
            weight: "600",
          },
          callback: function (value) {
            return "$" + value.toFixed(2);
          },
          padding: 10,
        },
        grid: {
          color: "rgba(165, 180, 252, 0.15)",
          lineWidth: 1,
        },
        border: {
          color: "rgba(165, 180, 252, 0.3)",
        },
      },
      x: {
        ticks: {
          color: "#a5b4fc",
          font: {
            size: 12,
            weight: "600",
          },
          maxRotation: 45,
          minRotation: 45,
          padding: 10,
        },
        grid: {
          color: "rgba(165, 180, 252, 0.1)",
          lineWidth: 1,
        },
        border: {
          color: "rgba(165, 180, 252, 0.3)",
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };

  // Calculate price statistics
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const priceChange = prices[prices.length - 1] - prices[0];
  const priceChangePercent = ((priceChange / prices[0]) * 100).toFixed(2);

  return (
    <div className="glass-strong p-10 rounded-3xl shadow-2xl border-2 border-purple-500/40 hover-lift relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
        <div>
          <h3 className="text-3xl font-bold text-white flex items-center gap-4 mb-3">
            <span className="text-5xl animate-float">📊</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent gradient-animate drop-shadow-lg">
              {symbol} - Past 7 Days
            </span>
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Interactive Chart</span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-400">Hover for details</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-cyan-500/20 border-2 border-cyan-400/40 rounded-xl">
            <div className="text-xs text-cyan-300 font-semibold mb-1">High</div>
            <div className="text-lg font-bold text-cyan-200">${maxPrice.toFixed(2)}</div>
          </div>
          <div className="px-4 py-2 bg-purple-500/20 border-2 border-purple-400/40 rounded-xl">
            <div className="text-xs text-purple-300 font-semibold mb-1">Low</div>
            <div className="text-lg font-bold text-purple-200">${minPrice.toFixed(2)}</div>
          </div>
          <div className="px-4 py-2 bg-pink-500/20 border-2 border-pink-400/40 rounded-xl">
            <div className="text-xs text-pink-300 font-semibold mb-1">Avg</div>
            <div className="text-lg font-bold text-pink-200">${avgPrice.toFixed(2)}</div>
          </div>
          <div className={`px-4 py-2 border-2 rounded-xl ${
            priceChange >= 0 
              ? 'bg-green-500/20 border-green-400/40' 
              : 'bg-red-500/20 border-red-400/40'
          }`}>
            <div className={`text-xs font-semibold mb-1 ${priceChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              7-Day Change
            </div>
            <div className={`text-lg font-bold ${priceChange >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChangePercent}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 rounded-2xl border-2 border-gray-700/50 backdrop-blur-sm">
        <Line data={data} options={options} />
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
        <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
        <span>Live data updates every 30 seconds</span>
      </div>
    </div>
  );
}

export default StockChart;
