import React, { useState } from "react";
import StepOnePersonalInfo from "./FormComponents/PersonalInfo";
import StepTwoAccountDetails from "./FormComponents/AccountDetails";
import StepFourAgreement from "./FormComponents/Agreement";
import StepThreeCompanyInfo from "./FormComponents/companyInfo";

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    companyName: "",
    industry: "",
    businessAddress: "",
    companyContact: "",
    registrationDate: new Date().toISOString().split("T")[0],
    companyWebsite: "",
    socialMedia: "",
    termsAgreed: false,
  });

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    console.log("Form Submitted", formData);
  };

  const steps = [
    <StepOnePersonalInfo data={formData} onChange={handleChange} />,
    <StepTwoAccountDetails data={formData} onChange={handleChange} />,
    <StepThreeCompanyInfo data={formData} onChange={handleChange} />,
    <StepFourAgreement data={formData} onChange={handleChange} />,
  ];

  return (
    <div className="multi-step-form">
      <div className="form-content">{steps[currentStep - 1]}</div>
      <div className="form-navigation">
        {currentStep > 1 && (
          <button onClick={handleBack} className="back-button">
            Back
          </button>
        )}
        {currentStep < 4 ? (
          <button onClick={handleNext} className="next-button px-4 m-4">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="submit-button px-4 m-4">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
