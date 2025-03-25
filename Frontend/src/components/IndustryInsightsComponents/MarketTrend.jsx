import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler);

const MarketTrends = () => {
  const [query, setQuery] = useState(""); // User's search input
  const [chartData, setChartData] = useState(null); // Dynamic chart data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [randomTrends, setRandomTrends] = useState(null); // Random market trends

  // Fetch random market trends on component mount
  useEffect(() => {
    const fetchRandomTrends = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/random-trends");
        const data = response.data;
        console.log("Random Trends API Response:", data); // Debugging

        const formattedData = {
          labels: data.dates,
          datasets: [
            {
              label: `Trends for "${data.query}"`,
              data: data.values,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        };
        setRandomTrends({ ...formattedData, explanation: data.explanation });
      } catch (err) {
        console.error("Failed to fetch random trends:", err);
      }
    };

    fetchRandomTrends();
  }, []);

  // Function to fetch Google Trends data
  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/google-trends?query=${query}`);
      const data = response.data;
      console.log("Search Trends API Response:", data); // Debugging

      const formattedData = {
        labels: data.dates,
        datasets: [
          {
            label: `Trends for "${query}"`,
            data: data.values,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      };
      setChartData({ ...formattedData, explanation: data.explanation });
    } catch (err) {
      setError("Failed to fetch market trends. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Market Trends</h2>

      {/* Search Box */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for trends (e.g., 'Bitcoin')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={fetchTrends} style={styles.searchButton}>
          Search
        </button>
      </div>

      {/* Random Market Trends Section */}
      <div style={styles.randomTrendsContainer}>
        <h3 style={styles.randomTrendsTitle}>What's Trending in the Market?</h3>
        {randomTrends ? (
          <div>
            <Line data={randomTrends} options={chartOptions} />
            <p style={styles.trendDescription}>{randomTrends.explanation}</p>
          </div>
        ) : (
          <p style={styles.placeholderText}>Loading random trends...</p>
        )}
      </div>

      {/* Chart Section */}
      <div style={styles.chartContainer}>
        {isLoading && <p style={styles.loadingText}>Loading...</p>}
        {error && <p style={styles.errorText}>{error}</p>}
        {chartData ? (
          <div>
            <Line data={chartData} options={chartOptions} />
            <p style={styles.trendDescription}>{chartData.explanation}</p>
          </div>
        ) : (
          <p style={styles.placeholderText}>Enter a query to see market trends.</p>
        )}
      </div>
    </div>
  );
};

// Chart.js options for clean and modern design
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: { font: { size: 14 }, color: "#333" },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      titleFont: { size: 14, weight: "bold" },
      bodyFont: { size: 12 },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 12 }, color: "#666" },
      title: {
        display: true,
        text: "Date",
        font: { size: 14, weight: "bold" },
      },
    },
    y: {
      grid: { color: "rgba(200, 200, 200, 0.3)", drawBorder: false },
      ticks: { font: { size: 12 }, color: "#666" },
      title: {
        display: true,
        text: "Interest Over Time",
        font: { size: 14, weight: "bold" },
      },
    },
  },
  elements: {
    line: { tension: 0.4 },
    point: { radius: 4, hoverRadius: 8 },
  },
};

// Inline styles
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontSize: "24px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  searchInput: {
    width: "60%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginRight: "10px",
  },
  searchButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  chartContainer: {
    padding: "20px",
    border: "1px solid #eee",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    marginBottom: "20px",
  },
  randomTrendsContainer: {
    padding: "20px",
    border: "1px solid #eee",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    marginBottom: "20px",
  },
  randomTrendsTitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontSize: "20px",
  },
  trendDescription: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    marginTop: "10px",
  },
  loadingText: {
    textAlign: "center",
    color: "#007BFF",
    fontSize: "16px",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: "16px",
  },
  placeholderText: {
    textAlign: "center",
    color: "#999",
    fontSize: "16px",
  },
};

export default MarketTrends;