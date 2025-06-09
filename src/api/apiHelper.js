import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;
// Fetch users by role ID
export const fetchUsersByRole = async (rowData) => {
  try {
    const response = await axios.post(`${API_URL}/getUsersData`, rowData);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users" };
  }
};
export const fetchColumns = async (branchId, roleId,adminId) => {
  try {
    const response = await axios.post(`${API_URL}/getColumns`, {
      role_id: roleId,
      branch_id: branchId,
      admin_id: adminId,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users" };
  }
};

// Fetch sidebar menu for a user
export const fetchSidebarByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/menu/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sidebar menu:", error);
    return { error: "Failed to fetch sidebar menu" };
  }
};

// Fetch all roles
export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/getRoles`);
    return response.data; // Assuming the API returns an array of roles
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

// Fetch states
export const fetchStates = async () => {
  try {
    const response = await axios.get(`${API_URL}/states`);
    return response.data; // Expecting [{id: 1, name: "State 1"}, {id: 2, name: "State 2"}]
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
};

// Fetch cities based on selected state
export const fetchCities = async (stateId) => {
  try {
    const response = await axios.get(`${API_URL}/cities?state_id=${stateId}`);
    return response.data; // Expecting [{id: 1, name: "City 1"}, {id: 2, name: "City 2"}]
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};


// Common delete function
export const deleteItem = async ({ modelName, id, token }) => {
  try {
    const response = await axios.post(
      `${API_URL}/common-delete`,
      {
        model: modelName,
        id: id
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data; // Expected: { status: true, message: "Deleted successfully" }
  } catch (error) {
    console.error("Delete error:", error);
    return { status: false, message: "Deletion failed" };
  }
};



export const handleDeleteRequest = async ({
  apiUrl,
  ids, // Accepts single id (string/number) or array of ids
  modal,
  token,
  confirmMessage = "Are you sure you want to delete the selected item(s)?",
  onSuccess = () => {},
  onError = () => {}
}) => {
  if (!window.confirm(confirmMessage)) return;

  try {
    // Support both single and multiple ids
    const idList = Array.isArray(ids) ? ids : [ids];

    // If only one id, use the old endpoint
    if (idList.length === 1) {
      await fetch(`${apiUrl}/delete/${idList[0]}/${modal}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // For bulk delete, use a bulk endpoint or send as POST (adjust as per your API)
      await fetch(`${apiUrl}/bulk-delete/${modal}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: idList }),
      });
    }
    onSuccess();
  } catch (error) {
    console.error('Error deleting:', error);
    onError(error);
  }
};


export const handleStatusChangeRequest = async ({
  apiUrl,
  ids, // Accepts single id (string/number) or array of ids
  modal,
  token,
  newStatus, // e.g. "Active" or "Inactive"
  confirmMessage = "Are you sure you want to change the status of the selected item(s)?",
  onSuccess = () => {},
  onError = () => {}
}) => {
  if (!window.confirm(confirmMessage)) return;

  try {
    const idList = Array.isArray(ids) ? ids : [ids];

    if (idList.length === 1) {
      // Single status change endpoint (adjust as per your API)
      await fetch(`${apiUrl}/status/${idList[0]}/${modal}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } else {
      // Bulk status change endpoint (adjust as per your API)
      await fetch(`${apiUrl}/bulk-status/${modal}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: idList, status: newStatus }),
      });
    }
    onSuccess();
  } catch (error) {
    console.error('Error changing status:', error);
    onError(error);
  }
};