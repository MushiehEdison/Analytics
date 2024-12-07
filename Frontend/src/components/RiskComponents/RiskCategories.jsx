import React from "react";
import "../../App.css"

function RiskCategories({categories}){
    return(
        <>
        <section className="riskCategories ">
            <h2 className="py-5">Rish Categories</h2>
            <ul className="container d-flex">
                { categories.map((category, index) => (
                    <li className="p-4 col mx-1" key={index}>
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                    </li>
                ))
                }
            </ul>
        </section>
        </>
    );
}

export default RiskCategories;