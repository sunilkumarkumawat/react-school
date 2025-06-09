import React from "react";

const RoleDisplay = ({ role, loading, error }) => {
  if (loading) return <p>Loading roles...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return <h1>Create {role || "Unknown Role"}</h1>;
};

export default RoleDisplay;
