import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../Forms/AuthContent";
import "../../App.css"
import Alert from '../PageComponents/Alert';
import TopNavBar from '../navigation/TopNavBar';
import SideMenuBar from '../navigation/SideMenu';

const DataEntry = () => {
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
    const { token } = useAuth();

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

        const formPayload = new FormData();
        formPayload.append('strategyData', JSON.stringify(formData));
        files.forEach(file => formPayload.append('evidence', file));

        try {
            await axios.post('https://api.strategy-tool.com/v1/core-inputs', formPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFiles([]);
            setFormData({
                sales: { productSales: '', clv: '', margin: '' },
                customer: { age: '', location: '', purchaseFrequency: '', nps: '' },
                operations: { productionCost: '', inventoryLevel: '', employeePerformance: '' },
                financial: { revenue: '', profitMargin: '', roi: '' },
                digitalMarketing: { conversions: '', adSpend: '', bounceRate: '' }
            });
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setLoading(false);
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
                        {/* Sales Data */}
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
                                <div className="file-upload-box">
                                    <input
                                        type="file"
                                        id="salesDocuments"
                                        multiple
                                        accept=".xlsx,.csv,.pdf"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="salesDocuments" className="upload-label">
                                        <div className="upload-content">
                                            <i className="fas fa-file-invoice fa-2x"></i>
                                            <p>Upload POS/ERP Data</p>
                                            <p className="file-types">Transaction History, Product Performance</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Customer Data */}
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
                                        <select
                                            name="customer.location"
                                            value={formData.customer.location}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Region</option>
                                            <option value="North America">North America</option>
                                            <option value="Europe">Europe</option>
                                            <option value="Asia-Pacific">APAC</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Monthly Purchases/Customer</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="customer.purchaseFrequency"
                                            value={formData.customer.purchaseFrequency}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Net Promoter Score</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            name="customer.nps"
                                            value={formData.customer.nps}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="file-upload-box">
                                    <input
                                        type="file"
                                        id="customerDocuments"
                                        multiple
                                        accept=".pdf,.csv"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="customerDocuments" className="upload-label">
                                        <div className="upload-content">
                                            <i className="fas fa-file-contract fa-2x"></i>
                                            <p>Upload CRM Data</p>
                                            <p className="file-types">Customer Profiles, Survey Results</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Operations Data */}
                        {activeSection === 'operations' && (
                            <div className="form-section">
                                <h3><i className="fas fa-cogs"></i> Operational Metrics</h3>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Production Cost/Unit ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="operations.productionCost"
                                            value={formData.operations.productionCost}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Inventory Turnover (Days)</label>
                                        <input
                                            type="number"
                                            name="operations.inventoryLevel"
                                            value={formData.operations.inventoryLevel}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Employee Performance Score</label>
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
                                <div className="file-upload-box">
                                    <input
                                        type="file"
                                        id="operationsDocuments"
                                        multiple
                                        accept=".xlsx,.pdf"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="operationsDocuments" className="upload-label">
                                        <div className="upload-content">
                                            <i className="fas fa-file-alt fa-2x"></i>
                                            <p>Upload Operational Reports</p>
                                            <p className="file-types">Production Logs, Inventory Reports</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Financial Data */}
                        {activeSection === 'financial' && (
                            <div className="form-section">
                                <h3><i className="fas fa-chart-line"></i> Financial Health</h3>
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
                                        <label>Campaign ROI (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="financial.roi"
                                            value={formData.financial.roi}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="file-upload-box">
                                    <input
                                        type="file"
                                        id="financialDocuments"
                                        multiple
                                        accept=".pdf,.xlsx"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="financialDocuments" className="upload-label">
                                        <div className="upload-content">
                                            <i className="fas fa-file-invoice-dollar fa-2x"></i>
                                            <p>Upload Financial Statements</p>
                                            <p className="file-types">Balance Sheets, Cash Flow Reports</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Digital Marketing Data */}
                        {activeSection === 'digitalMarketing' && (
                            <div className="form-section">
                                <h3><i className="fas fa-bullhorn"></i> Marketing Performance</h3>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Monthly Conversions</label>
                                        <input
                                            type="number"
                                            name="digitalMarketing.conversions"
                                            value={formData.digitalMarketing.conversions}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Ad Spend ($)</label>
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
                                <div className="file-upload-box">
                                    <input
                                        type="file"
                                        id="marketingDocuments"
                                        multiple
                                        accept=".csv,.pdf"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="marketingDocuments" className="upload-label">
                                        <div className="upload-content">
                                            <i className="fas fa-file-chart-line fa-2x"></i>
                                            <p>Upload Marketing Analytics</p>
                                            <p className="file-types">Google Analytics Reports, Campaign Data</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><i className="fas fa-spinner fa-spin"></i> Analyzing...</>
                                ) : (
                                    <><i className="fas fa-chart-pie"></i> Generate Strategy Report</>
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