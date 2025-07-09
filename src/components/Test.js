import React, { useEffect, useState } from "react";

const Test = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [result, setResult] = useState(0);

  // useEffect runs when 'a' or 'b' changes
  useEffect(() => {
    setResult(Number(a) + Number(b));
  }, [a]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>➕ Real-Time Addition</h2>

      <input
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
        placeholder="Enter A"
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />

      <input
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
        placeholder="Enter B"
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />

      <h3>Result: {result}</h3>
    </div>
  );
};

export default Test;
