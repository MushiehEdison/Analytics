import React from 'react';

const SalesDailyDataEntry = () => {
    return (
        <div>
            <h2>Daily Sales Data</h2>
            <label htmlFor="dailySales">Sum of Daily Sales: </label>
            <input type="number" id="dailySales" name="dailySales" />

            <label htmlFor="unitSold">Units Sold:</label>
            <input type="number" id="unitSold" name="unitSold" />

            <label htmlFor="returningCustomerCount">Returning Customer Count: </label>
            <input type="number" id="returningCustomerCount" name="returningCustomerCount" />

            <label htmlFor="newCustomerCount">New Customer Count: </label>
            <input type="number" id="newCustomerCount" name="newCustomerCount" />
        </div>
    );
};

export default SalesDailyDataEntry;
