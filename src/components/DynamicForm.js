import React from "react";
import CustomInput from "./common/CustomInput";
import CustomeDropDown from "./common/CustomeDropDown";

const DynamicForm = ({
  roleName,
  optionsList,
  roleId,
  fields = [],
  formData = {},
  errors = {},
  handleChange,
  handleSubmit,
  branchId,
}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, `create${roleId ? `/${roleId}` : roleName}`);
  };

  return (
    <div className="card shadow-sm border-1">
      {/* <div className="card-header bg-primary text-white">
        <h5 className="mb-0">{roleName} Form</h5>
      </div> */}
      <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div className="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
              <h6 className="text-white text-capitalize ps-3">
               {roleName} Form
              </h6>
            </div>
          </div>

      <div className="card-body">
        <form className="row g-3" onSubmit={onSubmit}>
          {fields.map((field) => (
            <div
              key={field.name}
              className={`col-md-${field.col || "6"}`}
              style={field.type === "hidden" ? { display: "none" } : {}}
            >
              <label className="form-label">
                {field.label}
                {field.required === 1 && (
                  <span className="text-danger"> *</span>
                )}
              </label>

              {field.type === "select" ? (
                <select
                  className={`form-select ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                  name={field.name}
                  onChange={handleChange}
                  value={formData[field.name] || ""}
                >
                  <option value="">Select {field.label}</option>
                  {optionsList[field.name] &&
                  optionsList[field.name].length > 0 ? (
                    optionsList[field.name].map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))
                  ) : (
                    <option disabled>No options available</option>
                  )}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  className={`form-control ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={field.type}
                  className={`form-control ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={
                    field.type === "file"
                      ? undefined
                      : formData[field.name] || ""
                  }
                  onChange={handleChange}
                />
              )}

              {errors[field.name] && (
                <div className="invalid-feedback">{errors[field.name]}</div>
              )}
            </div>
          ))}

          <CustomInput />
          <CustomeDropDown />

          <div className="col-12 mt-4 text-end">
            <button type="submit" className="btn btn-success px-4">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
