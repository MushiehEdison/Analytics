import React from "react";
import SideMenuBar from "./navigation/SideMenu";
import TopNavBar from "./navigation/TopNavBar";
import Alert from "./PageComponents/Alert";
function RiskManagement() {
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
      {/* main risk management page /////////////////////////////// */}
      <div className="trendSection p-4">
        ....
      </div>
   </>
  );
};
export default RiskManagement;