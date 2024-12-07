import React from "react";
import SideMenuBar from "./navigation/SideMenu";
import TopNavBar from "./navigation/TopNavBar";
import Alert from "./PageComponents/Alert";
import RiskDsB from "./RiskComponents/RiskDsB";
import RiskMetrices from "./RiskComponents/RiskMetrices";
import RiskCategories from "./RiskComponents/RiskCategories";
import MitigationPlan from "./RiskComponents/RiskMitigationPlan";

const riskData = {
  RiskDsb:[
    {type:'Financial', probability:'High',impact:'Severe'},
    {type:'Operational', probability:'Medium',impact:'Moderate'},
    {type:'Market', probability:'Low',impact:'Minor'},
  ],
  Metrices:[
    {type:'Financial', score:85},
    {type:'Operational', score:60},
    {type:'Market', score:20},
  ],
  categories:[
    {name:'Finacial', description: 'Risks Related to Cash Flow , revenue, etc'},
    {name:'Compliance', description: 'Risk of Regulatory non-compliance'},
    {name:'Operational', description: 'Risk in Business sOperations'},
  ],
  Plans:[
    {risk:'FInancial', strategy:'Increase Cash reserves and diversity investments'},
    {risk:'Compliance', strategy:'Regular Audits and employee training'},
    {risk:'Operational', strategy:'Impliment contingency plans for key workflows'},
  ],
};
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
        <RiskDsB risks={riskData.RiskDsb} />
        <RiskMetrices metrics={riskData.Metrices} />
        <RiskCategories categories={riskData.categories} />
        <MitigationPlan plans={riskData.Plans} />
      </div>
   </>
  );
};
export default RiskManagement;