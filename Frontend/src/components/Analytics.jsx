import React, { useState } from "react";
import SideMenuBar from "./navigation/SideMenu";
import TopNavBar from "./navigation/TopNavBar";
import Alert from "./PageComponents/Alert";
import DataVisualization from "./AnalyticsComponents/DataVisualization";
import UserBehavior from "./AnalyticsComponents/UserBehavior";
import TimeFilter from "./AnalyticsComponents/TimeFilter";
import KPIToggle from "./AnalyticsComponents/KPIToggle";

const Analytics = () => {
  const [selectedKPI, setSelectedKPI] = useState("Sales");
  const [timeRange, setTimeRange] = useState("Daily");

  const kpiOptions = ["Sales", "User Acquisition", "Engagement Rates"];
  const timeRanges = ["Daily", "Weekly", "Monthly"];

  // Mock data for each KPI and time range
  const mockData = {
    Sales: {
      Daily: [5, 8, 12, 15],
      Weekly: [50, 80, 120, 150],
      Monthly: [200, 400, 600, 800],
    },
    "User Acquisition": {
      Daily: [2, 3, 5, 7],
      Weekly: [20, 30, 50, 70],
      Monthly: [80, 100, 120, 150],
    },
    "Engagement Rates": {
      Daily: [1, 2, 3, 4],
      Weekly: [10, 20, 30, 40],
      Monthly: [50, 70, 90, 100],
    },
  };

  const userBehaviorData = {
    Daily: [
      { action: "Page View", count: 100 },
      { action: "Clicks", count: 70 },
      { action: "SignUps", count: 30 },
    ],
    Weekly: [
      { action: "Page View", count: 700 },
      { action: "Clicks", count: 500 },
      { action: "SignUps", count: 200 },
    ],
    Monthly: [
      { action: "Page View", count: 3000 },
      { action: "Clicks", count: 2500 },
      { action: "SignUps", count: 1200 },
    ],
  };

  const labels = ["Period 1", "Period 2", "Period 3", "Period 4"];

  return (
    <>
      {/* Alert Section////////////////////////////////////// */}
      <div className="alerts">
        <Alert />
      </div>

      {/* Navigation Section//////////////////////////////// */}
      <div className="navigation">
        <TopNavBar />
        <SideMenuBar />
      </div>

      {/* Main Analytics Section ///////////////////////////////////*/}
      <div className="analyticSection">
        <h1>Analytics</h1>
      <div className="d-flex justify-content-between">
        
        {/* KPI Selector */}
        <div className="kpiToggle">
          <KPIToggle
            options={kpiOptions}
            selectedKPI={selectedKPI}
            onChange={setSelectedKPI}
          />
        </div>

         {/* Time Filter /////////////////////// */}
        <div className="timeFilter">
          <TimeFilter
            timeRanges={timeRanges}
            selectedTimeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>

      </div>

        {/* Data Visualization */}
        <div className="dataVisualization">
          <DataVisualization
            data={mockData[selectedKPI][timeRange]}
            labels={labels}
            title={`${selectedKPI} Over ${timeRange}`}
          />
        </div>
      </div>
    </>
  );
};

export default Analytics;
