import React from "react";
import "../../App.css"

function RiskDsB({risks}){
    return(
        <>
        <section className="riskDashBoard p-4 ">
            <h2>Risk DashBoard</h2>
            <p>OverView of Potential Risks affecting the Business.</p>
            <div className="dashboard-overview d-flex">
                {risks.map((risk, index)=>(
                    <div className="card p-4 mx-1" key={index}>
                        <h3>{risk.type} Risk</h3>
                        <p>Probability {risk.probability}</p>
                        <p>impact: {risk.impact}</p>
                    </div>
                ))
                }
            </div>
        </section>
        </>
    );
};

export default RiskDsB;