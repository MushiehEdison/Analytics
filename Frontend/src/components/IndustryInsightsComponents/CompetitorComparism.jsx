import React, { useState } from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const CompetitorComparisonPage = () => {
  const competitors = [
    { name: "Company A", logo: "https://via.placeholder.com/50", performance: 90, industry: "Tech" },
    { name: "Company B", logo: "https://via.placeholder.com/50", performance: 80, industry: "Retail" },
    { name: "Company C", logo: "https://via.placeholder.com/50", performance: 70, industry: "Logistics" },
    { name: "Company D", logo: "https://via.placeholder.com/50", performance: 85, industry: "Tech" },
    { name: "Company E", logo: "https://via.placeholder.com/50", performance: 65, industry: "Retail" },
  ];

  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // Filtered competitors for the sidebar
  const filteredCompetitors =
    selectedIndustry === "All"
      ? competitors
      : competitors.filter((comp) => comp.industry === selectedIndustry);

  // Bubble chart data
  const bubbleData = {
    datasets: competitors.map((comp, index) => ({
      label: comp.name,
      data: [{ x: Math.random() * 100, y: comp.performance, r: comp.performance / 10 }],
      backgroundColor: `rgba(${(index + 1) * 50}, ${(index + 2) * 40}, ${(index + 3) * 60}, 0.6)`,
    })),
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      {/* Main Comparison Chart */}
      <div style={{ flex: 3 }}>
        <h2>Competitor Comparison</h2>
        <Bubble data={bubbleData} />
      </div>

      {/* Sidebar Ranking */}
      <div style={{ flex: 1, border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}>
        <h3>Company Ranking</h3>
        <label>Filter by Industry:</label>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        >
          <option value="All">All Industries</option>
          <option value="Tech">Tech</option>
          <option value="Retail">Retail</option>
          <option value="Logistics">Logistics</option>
        </select>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredCompetitors
            .sort((a, b) => b.performance - a.performance)
            .map((comp, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "5px",
                }}
              >
                <img
                  src={comp.logo}
                  alt={comp.name}
                  style={{ width: "30px", height: "30px", marginRight: "10px", borderRadius: "50%" }}
                />
                <span>{comp.name}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CompetitorComparisonPage;
