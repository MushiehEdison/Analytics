import React from "react";

function ActionableRec({Recommendation, titleRec}){
    return(
        <>
        <div className="my-1"> 
            {Recommendation}{titleRec}
        </div>
        </>
    );
}

export default ActionableRec;