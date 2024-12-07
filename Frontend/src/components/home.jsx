import React from "react";
import { Link } from "react-router-dom";
import ActionableRec from "./Recommendations/ActionableRecom";
import PerformanceScore from "./Metrices/PerformanceScore";
import Alert from "./PageComponents/Alert";
import TopNavBar from "./navigation/TopNavBar";
import SideMenuBar from "./navigation/SideMenu";
function Home() {
  const performanceData = [
    { title: "Time Management Score", score: 85 },
    { title: "Productivity Score", score: 90 },
    { title: "Customer Satisfaction", score: 78 },
    { title: "Sales Conversion", score: 95 },
    { title: "Social Media Performance", score: 2 },
];
  const Recommendation = [
    { Recommendation: ' Your revenue dropped by 5% last week” with recommendations "See suggested action.'},
    { Recommendation: ' Prioritize delivering exceptional customer service and seamless experiences across all touchpoints. Gather and use customer feedback to improve products, services, and processes. Investing in customer relationships fosters loyalty and can lead to word-of-mouth referrals, boosting growth organically.'},
    { Recommendation: 'Cultivating a motivated, skilled, and aligned workforce can significantly contribute to growth. Offer training, clear paths for advancement, and a positive work culture to retain top talent. Engaged employees are more productive and innovative, which can lead to better customer service and continuous improvements.'},
    { Recommendation: "preferences, and purchasing trends. Tailored marketing campaigns based on insights can enhance customer engagement, conversion rates, and ROI. Focus on digital channels like social media, email marketing, and SEO to maximize reach and maintain a competitive edge"}
  ];
  return (
    <> 
    {/* Components/////////////////////////////////////////////////////////////// */}
          <div className="alerts">
            <Alert/>
          </div>
          <div className="navigation">
            <TopNavBar/>
            <SideMenuBar/>
          </div>
    <div className="homeSection">
      {/* Key Performance indicators ////////////////////////////////////////////// */}
    <div className="homeSection-1">
        <div className="title m-3">
            <span className="display-5 m-5">Company Performance </span>
         </div> 
         <div className="p-3" style={{ width: '98%' }}>
            <span className="h3 m-5">Daily Health Scores</span>
            <div className="daylyPerformanceScore container my-3">
                {performanceData.map((data, index) => (
                    <div className="daylyPerformanceScore-box col" key={index}>
                        <PerformanceScore title={data.title} score={data.score} />
                    </div>
                ))}
            </div>
        </div>
    </div>
        {/* Rank in the industry  ////////////////////////////////////////////////////////////// */}
      `<div className="IndustryPosition p-5">
      <i class="fa-solid fa-ranking-star"></i>
            <div className="position"> You position in the Entertainment Industry has just Increases to <span className="text-">5th</span> postion</div>
                <div className="viewRanks"><Link to="/industryinsight"> view ranks </Link></div>
        </div>`
        {/* Actionalble Recommendations ///////////////////////////////////////////// */}
      <div className="homeSection-2 ">
         <div className="title m-5">
            <span className="display-5 m-3">Actionable Recommendations</span>
         </div>
         
        <div className="container">
          {Recommendation.map((data, index) => (
            <div className="recommendationSection col-lg" key={index}>
              <span className="h3">< ActionableRec titleRec={data.titleRec}/></span>
               <ActionableRec Recommendation={data.Recommendation} />
            </div>
          ))}
        </div>
        <Link className="DetailsLink p-3" to='/kpi'><span > Details </span></Link>  
      </div>   
    </div>
     
    </>
  );
}

export default Home;
