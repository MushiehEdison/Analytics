import React from "react";
import { Pie } from "react-chartjs-2";

const GrowthOpportunities = () => {
  const pieData = {
    labels: ["E-Commerce", "Tech Services", "Retail", "Logistics"],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: ["#36a2eb", "#ff6384", "#ffcd56", "#4bc0c0"],
      },
    ],
  };

  const opportunities = [
    {
      industry: "E-Commerce",
      opportunity: "Expanding online retail platforms",
      growth: "30%",
      risk: "Medium",
      investment: "High",
      action: "Invest in seamless user experiences and logistics support",
    },
    {
      industry: "Tech Services",
      opportunity: "AI & Automation Services",
      growth: "25%",
      risk: "Low",
      investment: "Medium",
      action: "Focus on R&D and partnerships with tech innovators",
    },
    {
      industry: "Retail",
      opportunity: "Sustainable Products",
      growth: "20%",
      risk: "High",
      investment: "Low",
      action: "Develop eco-friendly products and tap into growing demand",
    },
    {
      industry: "Logistics",
      opportunity: "Supply Chain Optimization",
      growth: "25%",
      risk: "High",
      investment: "Medium",
      action: "Focus on automation, data analytics, and partnerships",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h3>Growth Opportunities</h3>
    <div className="container d-flex">
         {/* Pie Chart */}
      <div className="col" style={{ width: "50%", marginBottom: "30px" }}>
        <Pie data={pieData} />
      </div>

      {/* Opportunities List */}
      <div className="col mx-5" style={{ marginBottom: "30px" }}>
        <h4>Industry Growth Opportunities</h4>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {opportunities.map((opp, index) => (
            <li key={index} style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
              <strong>{opp.industry}</strong>
              <p><em>{opp.opportunity}</em></p>
              <p>Growth: {opp.growth} | Risk: {opp.risk} | Investment: {opp.investment}</p>
              <p><strong>Action:</strong> {opp.action}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
      {/* Trend Analysis Table */}
      <div>
        <h4>Opportunity Metrics</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Industry</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Opportunity</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Growth</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Risk</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Investment</th>
              <th style={{ border: "1px solid #ddd", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{opp.industry}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{opp.opportunity}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{opp.growth}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{opp.risk}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{opp.investment}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{opp.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes Section */}
      <div style={{ marginTop: "30px" }}>
        <h4>Your Observations</h4>
        <textarea
          style={{ width: "100%", height: "120px", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
          placeholder="Add your observations or ideas about growth opportunities..."
        ></textarea>
      </div>
    </div>
  );
};

export default GrowthOpportunities;
