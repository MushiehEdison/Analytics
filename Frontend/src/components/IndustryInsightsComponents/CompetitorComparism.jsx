import React, { useState, useEffect } from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const CompetitorComparisonPage = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("tech"); // Default to tech

  // Fetch rankings when industry changes
  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/industry-rankings/${selectedIndustry}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setRankings(response.data.rankings.map(item => ({
          rank: item.rank,
          name: `${item.name} (${item.symbol})`,
          performance: item.performance,
          price: item.price
        })));

      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch rankings");
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [selectedIndustry]);

  // Bubble chart data - SINGLE DEFINITION
  const bubbleData = {
    datasets: rankings.map((item, index) => ({
      label: item.name,
      data: [{
        x: index * 10,
        y: item.performance,
        r: Math.abs(item.performance) / 2
      }],
      backgroundColor: item.performance > 0
        ? 'rgba(75, 192, 192, 0.6)'
        : 'rgba(255, 99, 132, 0.6)'
    }))
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      {/* Main Comparison Chart */}
      <div style={{ flex: 3 }}>
        <h2>{selectedIndustry.toUpperCase()} Industry Rankings</h2>
        {loading ? (
          <p>Loading chart data...</p>
        ) : (
          <Bubble
            data={bubbleData}
            options={{
              scales: {
                y: {
                  title: { display: true, text: 'Performance (%)' }
                },
                x: {
                  display: false // Hide x-axis as it's just for spacing
                }
              }
            }}
          />
        )}
      </div>

      {/* Sidebar Ranking */}
      <div style={{ flex: 1, border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}>
        <h3>Top Companies</h3>
        <label>Industry:</label>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        >
          <option value="tech">Technology</option>
          <option value="retail">Retail</option>
          <option value="logistics">Logistics</option>
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {rankings.map((comp) => (
            <li
              key={comp.rank}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                borderBottom: "1px solid #eee",
                paddingBottom: "5px",
              }}
            >
              <span style={{
                fontWeight: "bold",
                marginRight: "10px",
                color: comp.performance > 0 ? 'green' : 'red'
              }}>
                #{comp.rank}
              </span>
              <span>{comp.name}</span>
              <span style={{ marginLeft: "auto" }}>
                {comp.performance > 0 ? '+' : ''}{comp.performance}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompetitorComparisonPage