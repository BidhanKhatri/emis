import Select from "react-select";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const options = [
  { value: "create-notice", label: "Create Notice" },
  { value: "update-notice", label: "Update Notice" },
  { value: "delete-notice", label: "Delete Notice" },
  { value: "view-notice", label: "View Notice" },
  { value: "create-attendance", label: "Create Attendance" },
  { value: "update-attendance", label: "Update Attendance" },
  { value: "delete-attendance", label: "Delete Attendance" },
  { value: "view-attendance", label: "View Attendance" },
  { value: "create-complaint", label: "Create Complaint" },
  { value: "update-complaint", label: "Update Complaint" },
  { value: "delete-complaint", label: "Delete Complaint" },
  { value: "view-complaint", label: "View Complaint" },
  { value: "create-assignment", label: "Create Assignment" },
  { value: "update-assignment", label: "Update Assignment" },
  { value: "delete-assignment", label: "Delete Assignment" },
  { value: "view-assignment", label: "View Assignment" },
  { value: "create-role", label: "Create Role" },
  { value: "update-role", label: "Update Role" },
  { value: "delete-role", label: "Delete Role" },
  { value: "view-role", label: "View Role" },
  { value: "create-permission", label: "Create Permission" },
  { value: "update-permission", label: "Update Permission" },
  { value: "delete-permission", label: "Delete Permission" },
  { value: "view-permission", label: "View Permission" },
  { value: "create-question", label: "Create Question" },
  { value: "update-question", label: "Update Question" },
  { value: "delete-question", label: "Delete Question" },
  { value: "view-question", label: "View Question" },
  { value: "create-answer", label: "Create Answer" },
  { value: "update-answer", label: "Update Answer" },
  { value: "delete-answer", label: "Delete Answer" },
  { value: "view-answer", label: "View Answer" },
];

// Custom styles for react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    height: "150px", // Set fixed height for the select field
    minHeight: "50px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "140px", // Match the fixed height here
    padding: "0 8px",
    overflowY: "auto",
  }),
  menu: (provider) => ({
    ...provider,
    maxHeight: "160px",
    overflowY: "auto",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0", // Remove extra margin
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "50px", // Match the fixed height here
  }),
};

const UpdateRolePop = ({ roleName, updateRoleData }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const { authToken } = useContext(AuthContext);
  const toast = useToast();

  //   console.log(permissionObject);

  // Initialize the selectedOptions state based on updateRoleData
  useEffect(() => {
    if (
      updateRoleData &&
      updateRoleData.permissionId &&
      updateRoleData.permissionName
    ) {
      const initialSelectedOptions = updateRoleData.permissionId.map(
        (id, index) => ({
          value: id,
          label: updateRoleData.permissionName[index],
        })
      );
      setSelectedOptions(initialSelectedOptions);
    }
  }, [updateRoleData]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  // Function to handle updating the role
  const handleUpdate = async () => {
    const permissionObject = selectedOptions.reduce((acc, val) => {
      acc[val.label] = 1 ;
      return acc;
    }, {});

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      };

      const result = await axios.post(
        "/proxy/roles/update_role/",
        { role: roleName, permission: permissionObject },
        config
      );
      if (result.data) {
        toast({
          title: result.data.msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        return;
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "An error occurred",
        description: err.message || "Unable to update the role",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div>
          <h2 className="text-2xl mb-4 text-center p-1  ">
            Update Role: {roleName}
          </h2>
        </div>
        <div>
          <Select
            options={options}
            value={selectedOptions} // Use the state variable for value
            isMulti={true}
            onChange={handleChange}
            styles={customStyles}
          />
        </div>
        <div>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 px-8 py-2 text-white rounded-md mt-4 w-full hover:opacity-90"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateRolePop;
