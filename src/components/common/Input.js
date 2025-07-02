import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  ...rest
}) => (
  <div className="mb-3">
    <label>
      {label} {required && <span style={{ color: 'red' }}>*</span>}
    </label>
    <input
      type={type}
      placeholder={label}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      name={name}
      value={value}
      onChange={onChange}
      // required={required}  // <-- REMOVE THIS LINE
      {...rest}
    />
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

export default Input;