import React from "react";
import { Link } from "react-router-dom";
function Alert() {
  return (
    <>
   <div className="alertSection p-4">
        <button className="p-3">
           <Link className="alertLink" to='/kpis'><i className="fa-solid fa-bell text-light p-2"></i> </Link> 
        </button>
    </div>
  </>
  );
}
export default Alert;