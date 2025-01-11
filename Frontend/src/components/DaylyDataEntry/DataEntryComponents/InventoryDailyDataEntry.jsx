// src/components/ServiceMetrics.js
import React from 'react';

const InventoryDailyDataEntry = () => {
    return (
        <div>
            <h2>Daily Inventory Data</h2>
            <label htmlFor="initialStockLevels">Inventory At the start of the day :</label>
            <input type="number" id="initialStockLevels" name="initialStockLevels" />

            <label htmlFor="stockRecieved">New stock Added to Inventory :</label>
            <input type="number" id="stockRecieved" name="stockRecieved" />

            <label htmlFor="stockSold">Stock Sold :</label>
            <input type="number" id="stockSold" name="stockSold" />

            <label htmlFor="finalStockLevels">Inventory at the end of the day :</label>
            <input type="number" id="finalStockLevels" name="finalStockLevels" />

            <label htmlFor="stockOutInstances">Number of times Products went out of stock:</label>
            <input type="number" id="stockOutInstances" name="stockOutInstances" />
        </div>
    );
};

export default InventoryDailyDataEntry;
