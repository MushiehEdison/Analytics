import React, { useState } from 'react';
import Alert from '../PageComponents/Alert';
import TopNavBar from '../navigation/TopNavBar';
import SideMenuBar from '../navigation/SideMenu';
import SalesDailyDataEntry from './DataEntryComponents/SalesDailyDataEntry';
import InventoryDailyDataEntry from './DataEntryComponents/InventoryDailyDataEntry';
import FinancialDailyDataEntry from './DataEntryComponents/FinancialDailyDataEntry';
import EmployeeDailyDataEntry from './DataEntryComponents/EmployeeDailyDataEntry';
import MarketingDailyDataEntry from './DataEntryComponents/MarketingDailyDataEntry';
import CustomerDailyDataEntry from './DataEntryComponents/CustomerDailyDataEntry';
import ProductionDailyDataEntry from './DataEntryComponents/ProductionDailyDataEntry';
import "./DailyDataEntry.css";

const DataEntry = () => {
    const [activeTab, setActiveTab] = useState('sales');

    const renderContent = () => {
        switch (activeTab) {
            case 'sales':
                return <SalesDailyDataEntry />;
            case 'inventory':
                return <InventoryDailyDataEntry />;
            case 'finance':
                return <FinancialDailyDataEntry />;
            case 'employee':
                return <EmployeeDailyDataEntry />;
            case 'production':
                return <ProductionDailyDataEntry />;
            case 'customer':
                return <CustomerDailyDataEntry />;
            case 'marketing':
                return <MarketingDailyDataEntry />;
            default:
                return <SalesDailyDataEntry />;
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
                <h1>Data Entry Form</h1>
                <div className="tabs">
                    <button className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}>Sales</button>
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Inventory</button>
                    <button className={activeTab === 'finance' ? 'active' : ''} onClick={() => setActiveTab('finance')}>Financial</button>
                    <button className={activeTab === 'employee' ? 'active' : ''} onClick={() => setActiveTab('employee')}>Employee</button>
                    <button className={activeTab === 'production' ? 'active' : ''} onClick={() => setActiveTab('production')}>Production</button>
                    <button className={activeTab === 'customer' ? 'active' : ''} onClick={() => setActiveTab('customer')}>Customer</button>
                    <button className={activeTab === 'marketing' ? 'active' : ''} onClick={() => setActiveTab('marketing')}>Marketing</button>
                </div>
                <div className="form-content">
                    {renderContent()}
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </div>
        </div>
    );
};

export default DataEntry;
