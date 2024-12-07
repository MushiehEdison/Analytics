import React, { useState } from "react";
import SideMenuBar from "./navigation/SideMenu";
import TopNavBar from "./navigation/TopNavBar";
import Alert from "./PageComponents/Alert";
import MarketTrends from "./IndustryInsightsComponents/MarketTrend";
import CompetitorComparisonPage from "./IndustryInsightsComponents/CompetitorComparism";
import GrowthOpportunities from "./IndustryInsightsComponents/GrowthOpportunities";
import RiskIndicators from "./IndustryInsightsComponents/RiskIndicators";
import StrengthsWeaknesses from "./IndustryInsightsComponents/StrengthWeaknesses";
import SuccessStories from "./IndustryInsightsComponents/SuccessStories";

function IndustryInsight() {
   const [activeSection, setActiveSection] = useState("Market Trends");

  // List of sections for dynamic rendering
  const sections = [
    "Market Trends",
    "Competitor Comparison",
    "Strengths & Weaknesses",
    "Growth Opportunities",
    "Risk Indicators",
    "Success Stories",
    "Custom Filters",
  ];

  return (
    <>
    {/* Components/////////////////////////////////////////////////////////////// */}
    <div className="alerts">

            <Alert/>
          </div>
          <div className="navigation">
            <TopNavBar/>
            <SideMenuBar/>
          </div>
   <div className="growthSection p-4">
         <div style={{ fontFamily: "'Arial', sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Industry Insights Dashboard</h1>
      
      {/* Navigation */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
          overflowX: "auto",
        }}
      >
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            style={{
              padding: "10px 20px",
              backgroundColor: activeSection === section ? "#3498db" : "#f0f0f0",
              color: activeSection === section ? "#fff" : "#333",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
              fontSize: "16px",
            }}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="content">
        {activeSection === "Market Trends" && <MarketTrends />}
        {activeSection === "Competitor Comparison" && <CompetitorComparisonPage />}
        {activeSection === "Strengths & Weaknesses" && <StrengthsWeaknesses />}
        {activeSection === "Growth Opportunities" && <GrowthOpportunities />}
        {activeSection === "Risk Indicators" && <RiskIndicators />}
        {activeSection === "Success Stories" && <SuccessStories />}
        {activeSection === "Custom Filters" && <CustomFilters />}
      </div>
    </div>
        </div>
  </>
  );
}
export default IndustryInsight;