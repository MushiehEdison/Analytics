import React from "react";

const StepFourAgreement = ({ data, onChange }) => (
  <div className="step">
    <h2 className="py-4">Agreement</h2>
    <label>
      <input
        type="checkbox"
        checked={data.termsAgreed}
        onChange={(e) => onChange("termsAgreed", e.target.checked)}
      />
        I agree to the terms and conditions
    </label>
  </div>
);

export default StepFourAgreement;
