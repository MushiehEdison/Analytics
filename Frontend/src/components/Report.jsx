import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import Alert from "./PageComponents/Alert";
import TopNavBar from "./navigation/TopNavBar";
import SideMenuBar from "./navigation/SideMenu";

function Report() {
  const [reportType, setReportType] = useState("Weekly");
  const [division, setDivision] = useState("Sales");

  const divisions = ["Sales", "Marketing", "Operations"];
  const reports = {
    Weekly: {
      Sales: { revenue: 5000, profit: 2000, satisfaction: 85 },
      Marketing: { revenue: 4000, profit: 1500, satisfaction: 78 },
      Operations: { revenue: 3000, profit: 1200, satisfaction: 80 },
    },
    Monthly: {
      Sales: { revenue: 20000, profit: 8000, satisfaction: 90 },
      Marketing: { revenue: 16000, profit: 6000, satisfaction: 82 },
      Operations: { revenue: 12000, profit: 4800, satisfaction: 83 },
    },
  };

  const handleToggle = () => {
    setReportType((prevType) => (prevType === "Weekly" ? "Monthly" : "Weekly"));
  };

  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
  };

  const reportData = reports[reportType][division];

  // Chart data
  const barChartData = {
    labels: ["Total Revenue", "Net Profit", "Customer Satisfaction"],
    datasets: [
      {
        label: `${division} - ${reportType} Metrics`,
        data: [reportData.revenue, reportData.profit, reportData.satisfaction],
        backgroundColor: ["#4CAF50", "#FFC107", "#2196F3"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Revenue", "Profit", "Satisfaction"],
    datasets: [
      {
        data: [reportData.revenue, reportData.profit, reportData.satisfaction],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <>
 {/* components /////////////////////////////////////////////////////////////// */}
 <div className="alerts">
            <Alert/>
          </div>
          <div className="navigation">
            <TopNavBar/>
            <SideMenuBar/>
          </div>
      <div className="reportSection p-4">
{/* Report /////////////////////////////////////////////////////////////////// */}
        <div className="rpt">
          <h1>{reportType} Reports</h1>
          <div className="controls">
            <button onClick={handleToggle}>Toggle Report: {reportType}</button>
            <select value={division} onChange={handleDivisionChange}>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          <div className="report-details">
            <h2>{division} Division - {reportType} Report</h2>
            <div className="metrics-table">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Revenue</td>
                    <td>${reportData.revenue}</td>
                  </tr>
                  <tr>
                    <td>Net Profit</td>
                    <td>${reportData.profit}</td>
                  </tr>
                  <tr>
                    <td>Customer Satisfaction</td>
                    <td>{reportData.satisfaction}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="charts">
              <div className="chart bar-chart">
                <h3>Revenue, Profit & Satisfaction</h3>
                <Bar data={barChartData} options={{ responsive: true }} />
              </div>
              <div className="chart pie-chart">
                <h3>Distribution</h3>
                <Pie data={pieChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;
