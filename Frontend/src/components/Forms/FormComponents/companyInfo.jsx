import React from "react";

const StepThreeCompanyInfo = ({ data, onChange }) => (
  <div className="step">
    <h2 className="py-4">Company Information</h2>
    <input
      type="text"
      placeholder="Company Name"
      value={data.companyName}
      onChange={(e) => onChange("companyName", e.target.value)}
    />
    <input
      type="text"
      placeholder="Industry"
      value={data.industry}
      onChange={(e) => onChange("industry", e.target.value)}
    />
    <textarea
      placeholder="Business Address"
      value={data.businessAddress}
      onChange={(e) => onChange("businessAddress", e.target.value)}
    ></textarea>
    <input
      type="text"
      placeholder="Contact Information"
      value={data.companyContact}
      onChange={(e) => onChange("companyContact", e.target.value)}
    />
    <input type="text" value={data.registrationDate} readOnly />
  </div>
);

export default StepThreeCompanyInfo;
