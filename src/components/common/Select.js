import React from "react";

const Select = ({
  label,
  name,
  value,
  onChange,
  required = false,
  options,
  error,
}) => {
  return (
    <div className="mb-3">
      <label>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <select
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">Select {label}</option>
        {options &&
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Select;
