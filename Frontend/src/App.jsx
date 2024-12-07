import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Analytics from "./components/Analytics";
import Report from "./components/Report";
import RiskManagement from "./components/Risk";
import IndustryInsight from "./components/industryInsight";
import Home from "./components/home";
import RegistrationForm from "./components/Forms/RegistrationForm";
function App() {
  console.log("App is rendering");
  return (
    <Router >
      <div className=" " style={{color:'black'}}>
        <div className="content flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/report" element={<Report />} />
            <Route path="/riskmanagement" element={<RiskManagement />} />
            <Route path="/industryinsight" element={<IndustryInsight />} />
            <Route path="/register" element={<RegistrationForm/>} />
          </Routes>
        </div>
      </div>
    </Router>

  );
}


export default App;
