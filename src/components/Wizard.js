import React, { useState } from 'react';
import '../css/wizard.css'; // external CSS file

const steps = [
  '1. Product Info',
  '2. Media',
  '3. Socials',
  '4. Pricing',
];

const Wizard = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="wizard-container">
      {steps.map((label, index) => (
        <div
          key={index}
          className={`step ${index <= activeStep ? 'active' : ''}`}
          onClick={() => setActiveStep(index)}
        >
          <div className="circle" />
          <div>{label}</div>
        </div>
      ))}
    </div>
  );
};

export default Wizard;
