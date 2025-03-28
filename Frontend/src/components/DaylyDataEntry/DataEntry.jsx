import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../Forms/AuthContent";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Alert from '../PageComponents/Alert';
import TopNavBar from '../navigation/TopNavBar';
import SideMenuBar from '../navigation/SideMenu';

const DataEntry = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('sales');
    const [formData, setFormData] = useState({
        sales: { productSales: '', clv: '', margin: '' },
        customer: { age: '', location: '', purchaseFrequency: '', nps: '' },
        operations: { productionCost: '', inventoryLevel: '', employeePerformance: '' },
        financial: { revenue: '', profitMargin: '', roi: '' },
        digitalMarketing: { conversions: '', adSpend: '', bounceRate: '' }
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const sections = [
        { id: 'sales', label: 'Sales Data', icon: 'dollar-sign' },
        { id: 'customer', label: 'Customer Data', icon: 'users' },
        { id: 'operations', label: 'Operations Data', icon: 'cogs' },
        { id: 'financial', label: 'Financial Data', icon: 'chart-line' },
        { id: 'digitalMarketing', label: 'Digital Marketing', icon: 'bullhorn' }
    ];

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files);
        setFiles(uploadedFiles);
        setError(null);
        setSuccess(null);
    };

    const handleFileRemove = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [category, field] = name.split('.');
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("Authentication required. Please login.");
            setLoading(false);
            navigate('/login');
            return;
        }

        try {
            const formPayload = new FormData();

            // Add form data
            formPayload.append('strategyData', JSON.stringify({
                ...formData,
                activeSection: activeSection
            }));

            // Add files
            files.forEach(file => formPayload.append('files', file));

            const response = await axios.post('http://localhost:5000/api/dataentry', formPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess(`Data for ${sections.find(s => s.id === activeSection).label} submitted successfully!`);
            setFiles([]);
            setFormData({
                sales: { productSales: '', clv: '', margin: '' },
                customer: { age: '', location: '', purchaseFrequency: '', nps: '' },
                operations: { productionCost: '', inventoryLevel: '', employeePerformance: '' },
                financial: { revenue: '', profitMargin: '', roi: '' },
                digitalMarketing: { conversions: '', adSpend: '', bounceRate: '' }
            });

        } catch (error) {
            console.error("Upload error:", error);
            if (error.response) {
                if (error.response.status === 401) {
                    setError("Session expired. Please login again.");
                    navigate('/login');
                } else {
                    setError(error.response.data.error || "Submission failed. Please try again.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    // File upload descriptions for each section
    const fileUploadDescriptions = {
        sales: {
            title: "Upload POS/ERP Data",
            description: "Transaction History, Product Performance",
            icon: "file-invoice"
        },
        customer: {
            title: "Upload Customer Data",
            description: "CRM exports, Survey results, Customer feedback",
            icon: "user-friends"
        },
        operations: {
            title: "Upload Operations Data",
            description: "Production logs, Inventory reports, Employee records",
            icon: "clipboard-check"
        },
        financial: {
            title: "Upload Financial Documents",
            description: "Balance sheets, Income statements, Cash flow reports",
            icon: "file-invoice-dollar"
        },
        digitalMarketing: {
            title: "Upload Marketing Data",
            description: "Google Analytics, Ad campaign reports, Social media metrics",
            icon: "chart-bar"
        }
    };

    return (
        <div className="daily-data-entry">
            <div className="alerts">
                <Alert />
            </div>
            <div className="navigation">
                <TopNavBar />
                <SideMenuBar />
            </div>
            <div className="main-content dailydata">
                <div className="enterprise-container">
                    <div className="enterprise-header">
                        <h1><i className="fas fa-chess-queen"></i> Core Strategy Inputs</h1>
                        <p className="subtitle">
                            <i className="fas fa-database"></i> Manual Inputs with Historical Evidence
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-danger mb-4">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success mb-4">
                            <i className="fas fa-check-circle me-2"></i>
                            {success}
                        </div>
                    )}

                    <div className="data-nav">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <i className={`fas fa-${section.icon}`}></i> {section.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="enterprise-form">
                        {/* Sales Data Section */}
                        {activeSection === 'sales' && (
                            <div className="form-section">
                                <h3><i className="fas fa-dollar-sign"></i> Sales Performance</h3>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Annual Product Sales ($)</label>
                                        <input
                                            type="number"
                                            name="sales.productSales"
                                            value={formData.sales.productSales}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Customer Lifetime Value ($)</label>
                                        <input
                                            type="number"
                                            name="sales.clv"
                                            value={formData.sales.clv}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Average Margin (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="sales.margin"
                                            value={formData.sales.margin}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Customer Data Section */}
                        {activeSection === 'customer' && (
                            <div className="form-section">
                                <h3><i className="fas fa-users"></i> Customer Insights</h3>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Average Customer Age</label>
                                        <input
                                            type="number"
                                            name="customer.age"
                                            value={formData.customer.age}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Primary Location</label>
                                        <input
                                            type="text"
                                            name="customer.location"
                                            value={formData.customer.location}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Purchase Frequency (per year)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="customer.purchaseFrequency"
                                            value={formData.customer.purchaseFrequency}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Net Promoter Score (0-10)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            name="customer.nps"
                                            value={formData.customer.nps}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Operations Data Section */}
                        {activeSection === 'operations' && (
                            <div className="form-section">
                                <h3><i className="fas fa-cogs"></i> Operations Metrics</h3>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Production Cost per Unit ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="operations.productionCost"
                                            value={formData.operations.productionCost}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Inventory Level (units)</label>
                                        <input
                                            type="number"
                                            name="operations.inventoryLevel"
                                            value={formData.operations.inventoryLevel}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Employee Performance Score (1-10)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            name="operations.employeePerformance"
                                            value={formData.operations.employeePerformance}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Financial Data Section */}
                        {activeSection === 'financial' && (
                            <div className="form-section">
                                <h3><i className="fas fa-chart-line"></i> Financial Metrics</h3>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Annual Revenue ($)</label>
                                        <input
                                            type="number"
                                            name="financial.revenue"
                                            value={formData.financial.revenue}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Profit Margin (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="financial.profitMargin"
                                            value={formData.financial.profitMargin}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Return on Investment (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="financial.roi"
                                            value={formData.financial.roi}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Digital Marketing Section */}
                        {activeSection === 'digitalMarketing' && (
                            <div className="form-section">
                                <h3><i className="fas fa-bullhorn"></i> Digital Marketing</h3>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Conversions (per month)</label>
                                        <input
                                            type="number"
                                            name="digitalMarketing.conversions"
                                            value={formData.digitalMarketing.conversions}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Ad Spend ($ per month)</label>
                                        <input
                                            type="number"
                                            name="digitalMarketing.adSpend"
                                            value={formData.digitalMarketing.adSpend}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Bounce Rate (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="digitalMarketing.bounceRate"
                                            value={formData.digitalMarketing.bounceRate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* File Upload Section (Dynamic based on active section) */}
                        <div className="file-upload-box mt-4">
                            <input
                                type="file"
                                id={`${activeSection}Documents`}
                                multiple
                                accept=".xlsx,.csv,.pdf,.doc,.docx"
                                onChange={handleFileUpload}
                            />
                            <label htmlFor={`${activeSection}Documents`} className="upload-label">
                                <div className="upload-content">
                                    <i className={`fas fa-${fileUploadDescriptions[activeSection].icon} fa-2x`}></i>
                                    <p>{fileUploadDescriptions[activeSection].title}</p>
                                    <p className="file-types">{fileUploadDescriptions[activeSection].description}</p>
                                </div>
                            </label>
                            {files.length > 0 && (
                                <div className="uploaded-files mt-3">
                                    <h5>Selected Files:</h5>
                                    <ul className="list-group">
                                        {files.map((file, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                {file.name}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleFileRemove(index)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="form-actions mt-4">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin me-2"></i>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-chart-pie me-2"></i>
                                        Generate Strategy Report
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DataEntry;