import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Importing chart.js components

const RiskIndicators = () => {
  const [activeRisks, setActiveRisks] = useState(true); // Toggle for active/inactive risks
  const [filter, setFilter] = useState("All"); // Filter by severity or category

  const risks = [
    {
      risk: "Low customer retention",
      severity: "High",
      category: "Market",
      impact: "Loss of revenue and market share",
      mitigation: "Implement customer loyalty programs and targeted marketing",
      status: "Active",
    },
    {
      risk: "Supply chain delays",
      severity: "Medium",
      category: "Operational",
      impact: "Product shortages and delayed deliveries",
      mitigation: "Diversify suppliers and improve inventory management",
      status: "Inactive",
    },
    {
      risk: "Regulatory changes",
      severity: "Low",
      category: "Regulatory",
      impact: "Possible compliance costs and operational adjustments",
      mitigation: "Monitor regulatory changes and adjust operations as needed",
      status: "Active",
    },
  ];

  const getColor = (severity) => {
    if (severity === "High") return "red";
    if (severity === "Medium") return "orange";
    return "green";
  };

  const toggleRiskStatus = () => setActiveRisks(!activeRisks);

  const filteredRisks = risks.filter((risk) => {
    if (filter === "All") return true;
    return risk.severity === filter || risk.category === filter;
  });

  const severityData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          risks.filter((risk) => risk.severity === "High").length,
          risks.filter((risk) => risk.severity === "Medium").length,
          risks.filter((risk) => risk.severity === "Low").length,
        ],
        backgroundColor: ["#FF6347", "#FFA500", "#32CD32"],
      },
    ],
  };

  const categoryData = {
    labels: [...new Set(risks.map((risk) => risk.category))],
    datasets: [
      {
        data: [
          risks.filter((risk) => risk.category === "Market").length,
          risks.filter((risk) => risk.category === "Operational").length,
          risks.filter((risk) => risk.category === "Regulatory").length,
        ],
        backgroundColor: ["#36a2eb", "#ffcd56", "#ff6384"],
      },
    ],
  };

  return (
    <div>
    <div className="container d-flex">
      {/* Pie Chart: Risk Distribution by Severity */}
          <div style={{ width: "40%", marginBottom: "40px" }}>
            <h4>Risk Severity Distribution</h4>
            <Pie data={severityData} />
          </div>

          {/* Bar Chart: Risk Distribution by Category */}
          <div className="mx-5" style={{ width: "100%", marginBottom: "0" }}>
            <h4>Risk Category Distribution</h4>
            <Bar data={categoryData} />
          </div>
    </div>
          

 {/* Filters and Toggle */}
 <div style={{ marginBottom: "20px" }}>
        <label htmlFor="filter">Filter by Severity or Category: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginRight: "20px" }}
        >
          <option value="All">All</option>
          <option value="High">High Severity</option>
          <option value="Medium">Medium Severity</option>
          <option value="Low">Low Severity</option>
          <option value="Market">Market</option>
          <option value="Operational">Operational</option>
          <option value="Regulatory">Regulatory</option>
        </select>
        <button onClick={toggleRiskStatus}>
          {activeRisks ? "Show Inactive Risks" : "Show Active Risks"}
        </button>
      </div>

      {/* Risk Table with Expandable Rows */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Risk</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Severity</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Category</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Impact</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Mitigation Strategy</th>
          </tr>
        </thead>
        <tbody>
          {filteredRisks
            .filter((risk) => (activeRisks ? risk.status === "Active" : true))
            .map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.risk}</td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: getColor(item.severity),
                    fontWeight: "bold",
                  }}
                >
                  {item.severity}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.category}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.status}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.impact}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.mitigation}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskIndicators;
