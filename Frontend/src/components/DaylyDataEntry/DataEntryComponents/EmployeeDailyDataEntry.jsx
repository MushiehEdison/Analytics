// src/components/ProjectMetrics.js
import React from 'react';

const EmployeeDailyDataEntry = () => {
    return (
        <div>
            <h2>Daily Employee Data</h2>
            <label htmlFor="tasks-completed">Tasks Completed:</label>
            <input type="number" id="tasks-completed" name="tasks-completed" />

            <label htmlFor="project-status">Project Status:</label>
            <input type="text" id="project-status" name="project-status" />

            <label htmlFor="budget-utilization">Budget Utilization:</label>
            <input type="number" id="budget-utilization" name="budget-utilization" />
        </div>
    );
};

export default EmployeeDailyDataEntry;
