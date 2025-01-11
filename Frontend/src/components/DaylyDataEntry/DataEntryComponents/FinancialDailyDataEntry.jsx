// src/components/NonprofitMetrics.js
import React from 'react';

const FinancialDailyDataEntry = () => {
    return (
        <div>
            <h2>Daily Financial Data</h2>
            <label htmlFor="revenueFromSales">Revenue From Sales: </label>
            <input type="number" id="revenueFromSales" name="revenueFromSales" />

            <label htmlFor="totalExpenses">Total Expenses: </label>
            <input type="number" id="totalExpenses" name="totalExpenses" />

            <label htmlFor="cashFlow">Cash Inflow and Outflow For The Day: </label>
            <input type="number" id="cashFlow" name="cashFlow" />

            <label htmlFor="outStandingPayment">Payment Pending from Customer:</label>
            <input type="number" id="outStandingPayment" name="outStandingPayment" />
        </div>
    );
};

export default FinancialDailyDataEntry;
