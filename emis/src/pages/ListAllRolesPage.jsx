import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import ViewPermissionsPop from "../components/ViewPermissionsPop";
import { AuthContext } from "../context/AuthContext";
import UpdateRolePop from "../components/UpdateRolePop";

function ListAllRolesPage() {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [updateRolePopUp, setUpdateRolePopUp] = useState(false);
  const [permissionData, setPermissionData] = useState({});
  const [roleName, setRoleName] = useState("");
  const [updateRoleData, setUpdateRoleData] = useState({});
  const { authToken } = useContext(AuthContext);
  const toast = useToast();

  function togglePopup(permissionId, permissionName) {
    setIsOpen(!isOpen);
    setPermissionData({
      permissionId,
      permissionName,
    });
    console.log("Toggle Popup:", permissionId, permissionName); // Debugging
  }

  async function fetchRoles() {
    if (!authToken || !authToken.access) {
      console.error("Auth token is missing or invalid."); // Debugging
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const result = await axios.get(
        "/proxy/roles/list_role_with_permission/",
        config
      );
      if (result && result.data) {
        console.log("Fetched Roles Data:", result.data); // Debugging
        setData(result.data);
      }
    } catch (err) {
      console.error(
        "Error fetching roles:",
        err.response ? err.response.data : err.message
      ); // Enhanced error logging
    }
  }

  useEffect(() => {
    if (authToken) {
      fetchRoles();
    }
  }, [authToken]);

  function toggleUpdate(permissionId, permissionName, roleName) {
    setUpdateRolePopUp(!updateRolePopUp);
    setUpdateRoleData({
      permissionId,
      permissionName,
    });
    setRoleName(roleName);
    console.log("Toggle Update:", permissionId, permissionName, roleName); // Debugging
  }

  async function handleDelete(id) {
    if (!authToken || !authToken.access) {
      console.error("Auth token is missing or invalid."); // Debugging
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const result = await axios.delete(
        `/proxy/roles/delete_role/${id}/`,
        config
      );
      if (result && result.data) {
        console.log("Deleted Role:", id, result.data); // Debugging
        toast({
          title: result.data.msg,
          status: "success",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
        setData(data.filter((item) => item.role_id !== id));
      }
    } catch (err) {
      console.error(
        "Error deleting role:",
        err.response ? err.response.data : err.message
      ); // Enhanced error logging
    }
  }

  return (
    <>
      <div className="flex">
        <div className="flex-grow bg-gray-100 min-h-screen">
          <div className="px-6">
            <div className="container mx-auto">
              <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="w-full bg-blue-500 text-white uppercase text-sm leading-normal">
                      <th className="px-4 py-2 border border-gray-300">
                        Role ID
                      </th>
                      <th className="px-4 py-2 border border-gray-300">
                        Role Name
                      </th>
                      <th className="px-4 py-2 border border-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {data.map((item) => (
                      <tr
                        key={item.role_id}
                        className="border-b border-gray-200 bg-white even:bg-gray-200"
                      >
                        <td className="py-3 px-6 text-left font-semibold text-md border border-gray-300">
                          {item.role_id}
                        </td>
                        <td className="py-3 px-6 text-left font-semibold text-md border border-gray-300">
                          {item.name}
                        </td>
                        <td className="py-3 px-6 text-left font-semibold text-md border border-gray-300">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() =>
                                togglePopup(
                                  item.role_permissions.map(
                                    (permission) => permission.permission_id
                                  ),
                                  item.role_permissions.map(
                                    (permission) => permission.name
                                  )
                                )
                              }
                              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600"
                            >
                              View Permissions
                            </button>
                            <button
                              onClick={() =>
                                toggleUpdate(
                                  item.role_permissions.map(
                                    (permission) => permission.permission_id
                                  ),
                                  item.role_permissions.map(
                                    (permission) => permission.name
                                  ),
                                  item.name
                                )
                              }
                              className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md w-24 transition duration-300 hover:bg-gray-600"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDelete(item.role_id)}
                              className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md w-24 transition duration-300 hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
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

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity">
          <div
            onClick={togglePopup}
            className="absolute top-10 right-4 w-10 h-10 text-white cursor-pointer text-2xl z-50"
          >
            &#x2715;
          </div>
          <ViewPermissionsPop permissionData={permissionData} />
        </div>
      )}

      {updateRolePopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity">
          <div
            onClick={toggleUpdate}
            className="absolute top-10 right-4 w-10 h-10 text-white cursor-pointer text-2xl z-50"
          >
            &#x2715;
          </div>
          <UpdateRolePop roleName={roleName} updateRoleData={updateRoleData} />
        </div>
      )}
    </>
  );
}

export default ListAllRolesPage;
