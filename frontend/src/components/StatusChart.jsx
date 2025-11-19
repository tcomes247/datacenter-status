import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function StatusChart({ history }) {
  const data = {
    labels: history.map(h => h.time),
    datasets: [
      {
        label: "Server Status (1 = Up, 0 = Down)",
        data: history.map(h => (h.status === "Up" ? 1 : 0)),
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return <Line data={data} />;
}
