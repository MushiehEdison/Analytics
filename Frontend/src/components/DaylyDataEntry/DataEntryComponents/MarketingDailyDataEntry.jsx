import React from 'react';

const MarketingDailyDataEntry = () => {
    return (
        <div>
            <h2>Daily Marketing Data</h2>
            <label htmlFor="leadsGenerated">Leads Generated:</label>
            <input type="number" id="leadsGenerated" name="leadsGenerated" />

            <label htmlFor="conversionRate">Conversion Rate:</label>
            <input type="number" id="conversionRate" name="conversionRate" />

            <label htmlFor="marketingExpenses">Marketing Expenses:</label>
            <input type="number" id="marketingExpenses" name="marketingExpenses" />

            <label htmlFor="campaignROI">Campaign ROI:</label>
            <input type="number" id="campaignROI" name="campaignROI" />
        </div>
    );
};

export default MarketingDailyDataEntry;
