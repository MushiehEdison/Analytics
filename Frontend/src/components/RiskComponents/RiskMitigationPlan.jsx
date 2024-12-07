import React from "react";
import "../../App.css"

function MitigationPlan({plans}){
    return(
        <>
        <section className="mitigationPlans p-4">
            <h2>Mitigation Plans</h2>
           <table>
            <thead>
                <tr>
                    <th>Risk</th>
                    <th>Strategy</th>
                </tr>
            </thead>
            <tbody>
                {plans.map((plan, index)=> (
                    <tr key={index}>
                        <td>{plan.risk}</td>
                        <td>{plan.strategy}</td>
                    </tr>
                ))
                }
            </tbody>
           </table>
        </section>
        </>
    );
};

export default MitigationPlan;