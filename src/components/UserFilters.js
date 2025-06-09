import React, { useState } from 'react';



const UserFilters = ({handleFilters,filters ,columns}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [statusValue, setStatusValue] = useState('');
  const [genderValue, setGenderValue] = useState('');

  

function keyExists(keyToFind) {
  return columns.some(field => field.key === keyToFind);
}
  return (
    <>
  <div className={`dropdown ${keyExists('status') ? '' : 'd-none'}`} >
  <a
    href="#"
    className="btn bg-gradient-dark dropdown-toggle"
    data-bs-toggle="dropdown"
    id="statusDropdown"
  >
  <i className="material-symbols-rounded me-2">switches</i>
    {filters?.status === 1
      ? "Active"
      : filters?.status === 0
      ? "Inactive"
      : "Choose Status"}
  </a>

  <ul className="dropdown-menu" aria-labelledby="statusDropdown">
    <li>
      <a
        className="dropdown-item"
        style={{
          cursor: "pointer",
          backgroundColor: filters?.status === 1 ? "green" : "transparent",
          color: filters?.status === 1 ? "white" : "black",
        }}
        onClick={() => handleFilters('status',1)}
      >
       <i className="material-symbols-rounded me-2">toggle_on</i> Active
      </a>
    </li>
    <li>
      <a
        className="dropdown-item"
        style={{
          cursor: "pointer",
          backgroundColor: filters?.status === 0 ? "green" : "transparent",
          color: filters?.status === 0 ? "white" : "black",
        }}
        onClick={() => handleFilters('status',0)}
      >
      <i className="material-symbols-rounded me-2">toggle_off</i> Inactive
      </a>
    </li>
  </ul>
</div>


<div className={`dropdown ${keyExists('gender') ? '' : 'd-none'}`}>
   
  <a
    href="#"
    className="btn bg-gradient-dark dropdown-toggle"
    data-bs-toggle="dropdown"
    id="genderDropdown"
  >
 <i className="material-symbols-rounded me-2">wc</i>
    {filters?.gender === "male"
      ? "Male"
      : filters?.gender === "female"
      ? "Female"
      : filters?.gender === "other"
      ? "Other"
      : "Choose Gender"}
  </a>

  <ul className="dropdown-menu" aria-labelledby="genderDropdown">
    <li>
      <a
        className="dropdown-item"
        style={{
          cursor: "pointer",
          backgroundColor: filters?.gender === "male" ? "green" : "transparent",
          color: filters?.gender === "male" ? "white" : "black",
        }}
        onClick={() => handleFilters("gender", "male")}
      >
       <i className="material-symbols-rounded me-2">man</i> Male
      </a>
    </li>
    <li>
      <a
        className="dropdown-item"
        style={{
          cursor: "pointer",
          backgroundColor: filters?.gender === "female" ? "green" : "transparent",
          color: filters?.gender === "female" ? "white" : "black",
        }}
        onClick={() => handleFilters("gender", "female")}
      >
        <i className="material-symbols-rounded me-2">woman</i> Female
      </a>
    </li>
    <li>
      <a
        className="dropdown-item"
        style={{
          cursor: "pointer",
          backgroundColor: filters?.gender === "other" ? "green" : "transparent",
          color: filters?.gender === "other" ? "white" : "black",
        }}
        onClick={() => handleFilters("gender", "other")}
      >
        <i className="material-symbols-rounded me-2">transgender</i> Other
      </a>
    </li>
  </ul>
</div>
</>
  );
};

export default UserFilters;
