import React, { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";

const StrengthsWeaknesses = ({ apiEndpoint }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "chart"
  const [search, setSearch] = useState("");

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
            const response = await fetch('https://www.cbinsights.com');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  // Filtered data based on search input
  const filteredData = data.filter(
    (item) =>
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.strengths.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      item.weaknesses.some((w) => w.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Strengths & Weaknesses</h2>

      {/* Search and View Toggle */}
      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search by category or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.toggleContainer}>
          <button
            style={viewMode === "table" ? styles.activeButton : styles.toggleButton}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
          <button
            style={viewMode === "chart" ? styles.activeButton : styles.toggleButton}
            onClick={() => setViewMode("chart")}
          >
            Chart View
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : filteredData.length === 0 ? (
        <p style={styles.noData}>No matching data found.</p>
      ) : viewMode === "table" ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Strengths</th>
                <th>Weaknesses</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td style={styles.strengthsCell}>{item.strengths.join(", ")}</td>
                  <td style={styles.weaknessesCell}>{item.weaknesses.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Radar
          data={{
            labels: filteredData.map((item) => item.category),
            datasets: [
              {
                label: "Strengths",
                data: filteredData.map((item) => item.strengthScore),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
              },
              {
                label: "Weaknesses",
                data: filteredData.map((item) => item.weaknessScore),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: { r: { suggestedMin: 0, suggestedMax: 10 } },
          }}
        />
      )}
    </div>
  );
};

// Inline Styles for Responsive Design
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "900px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontSize: "24px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  searchInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  toggleContainer: {
    display: "flex",
    gap: "10px",
  },
  toggleButton: {
    padding: "10px 20px",
    backgroundColor: "#ddd",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  activeButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "auto",
  },
  strengthsCell: {
    color: "green",
  },
  weaknessesCell: {
    color: "red",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    color: "#666",
  },
};

export default StrengthsWeaknesses;
