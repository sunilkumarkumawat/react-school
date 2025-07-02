import { gridLayer } from "leaflet";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeesGroups } from "../../redux/feesGroupSlice";
import { AppContext } from "../../context/AppContext";
import { fetchFeesTypes } from "../../redux/feesTypeSlice";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

const FeesMaster = () => {
  const dispatch = useDispatch();
  const { token } = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL || "";

  const feesGroups = useSelector((state) => state.feesGroups.feesGroups || []);
  const feesTypes = useSelector((state) => state.feesTypes.feesTypes || []);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedFeeTypes, setSelectedFeeTypes] = useState([]);
  const [feesMasterData, setFeesMasterData] = useState([]);

  useEffect(() => {
    if (token) {
      dispatch(fetchFeesGroups({ API_URL, token }));
      dispatch(fetchFeesTypes({ API_URL, token }));
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

    // Keep only types that match updated groups
    const updatedGroupIds = updatedGroups.map((g) => g.id);
    const filteredTypes = selectedFeeTypes.filter((type) =>
      updatedGroupIds.includes(type.fees_group_id)
    );
    setSelectedFeeTypes(filteredTypes);
  };

  const handleFeesTypeCheckbox = (typeItem) => {
    const exists = selectedFeeTypes.find((t) => t.id === typeItem.id);
    if (exists) {
      setSelectedFeeTypes(selectedFeeTypes.filter((t) => t.id !== typeItem.id));
    } else {
      setSelectedFeeTypes([
        ...selectedFeeTypes,
        {
          ...typeItem,
          amount: "",
          due_date: "",
        },
      ]);
    }
  };
  const handleSave = () => {
    if (
      !selectedClass ||
      selectedGroups.length === 0 ||
      selectedFeeTypes.length === 0
    ) {
      alert("Please select class, fee group(s), and fee type(s)");
      return;
    }

    const newEntry = {
      class_id: selectedClass.id,
      class_name: selectedClass.name,
      groups: selectedGroups.map((g) => ({ id: g.id, name: g.name })),
      types: selectedFeeTypes.map((t) => ({ id: t.id, name: t.name })),
    };

    setFeesMasterData((prev) => [...prev, newEntry]);

    // Reset selections
    setSelectedClass(null);
    setSelectedGroups([]);
    setSelectedFeeTypes([]);
  };
  const updateFeeTypeDetail = (id, field, value) => {
    const updated = selectedFeeTypes.map((t) =>
      t.id === id ? { ...t, [field]: value } : t
    );
    setSelectedFeeTypes(updated);
  };
  const selectedGroupIds = selectedGroups.map((g) => Number(g.id));

  const filteredFeesTypes = feesTypes.filter((type) =>
    selectedGroupIds.includes(Number(type.fees_group_id))
  );
  // alert(JSON.stringify(filteredFeesTypes));
  return (
    <div className="row g-3">
      <div className="col-md-12 p-0">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="fa fa-user-shield"></i> Fees Master
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Class Selection */}
              <div className="col-md-3 col-12">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h5 className="text-gray-600 mb-3 text-sm font-medium">
                    Select Class
                  </h5>
                  {classes.map((classItem) => (
                    <div
                      key={classItem.id}
                      onClick={() => handleClassSelect(classItem)}
                      className={`p-2 mb-2 border rounded cursor-pointer ${
                        selectedClass?.id === classItem.id
                          ? "bg-primary text-white fw-medium"
                          : "bg-light text-dark"
                      }`}
                    >
                      <h6 className="mb-0">{classItem.name}</h6>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fee Group Selection */}
              <div className="col-md-3 col-12">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h5 className="text-gray-600 mb-3 text-sm font-medium">
                    Select Fee Groups
                  </h5>
                  {feesGroups.map((groupItem) => (
                    <div className="form-check mb-2" key={groupItem.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedGroups.some(
                          (g) => g.id === groupItem.id
                        )}
                        onChange={() => handleFeesGroupCheckbox(groupItem)}
                        id={`group-${groupItem.id}`}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`group-${groupItem.id}`}
                      >
                        {groupItem.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fee Type Selection */}
              <div className="col-md-6 col-12">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h5 className="text-gray-600 mb-3 text-sm font-medium">
                    Select Fee Types
                  </h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Type Name</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFeesTypes.map((typeItem) => {
                        const selected =
                          selectedFeeTypes.find((t) => t.id === typeItem.id) ||
                          {};
                        return (
                          <tr key={typeItem.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={!!selected.id}
                                onChange={() =>
                                  handleFeesTypeCheckbox(typeItem)
                                }
                              />
                            </td>
                            <td>{typeItem.name}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={selected.amount || ""}
                                onChange={(e) =>
                                  updateFeeTypeDetail(
                                    typeItem.id,
                                    "amount",
                                    e.target.value
                                  )
                                }
                                disabled={!selected.id}
                              />
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
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-4">
              <button className="btn btn-success" onClick={handleSave}>
                Save
              </button>
            </div>

            {/* Show Saved Data */}
            {feesMasterData.length > 0 && (
              <div className="mt-4">
                <h5>Saved Entries:</h5>
                <pre>{JSON.stringify(feesMasterData, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesMaster;
