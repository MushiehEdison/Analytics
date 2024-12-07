import React from "react";
import '../../App.css'
function KPIToggle({options, selectedKPI, onChange}){
    return(
        <>
        <div className="toggleKPI">
            <select name="toggle"
             value={selectedKPI} 
             onChange={(e)=>onChange(e.target.value)}
             className="p-2"
             >
             {
                options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))
             }
            </select>
        
        </div>
        
        </>
    );
};

export default KPIToggle;