import React,{useState} from 'react'

const CustomInput = () => {
      const [value, setValue] = useState("");
  return (
     <div className="floating-input">
      <input
        type="text"
        id="name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <label htmlFor="name" className={value ? "active" : ""}>
        Name
      </label>
      <span className="underline" />
    </div>
  )
}

export default CustomInput