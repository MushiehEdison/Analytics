// src/components/ProjectMetrics.js
import React from 'react';

const ProductionDailyDataEntry = () => {
    return (
        <div>
            <h2>Project-Based Metrics</h2>
            <label htmlFor="unitProduced">Total Number of items manufactured:</label>
            <input type="number" id="unitProduced" name="unitProduced" />

            <label htmlFor="defectiveUnits">Number of units rejected due to uality issues:</label>
            <input type="text" id="defectiveUnits" name="defectiveUnits" />

            <label htmlFor="downTime">Hours lost due to maintainance or issues:</label>
            <input type="number" id="budget-utilization" name="budget-utilization" />

            <label htmlFor="resourcesUtilization">Percentage Resouces Used :</label>
            <input type="number" id="resourcesUtilization" name="resourcesUtilization" />
        </div>
    );
};

export default ProductionDailyDataEntry;
