import React, { useState, useEffect } from "react";
import axios from 'axios';
import defaultImage from "../navigation/profile.jpeg";
import { useAuth } from "../Forms/AuthContent";

function TopNavBar() {
    const { token, setToken } = useAuth();
    const [companyData, setCompanyData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken && !token) {
            setToken(storedToken);
        }
        if (token) {
            fetchCompanyData();
        }
    }, [token]);

    const fetchCompanyData = async () => {
        if (!token) return;
        try {
            console.log("Sending request with token:", token);
            const response = await axios.get('http://127.0.0.1:5000/api/navigation', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("Response:", response.data);
            setCompanyData(response.data);
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                if (error.response.status === 401) {
                    setError("You are not authenticated. Please log in.");
                } else if (error.response.status === 404) {
                    setError("Company information not found.");
                } else {
                    setError("An error occurred while fetching company data.");
                }
            } else {
                setError("Network error. Please check your internet connection.");
            }
        }
    };

    return (
        <nav className="TopNavBar d-flex justify-content-between align-items-center text-dark py-3 px-4">
            <div className="logo fs-1 fw-bold">
                <i className="fa-solid fa-compass mx-3"></i>ANALYTICS
            </div>

            <div className="TopNavbarElements d-flex align-items-center">
                {error ? (
                    <div className="error-message text-danger me-3">{error}</div>
                ) : companyData ? (
                    <div className="CompanyName fs-4 me-3">
                        <span>{companyData.companyName}</span>
                    </div>
                ) : (
                    <div className="loading-message me-3">Loading company data...</div>
                )}

                <div className="CompanyLogo">
                    <img
                        src={companyData?.companyLogo || defaultImage}
                        className="profileImage rounded-circle"
                        alt="Company logo"
                        style={{ width: '60px' }}
                    />
                </div>
            </div>
        </nav>
    );
}

export default TopNavBar;
