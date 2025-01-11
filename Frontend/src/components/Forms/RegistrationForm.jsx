import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate
import StepOnePersonalInfo from "./FormComponents/PersonalInfo";
import StepTwoAccountDetails from "./FormComponents/AccountDetails";
import StepThreeCompanyInfo from "./FormComponents/CompanyInfo";
import StepFourAgreement from "./FormComponents/Agreement";

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
    creationDate: "",
    companyWebsite: "",
    legalStructure: "",
    termsAgreed: false,
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/register", formData, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      console.log(response.data);
      alert("Form submitted successfully!");
      navigate("/");
    } catch (error) {
      alert("An error occurred while submitting the form.");
      console.error("Error submitting form:", error);
    }
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
      <div className="login">
        <span>Already have an account <Link to='/login' className='mx-3'>Login</Link></span>
      </div>
    </div>
  );
};

export default RegistrationForm;
