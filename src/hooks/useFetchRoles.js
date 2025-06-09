import { useState, useEffect } from "react";
import { fetchRoles } from "../api/apiHelper";  // Ensure correct path

const useFetchRoles = () => {
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchRoles();
        if (data) {
          const rolesMap = data.reduce((acc, role) => {
            acc[role.id] = role.name;
            return acc;
          }, {});
          setRoles(rolesMap);
        } else {
          setError("Failed to load roles.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      }
      setLoading(false);
    };

    loadRoles();
  }, []);

  return { roles, loading, error };
};

export default useFetchRoles;
