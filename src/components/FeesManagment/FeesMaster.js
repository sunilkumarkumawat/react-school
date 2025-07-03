import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeesGroups } from "../../redux/feesGroupSlice";
import { AppContext } from "../../context/AppContext";
import { fetchFeesTypes } from "../../redux/feesTypeSlice";
import { fetchFeesMasters } from "../../redux/feesMasterSlice";

import axios from "axios";

const FeesMaster = () => {
  const dispatch = useDispatch();
  const { token } = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL || "";

  const feesGroups = useSelector((state) => state.feesGroups.feesGroups || []);
  const feesTypes = useSelector((state) => state.feesTypes.feesTypes || []);
  const feesMasters = useSelector(
    (state) => state.feesMasters.feesMasters || []
  );
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedFeeTypes, setSelectedFeeTypes] = useState([]);

  const [selectAllGroups, setSelectAllGroups] = useState(false);
  const [selectAllTypes, setSelectAllTypes] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchFeesGroups({ API_URL, token }));
      dispatch(fetchFeesTypes({ API_URL, token }));
      dispatch(fetchFeesMasters({ API_URL, token }));
    }
  }, [token, API_URL, dispatch]);

  const classes = [
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
    { id: 3, name: "Class 3" },
    { id: 4, name: "Class 4" },
    { id: 5, name: "Class 5" },
  ];

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setSelectedGroups([]);
    setSelectedFeeTypes([]);
    setSelectAllGroups(false);
    setSelectAllTypes(false);
  };

  const handleSelectAllGroups = () => {
    if (selectAllGroups) {
      // Deselect all groups - this will clear all types
      setSelectedGroups([]);
      setSelectedFeeTypes([]);
      setSelectAllTypes(false);
    } else {
      // Select all groups - keep existing type data for types that are still available
      const allGroups = [...feesGroups];
      setSelectedGroups(allGroups);

      // Keep existing selected types data intact - no filtering needed since we're selecting all groups
      // The existing selectedFeeTypes already have their amount and due_date preserved

      // Update select all types state
      const allGroupIds = allGroups.map((g) => Number(g.id));
      const availableTypesForAllGroups = feesTypes.filter((type) =>
        allGroupIds.includes(Number(type.fees_group_id))
      );
      setSelectAllTypes(
        selectedFeeTypes.length === availableTypesForAllGroups.length &&
          availableTypesForAllGroups.length > 0
      );
    }
    setSelectAllGroups(!selectAllGroups);
  };

  const handleFeesGroupCheckbox = (groupItem) => {
    const isSelected = selectedGroups.some((g) => g.id === groupItem.id);
    let updatedGroups;

    if (isSelected) {
      updatedGroups = selectedGroups.filter((g) => g.id !== groupItem.id);
    } else {
      updatedGroups = [...selectedGroups, groupItem];
    }

    setSelectedGroups(updatedGroups);

    // Update select all checkbox state
    setSelectAllGroups(updatedGroups.length === feesGroups.length);

    // Keep only fee types that belong to the updated selected groups
    // IMPORTANT: Preserve the existing data (amount, due_date) for remaining types
    const updatedGroupIds = updatedGroups.map((g) => Number(g.id));
    const filteredSelectedTypes = selectedFeeTypes.filter((type) =>
      updatedGroupIds.includes(Number(type.fees_group_id))
    );
    setSelectedFeeTypes(filteredSelectedTypes);

    // Update select all types state based on remaining types
    const availableTypesForGroups = feesTypes.filter((type) =>
      updatedGroupIds.includes(Number(type.fees_group_id))
    );
    setSelectAllTypes(
      filteredSelectedTypes.length === availableTypesForGroups.length &&
        availableTypesForGroups.length > 0
    );
  };

  const handleSelectAllTypes = () => {
    if (selectAllTypes) {
      // Deselect all types
      setSelectedFeeTypes([]);
    } else {
      // Select all available types with empty amount and due_date
      const allTypes = filteredFeesTypes.map((type) => ({
        ...type,
        amount: "",
        due_date: "",
      }));
      setSelectedFeeTypes(allTypes);
    }
    setSelectAllTypes(!selectAllTypes);
  };

  const handleFeesTypeCheckbox = (typeItem) => {
    const exists = selectedFeeTypes.find((t) => t.id === typeItem.id);
    let updatedTypes;

    if (exists) {
      updatedTypes = selectedFeeTypes.filter((t) => t.id !== typeItem.id);
    } else {
      updatedTypes = [
        ...selectedFeeTypes,
        {
          ...typeItem,
          amount: "",
          due_date: "",
        },
      ];
    }

    setSelectedFeeTypes(updatedTypes);

    // Update select all types checkbox state
    setSelectAllTypes(updatedTypes.length === filteredFeesTypes.length);
  };

  const updateFeeTypeDetail = (id, field, value) => {
    const updated = selectedFeeTypes.map((t) =>
      t.id === id ? { ...t, [field]: value } : t
    );
    setSelectedFeeTypes(updated);
  };

  const handleSave = async () => {
    if (
      !selectedClass ||
      selectedGroups.length === 0 ||
      selectedFeeTypes.length === 0
    ) {
      alert("Please select class, fee group(s), and fee type(s)");
      return;
    }

    // Validate that all selected fee types have amount and due date
    const incompleteTypes = selectedFeeTypes.filter(
      (type) => !type.amount || !type.due_date
    );

    if (incompleteTypes.length > 0) {
      alert("Please fill amount and due date for all selected fee types");
      return;
    }

    const newEntry = {
      id: Date.now(), // Simple ID generation
      class_id: selectedClass.id,
      class_name: selectedClass.name,
      groups: selectedGroups.map((g) => ({ id: g.id, name: g.name })),
      fee_types: selectedFeeTypes.map((t) => ({
        id: t.id,
        name: t.name,
        amount: parseFloat(t.amount),
        due_date: t.due_date,
        fees_group_id: t.fees_group_id,
      })),
      created_at: new Date().toISOString(),
    };
    // Update UI state

    // Save only current entry to DB
    await handleSubmit([newEntry]);
    // Reset selections
    setSelectedClass(null);
    setSelectedGroups([]);
    setSelectedFeeTypes([]);
    setSelectAllGroups(false);
    setSelectAllTypes(false);

    //alert("Fees master data saved successfully!");
  };

  const handleSubmit = async (dataToSubmit) => {
    try {
      await axios.post(
        `${API_URL}/feesMaster`,
        { fees: dataToSubmit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(fetchFeesMasters({ API_URL, token }));
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const selectedGroupIds = selectedGroups.map((g) => Number(g.id));
  const filteredFeesTypes = feesTypes.filter((type) =>
    selectedGroupIds.includes(Number(type.fees_group_id))
  );

  // Update select all types state when filtered types change
  React.useEffect(() => {
    if (filteredFeesTypes.length > 0) {
      setSelectAllTypes(selectedFeeTypes.length === filteredFeesTypes.length);
    } else {
      setSelectAllTypes(false);
    }
  }, [filteredFeesTypes.length, selectedFeeTypes.length]);

  const deleteSavedEntry = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this Fees Master?"))
      return;
    try {
      await axios.delete(`${API_URL}/deleteFeesMaster/${entryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchFeesMasters({ API_URL, token }));
    } catch (error) {
      console.error("Error deleting Fees Master:", error);
    }
  };

  const handleModalAssign =()=>{
    alert("Fees Assign modal")
  }

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between">
              <h4 className="mb-0">
                <i className="fas fa-money-bill-wave me-2"></i> Fees Master
                Configuration
              </h4>
              <div>
                <button className="btn btn-primary" onClick={handleModalAssign}>Student Fees Assign</button>
                <button className="btn btn-primary">Student Fees Modification</button>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-4">
                {/* Class Selection */}
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0 text-white">
                        <i className="fas fa-graduation-cap me-2"></i> Select
                        Class
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="list-group">
                        {classes.map((classItem) => (
                          <button
                            key={classItem.id}
                            type="button"
                            onClick={() => handleClassSelect(classItem)}
                            className={`list-group-item list-group-item-action ${
                              selectedClass?.id === classItem.id
                                ? "bg-primary"
                                : ""
                            }`}
                          >
                            {classItem.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Group Selection */}
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0 text-white">
                        <i className="fas fa-layer-group me-2"></i> Select Fee
                        Groups
                      </h6>
                    </div>
                    <div className="card-body">
                      {selectedClass ? (
                        <div>
                          {feesGroups.length > 0 ? (
                            <div>
                              {/* Select All Groups Checkbox */}
                              <div className="form-check mb-3 border-bottom pb-2 d-flex align-items-center">
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  checked={selectAllGroups}
                                  onChange={handleSelectAllGroups}
                                  id="select-all-groups"
                                />
                                <label
                                  className="form-check-label fw-bold text-dark"
                                  htmlFor="select-all-groups"
                                >
                                  Select All Groups
                                </label>
                              </div>

                              {/* Individual Group Checkboxes */}
                              {feesGroups.map((groupItem) => (
                                <div
                                  className="form-check mb-3"
                                  key={groupItem.id}
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedGroups.some(
                                      (g) => g.id === groupItem.id
                                    )}
                                    onChange={() =>
                                      handleFeesGroupCheckbox(groupItem)
                                    }
                                    id={`group-${groupItem.id}`}
                                  />
                                  <label
                                    className="form-check-label fw-medium"
                                    htmlFor={`group-${groupItem.id}`}
                                  >
                                    {groupItem.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-muted text-center">
                              <i className="fas fa-info-circle me-2"></i>
                              No fee groups available
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-muted text-center">
                          <i className="fas fa-arrow-left me-2"></i>
                          Please select a class first
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fee Type Selection */}
                <div className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0 text-white">
                        <i className="fas fa-list-ul me-2"></i> Configure Fee
                        Types
                      </h6>
                    </div>
                    <div className="card-body">
                      {selectedGroups.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <thead className="bg-primary">
                              <tr>
                                <th width="10%">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={selectAllTypes}
                                      onChange={handleSelectAllTypes}
                                      id="select-all-types"
                                    />
                                    <label
                                      className="form-check-label text-white"
                                      htmlFor="select-all-types"
                                      title="Select All Types"
                                    ></label>
                                  </div>
                                </th>
                                <th width="30%">Fee Type</th>
                                <th width="30%">Amount (₹)</th>
                                <th width="30%">Due Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredFeesTypes.length > 0 ? (
                                filteredFeesTypes.map((typeItem) => {
                                  const selected =
                                    selectedFeeTypes.find(
                                      (t) => t.id === typeItem.id
                                    ) || {};
                                  return (
                                    <tr key={typeItem.id}>
                                      <td>
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            style={{ position: "unset" }}
                                            type="checkbox"
                                            checked={!!selected.id}
                                            onChange={() =>
                                              handleFeesTypeCheckbox(typeItem)
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className="fw-medium">
                                        {typeItem.name}
                                      </td>
                                      <td>
                                        <div className="input-group">
                                          <span className="input-group-text">
                                            ₹
                                          </span>
                                          <input
                                            type="number"
                                            className="form-control"
                                            placeholder="0.00"
                                            value={selected.amount || ""}
                                            onChange={(e) =>
                                              updateFeeTypeDetail(
                                                typeItem.id,
                                                "amount",
                                                e.target.value
                                              )
                                            }
                                            disabled={!selected.id}
                                            min="0"
                                            step="0.01"
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          className="form-control"
                                          value={selected.due_date || ""}
                                          onChange={(e) =>
                                            updateFeeTypeDetail(
                                              typeItem.id,
                                              "due_date",
                                              e.target.value
                                            )
                                          }
                                          disabled={!selected.id}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td
                                    colSpan="4"
                                    className="text-center text-muted"
                                  >
                                    <i className="fas fa-info-circle me-2"></i>
                                    No fee types available for selected groups
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-muted text-center">
                          <i className="fas fa-arrow-left me-2"></i>
                          Please select fee groups first
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="d-flex" style={{ gap: "20px" }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={
                        !selectedClass ||
                        selectedGroups.length === 0 ||
                        selectedFeeTypes.length === 0
                      }
                    >
                      <i className="fas fa-save me-2"></i> Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedClass(null);
                        setSelectedGroups([]);
                        setSelectedFeeTypes([]);
                        setSelectAllGroups(false);
                        setSelectAllTypes(false);
                      }}
                    >
                      <i className="fas fa-undo me-2"></i> Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Saved Configurations */}
              {feesMasters.length > 0 && (
                <div className="row mt-5">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                          <i className="fas fa-database me-2"></i> Fees Assigned
                          To Classes List ({feesMasters.length})
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead className="bg-primary">
                              <tr>
                                <th>Class</th>
                                <th>Fee Groups</th>
                                <th>Fee Types</th>
                                <th>Total Amount</th>
                                <th>Created</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {feesMasters.map((entry) => (
                                <tr key={entry.id}>
                                  <td>
                                    <span className="badge bg-primary">
                                      {entry.class_id} Class
                                    </span>
                                  </td>
                                  <td>
                                    {entry.groups.map((group) => (
                                      <span
                                        key={group.id}
                                        className="badge bg-info me-1"
                                      >
                                        {group.name}
                                      </span>
                                    ))}
                                  </td>
                                  <td>
                                    {entry.fee_types.map((type) => {
                                      // Find the group name for this fee type

                                      return (
                                        <div key={type.id} className="mb-2">
                                          <div className="d-flex align-items-center flex-wrap">
                                            <span className="badge bg-secondary me-2 mb-1">
                                              {type.group_name}
                                            </span>
                                            &nbsp;
                                            <small className="mb-1">
                                              <strong>{type.type_name}:</strong>{" "}
                                              ₹{type.amount}
                                              <span className="text-muted">
                                                {" "}
                                                (Due: {type.due_date})
                                              </span>
                                            </small>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </td>
                                  <td>
                                    <strong className="text-success">
                                      ₹{entry.total_amount.toFixed(2)}
                                    </strong>
                                  </td>
                                  <td>
                                    <small className="text-muted">
                                      {new Date(
                                        entry.created_at
                                      ).toLocaleDateString()}
                                    </small>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => deleteSavedEntry(entry.id)}
                                      title="Delete Configuration"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesMaster;
