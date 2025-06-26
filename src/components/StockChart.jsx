import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function StockChart({ labels, prices, symbol }) {
  const data = {
    labels,
    datasets: [
      {
        label: `${symbol} - Past 7 Days`,
        data: prices,
        borderColor: "#3b82f6",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: false },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <Line data={data} options={options} />
    </div>
  );
}

export default StockChart;
