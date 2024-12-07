import React, { useState } from "react";
import '../../App.css'
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function UserBehavior({ behaviorData }) {
  const [viewMode, setViewMode] = useState("chart");

  const chartData = {
    labels: behaviorData.map((item) => item.action),
    datasets: [
      {
        label: "User Actions",
        data: behaviorData.map((item) => item.count),
        backgroundColor: [
          "rgba(255,99,132,0.5)",
          "rgba(54,162,235,0.5)",
          "rgba(255,206,86,0.5)",
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54,162,235,1)",
          "rgba(255,206,86,1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="userBehaviorContainer p-5">
      <h3 className="title py-2">User Behavior Analysis</h3>
      <div className="viewButtons py-4">
        <button
          onClick={() => setViewMode("text")}
          className={viewMode === "text" ? "active" : ""}
        >
          Report
        </button>
        <button
          onClick={() => setViewMode("chart")}
          className={viewMode === "chart" ? "active" : ""}
        >
          View Chart 
        </button>
      </div>
      {viewMode === "text" ? (
        <ul>
          {behaviorData.map((item, index) => (
            <li key={index}>
              {item.action}: {item.count}
            </li>
          ))}
        </ul>
      ) : (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default UserBehavior;
