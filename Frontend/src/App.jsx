import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Analytics from "./components/Analytics";
import Report from "./components/Report";
import RiskManagement from "./components/Risk";
import IndustryInsight from "./components/IndustryInsight";
import Home from "./components/Home";
import RegistrationForm from "./components/Forms/RegistrationForm";
import LoginForm from "./components/Forms/LoginForm";
import { AuthProvider, useAuth } from "./components/Forms/AuthContent";  // Ensure this import path is correct
import DataEntry from "./components/DaylyDataEntry/DataEntry";

const App = () => {
  return (
    <Router>
      <AuthWrapper />
    </Router>
  );
};

const AuthWrapper = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <MainApp />
    </AuthProvider>
  );
};

const MainApp = () => {
  const { isAuthenticated, token  } = useAuth();

  return (
    <div style={{ color: "black" }}>
      <div className="content flex-grow-1">
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<Navigate to="/register" />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/login" element={<LoginForm />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/report" element={<Report />} />
              <Route path="/riskmanagement" element={<RiskManagement />} />
              <Route path="/industryinsight" element={<IndustryInsight />} />
              <Route path="/input" element={<DataEntry />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default App;
