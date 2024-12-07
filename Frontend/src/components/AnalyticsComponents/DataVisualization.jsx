import React from "react";
import '../../App.css'
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function DataVisualization({ data, labels, title }) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  return (
    <div className="chartContainer">
      <h3 className="chartTitle  py-3">{title}</h3>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
}

export default DataVisualization;
