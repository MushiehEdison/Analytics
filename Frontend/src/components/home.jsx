import React from "react";
import { Link } from "react-router-dom";
import TopNavBar from "./navigation/TopNavBar";
import SideMenuBar from "./navigation/SideMenu";
import Alert from "./PageComponents/Alert";
import PerformanceScore from "./Metrices/PerformanceScore";
import ActionableRec from "./Recommendations/ActionableRecom";

function Home() {
  // Sample data for dashboard KPIs
  const performanceData = [
    { title: "Sales Performance", score: 85 },
    { title: "Market Trends", score: 78 },
    { title: "Customer Engagement", score: 92 }
  ];

  // Key Features Overview content
  const keyFeatures = [
    { 
      title: "Analytics", 
      description: "Analyze key metrics and visualize data for better decision-making." 
    },
    { 
      title: "Industry Insight", 
      description: "Explore the latest trends and benchmark your performance." 
    },
    { 
      title: "Strategy", 
      description: "Get AI-generated marketing strategies with probability-based success rates." 
    },
    { 
      title: "Report", 
      description: "Generate detailed reports based on your analysis and strategies." 
    }
  ];

  return (
    <>
      {/* Alerts */}
      <div className="alerts">
        <Alert />
      </div>

      {/* Navigation */}
      <div className="navigation">
        <TopNavBar />
        <SideMenuBar />
      </div>

      {/* Main Home Section */}
      <div className="homeSection container my-5">
        {/* Welcome Section */}
        <div className="welcomeSection text-center mb-5">
          <h5>
            Welcome to Analytics – your AI-powered decision support system for marketing strategies.
            Get real-time insights, analyze industry trends, and make data-driven decisions with confidence.
          </h5>
        </div>

        {/* Key Features Overview */}
        <div className="keyFeaturesOverview mb-5">
          <h3 className="text-center mb-4">Key Features</h3>
          <div className="row">
            {keyFeatures.map((feature, index) => (
              <div className="col-md-3 col-sm-6 mb-3" key={index}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{feature.title}</h5>
                    <p className="card-text">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="dashboardPreview mb-5">
          <h3 className="text-center mb-4">Dashboard Preview</h3>
          <div className="row">
            {performanceData.map((data, index) => (
              <div className="col-md-4 col-sm-12 mb-3" key={index}>
                <PerformanceScore title={data.title} score={data.score} />
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations (Optional) */}
        <div className="actionableRecommendations mb-5">
          <h3 className="text-center mb-4">Actionable Recommendations</h3>
          <div className="row">
            {/* Example: You can customize this section based on dynamic recommendations */}
            <div className="col-md-6 col-sm-12 mb-3">
              <h4>Revenue Alert</h4>
              <ActionableRec Recommendation="Your revenue dropped by 5% last week. Check out our strategies to improve conversion rates." />
            </div>
            <div className="col-md-6 col-sm-12 mb-3">
              <h4>Customer Experience</h4>
              <ActionableRec Recommendation="Enhance customer service and collect feedback to boost retention and loyalty." />
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="ctaSection text-center">
          <Link to="/analytics" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
