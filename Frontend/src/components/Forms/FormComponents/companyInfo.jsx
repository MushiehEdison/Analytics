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
      type="url"
      placeholder="WebSite"
      value={data.companyWebsite}
      onChange={(e) => onChange("companyWebsite", e.target.value)}
    />
    <input
      type="text"
      placeholder="Contact Information"
      value={data.companyContact}
      onChange={(e) => onChange("companyContact", e.target.value)}
    />
     <input
      type="text"
      placeholder="Legal Structure"
      value={data.legalStructure}
      onChange={(e) => onChange("legalStructure", e.target.value)}
    />

    <input
    type="date"
    value={data.creationDate}
     onChange={(e) => onChange("creationDate", e.target.value)}
     />
  </div>
);

export default StepThreeCompanyInfo;
