import React from "react";
import '../../App.css'

function TimeFilter({timeRange, onTimeRangeChange}){
const ranges = ["Daily", "Weekly","Monthly"];
    return(
        <>
            {
                ranges.map((range) => (
                    <button className="timeRangeButton" 
                    key={range} onClick={()=> onTimeRangeChange(range)}>
                        {range}
                    </button>
                ))
            }
        </>
    );
};

export default TimeFilter;