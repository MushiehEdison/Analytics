import React from 'react';

const CustomerDailyDataEntry = () => {
    return (
        <div>
            <h2>Daily Customer Data</h2>
            <label htmlFor="customerFeedback">Customer Feedback Count:</label>
            <input type="number" id="customerFeedback" name="customerFeedback" />

            <label htmlFor="nps">Net Promoter Score (NPS):</label>
            <input type="number" id="nps" name="nps" />

            <label htmlFor="customerRetentionRate">Customer Retention Rate:</label>
            <input type="number" id="customerRetentionRate" name="customerRetentionRate" />
        </div>
    );
};

export default CustomerDailyDataEntry;
