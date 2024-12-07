import React from "react";

function PerformanceScore({ title, score }) {
    return (
        <div className="PerformanceScore-container"> 
            <div className="PerformanceScoreTitle p-4">
                {title} <br /> {score}%
            </div>
        </div>
    );
}

export default PerformanceScore;
