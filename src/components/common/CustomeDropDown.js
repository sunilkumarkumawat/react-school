import React, { useState } from "react";

const CustomeDropDown = () => {
     const [value, setValue] = useState("");
  return (
      <div className="floating-select">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      >
        <option value="" disabled hidden></option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      <label className={value ? "active" : ""}>Select Option</label>
      <span className="underline" />
    </div>
  )
}

export default CustomeDropDown