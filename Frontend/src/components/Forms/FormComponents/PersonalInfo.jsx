import React from "react";

const StepOnePersonalInfo = ({ data, onChange }) => (
  <div className="step">
    <h2 className="py-4">Personal Information</h2>
    <input
      type="text"
      placeholder="Full Name"
      value={data.fullName}
      onChange={(e) => onChange("fullName", e.target.value)}
    />
    <input
      type="email"
      placeholder="Email Address"
      value={data.email}
      onChange={(e) => onChange("email", e.target.value)}
    />
    <input
      type="tel"
      placeholder="Phone Number"
      value={data.phone}
      onChange={(e) => onChange("phone", e.target.value)}
    />
  </div>
);

export default StepOnePersonalInfo;
