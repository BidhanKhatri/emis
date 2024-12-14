import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";
import axios from "axios";
const CreatePermissionPage = () => {
  const { authToken } = useContext(AuthContext);
  const toast = useToast();

  const [name, setName] = useState("");

  //function to insert the new permission
  const insertPermission = async (e) => {
    e.preventDefault();
    try {
      if (!name) {
        toast({
          title: "Please enter permission name",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      };

      const result = await axios.post(
        "/proxy/roles/create_permission/",
        { name },
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
      } else {
        toast({
          title: "Failed to create permission",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        return;
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "An error occured",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }
  };

  return (
    <div className="flex items-center justify-center h-[70vh]">
      <form
        onSubmit={insertPermission}
        className="p-4 bg-white min-w-[500px] rounded"
        style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
      >
        <h1 className="text-xl font-semibold mb-4 text-center">
          Create Permission
        </h1>
        <label htmlFor="name" className=" mb-2 font-normal flex items-center">
          <FaUserCheck className="mr-2" /> Permission Name
        </label>
        <input
          type="text"
          placeholder="example: create-assignment"
          id="name"
          className="w-full p-2 mb-2 border border-gray-300 rounded outline-none focus:border-blue-500"
          onChange={(e) => setName(e.target.value)}
        />

        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 w-full">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreatePermissionPage;
