import React from "react";
import "../../App.css"
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale);

function RiskMetrices({metrics}){
    const data = {
        labels: metrics.map((metric) => metric.type),
        datasets:[
            {   label: 'Risk Score',
                data: metrics.map((metric) => metric.score),
                backgroundColor:['#FF6384','#3A32EB','#FFCE45'],
            },
        ],
    };
    return(
        <>
            <section className="metrices p-4">
                <h2>Risk Metrics</h2>
                <Bar data={data} />
            </section>
        </>
    );
}

export default RiskMetrices;