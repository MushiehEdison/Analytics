import React from "react";

const StepTwoAccountDetails = ({ data, onChange }) => (
  <div className="step">
    <h2 className="py-5">Account Details</h2>
    <input
      type="text"
      placeholder="Username"
      value={data.username}
      onChange={(e) => onChange("username", e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={data.password}
      onChange={(e) => onChange("password", e.target.value)}
    />
    <input
      type="password"
      placeholder="Confirm Password"
      value={data.confirmPassword}
      onChange={(e) => onChange("confirmPassword", e.target.value)}
    />
    <select
      value={data.role}
      onChange={(e) => onChange("role", e.target.value)}
    >
      <option value="">Select Role</option>
      <option value="CEO">CEO</option>
      <option value="Manager">Manager</option>
      <option value="HRM">HRM</option>
      <option value="Share Holdere">Share Holder</option>
      <option value="IT Manaager">IT Manaager</option>
    </select>
  </div>
);

export default StepTwoAccountDetails;
