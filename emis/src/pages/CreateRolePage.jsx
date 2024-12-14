import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import Select from "react-select";

import { MdPersonAdd } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";
import LoadingGif from "../assets/loading-gif.gif";
import { AuthContext } from "../context/AuthContext";

//permissons list
// const options = [
//   { value: "create-notice", label: "Create Notice" },
//   { value: "update-notice", label: "Update Notice" },
//   { value: "delete-notice", label: "Delete Notice" },
//   { value: "view-notice", label: "View Notice" },

//   { value: "create-attendance", label: "Create Attendance" },
//   { value: "update-attendance", label: "Update Attendance" },
//   { value: "delete-attendance", label: "Delete Attendance" },
//   { value: "view-attendance", label: "View Attendance" },

//   { value: "create-complaint", label: "Create Complaint" },
//   { value: "update-complaint", label: "Update Complaint" },
//   { value: "delete-complaint", label: "Delete Complaint" },
//   { value: "view-complaint", label: "View Complaint" },

//   { value: "create-assignment", label: "Create Assignment" },
//   { value: "update-assignment", label: "Update Assignment" },
//   { value: "delete-assignment", label: "Delete Assignment" },
//   { value: "view-assignment", label: "View Assignment" },

//   { value: "create-role", label: "Create Role" },
//   { value: "update-role", label: "Update Role" },
//   { value: "delete-role", label: "Delete Role" },
//   { value: "view-role", label: "View Role" },

//   { value: "create-permission", label: "Create Permission" },
//   { value: "update-permission", label: "Update Permission" },
//   { value: "delete-permission", label: "Delete Permission" },
//   { value: "view-permission", label: "View Permission" },

//   { value: "create-question", label: "Create Question" },
//   { value: "update-question", label: "Update Question" },
//   { value: "delete-question", label: "Delete Question" },
//   { value: "view-question", label: "View Question" },

//   { value: "create-answer", label: "Create Answer" },
//   { value: "update-answer", label: "Update Answer" },
//   { value: "delete-answer", label: "Delete Answer" },
//   { value: "view-answer", label: "View Answer" },
// ];

const customStyles = {
  menu: (provider) => ({
    ...provider,
    maxHeight: "auto",
    overflowY: "auto",
  }),
};

function CreatePermission() {
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { authToken } = useContext(AuthContext);

  const toast = useToast();

  // Create permission object based on selected options
  const permissionObject = selectedOptions.reduce((acc, val) => {
    acc[val.value] = true; // Set permission value to true
    return acc;
  }, {});

  // Log current permissions
  console.log(permissions);

  // Update permissions state whenever selectedOptions change
  useEffect(() => {
    setPermissions(permissionObject);
  }, [selectedOptions]); // Add selectedOptions to the dependency array

  const handleSelectedOptions = (selected) => {
    setSelectedOptions(selected); // Update selected options
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || Object.keys(permissions).length < 1) {
      toast({
        title: "Please add role and at least one permission",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    // const newToken = JSON.parse(localStorage.getItem("newToken"));

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      setLoading(true);
      const result = await axios.post(
        "/proxy/roles/create_role/",
        { role, permission: permissions },
        config
      );
      //   console.log(result.data);
      if (result.data) {
        const backendMsg = result.data.msg;
        toast({
          title: backendMsg,
          status:
            backendMsg === "Role created Successfully" ? "success" : "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        setLoading(false);
      } else {
        const errMsg = error.respone.data.msg;
        toast({
          title: errMsg,
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      const errMsg = error.respone.data.msg;
      toast({
        title: errMsg,
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  //function for getting all premissions
  const getAllPermissions = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      };
      const result = await axios.get("/proxy/roles/list_permission/", config);

      // Assuming result.data is an array of permission objects with a "name" field
      // Map the response to the format expected by react-select
      const formattedOptions = result.data.map((item) => ({
        value: item.name,
        label:
          item.name.charAt(0).toUpperCase() +
          item.name.slice(1).replace(/-/g, " "),
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPermissions();
  }, []);

  return (
    <div className="flex">
      <div className="flex-grow bg-gray-100 min-h-screen">
        <div className="px-6">
          <div className="container mx-auto ">
            <div>
              <form
                onSubmit={handleSubmit}
                className="bg-white max-w-lg mx-auto p-6 rounded-md shadow-md space-y-8"
              >
                <p className="text-center text-2xl ">Create Role</p>
                <div>
                  <label
                    htmlFor="role"
                    className="font-semibold flex items-center"
                  >
                    <MdPersonAdd className="mr-3" />
                    Add Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="example: teacher"
                    className="outline-none border border-gray-400 rounded-md px-2 py-2 w-full mt-4 focus:border-blue-700"
                  />
                </div>
                <div>
                  <p className="font-semibold flex items-center">
                    <label
                      htmlFor="permissions"
                      className="font-semibold flex items-center"
                    >
                      <FaUserShield className="mr-3" />
                      Assign Permissions
                    </label>
                  </p>

                  {/* <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <input
                        id="create-assignment"
                        type="checkbox"
                        className="cursor-pointer"
                        onChange={(e) =>
                          setPermissions((prevPermissions) => ({
                            ...prevPermissions,
                            [e.target.id]: e.target.checked,
                          }))
                        }
                      />{" "}
                      <label
                        className="font-normal cursor-pointer"
                        htmlFor="create-assignment"
                      >
                        create-assignment
                      </label>
                    </div>
                    <div>
                      <input
                        id="update-assignment"
                        type="checkbox"
                        className="cursor-pointer"
                        onChange={(e) =>
                          setPermissions((prevPermissions) => ({
                            ...prevPermissions,
                            [e.target.id]: e.target.checked,
                          }))
                        }
                      />{" "}
                      <label
                        className="font-normal cursor-pointer"
                        htmlFor="update-assignment"
                      >
                        update-assignment
                      </label>
                    </div>
                    <div>
                      <input
                        id="view-assignment"
                        type="checkbox"
                        className="cursor-pointer"
                        onChange={(e) =>
                          setPermissions((prevPermissions) => ({
                            ...prevPermissions,
                            [e.target.id]: e.target.checked,
                          }))
                        }
                      />{" "}
                      <label
                        className="font-normal cursor-pointer"
                        htmlFor="view-assignment"
                      >
                        view-assignment
                      </label>
                    </div>
                    <div>
                      <input
                        id="create-answer"
                        type="checkbox"
                        className="cursor-pointer"
                        onChange={(e) =>
                          setPermissions((prevPermissions) => ({
                            ...prevPermissions,
                            [e.target.id]: e.target.checked,
                          }))
                        }
                      />{" "}
                      <label
                        className="font-normal cursor-pointer"
                        htmlFor="create-answer"
                      >
                        create-answer
                      </label>
                    </div>
                  </div> */}
                  {/* Multiselect permission */}
                  <div>
                    <Select
                      options={options}
                      value={selectedOptions}
                      onChange={handleSelectedOptions}
                      isMulti={true}
                      styles={customStyles}
                      className="w-full mt-4"
                      id="permissions"
                    />
                  </div>
                </div>
                <div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:opacity-90 transition-all ease-in-out duration-200">
                    {loading ? (
                      <img
                        src={LoadingGif}
                        alt="loading gif"
                        className="w-5 h-5 mx-auto"
                      />
                    ) : (
                      "Create Role"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePermission;
