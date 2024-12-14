import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";

const ListPermissionPage = () => {
  const { authToken } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const toast = useToast();

  //   function to fetch all permission with permission id
  const fetchPermissions = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      };
      const result = await axios.get("/proxy/roles/list_permission/", config);
      if (Array.isArray(result.data)) {
        // console.log(result.data);
        setData(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPermissions();
    return () => {};
  }, [data]);

  //   function to delete the permission
  const deletePermission = async (permissionId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      };
      const result = await axios.delete(
        `/proxy/roles/delete_permission/${permissionId}/`,
        config
      );
      if (result && result.data) {
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
      console.log(err);
      toast({
        title: err.response.data.detail || "An error occured!",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }
  };
  return (
    <div>
      <div className="flex">
        <div className="flex-grow bg-gray-100 min-h-screen">
          <div className="px-6">
            <div className="container mx-auto">
              <div className="container mx-auto">
                <div className="overflow-x-auto shadow-lg rounded-lg">
                  <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                      <tr className="w-full bg-blue-500 text-white uppercase text-sm leading-normal">
                        <th className="px-4 py-2 border border-gray-300">
                          Permission ID
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Permission Name
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {data.map((items) => (
                        <tr
                          key={items.permission_id}
                          className="border-b border-gray-200  bg:white even:bg-gray-200"
                        >
                          <td className="py-3 px-6 text-left font-semibold text-md border border-gray-300">
                            {items.permission_id}
                          </td>
                          <td className="py-3 px-6 text-left font-semibold text-md border border-gray-300">
                            {items.name}
                          </td>
                          <td className="py-3 px-6 text-left font-semibold text-md border border-gray-300">
                            <div className="flex justify-center gap-4">
                              {/* <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md  transition duration-300 hover:bg-blue-600">
                                View Permissions
                              </button> */}
                              {/* <button
                                
                                className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md w-24 transition duration-300 hover:bg-gray-600"
                              >
                                Update
                              </button> */}
                              <div
                                onClick={() =>
                                  deletePermission(items.permission_id)
                                }
                                className="bg-gray-400/20 text-red-500 font-semibold px-4 py-2  flex items-center justify-center rounded-md w-24 transition duration-300 hover:scale-125 cursor-pointer"
                              >
                                <FaTrash />
                              </div>
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
      </div>
    </div>
  );
};

export default ListPermissionPage;
