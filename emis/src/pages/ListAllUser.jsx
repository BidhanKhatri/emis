import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Box, Button, Text, useToast } from "@chakra-ui/react";

import UpdateUserPage from "./UpdateUserPage";
import LoadingGif from "../assets/loading-gif.gif";
import { AuthContext } from "../context/AuthContext";

const ListAllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // New state for filtering
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [defaultFormData, setDefaultFormData] = useState({});
  const toast = useToast();

  const { authToken } = useContext(AuthContext);

  console.log(
    `Form data from state ${JSON.stringify(defaultFormData, null, 2)}`
  );

  const fetchUsers = async () => {
    // const newToken = JSON.parse(localStorage.getItem("newToken"));

    if (!authToken || !authToken.access) {
      setError("Invalid or missing token.");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const response = await axios.get("/proxy/user/list/", config);
      const allUsers = [];

      if (Array.isArray(response.data[0].teacher)) {
        allUsers.push(
          ...response.data[0].teacher.map((user) => ({
            id: user.id,
            username: user.username,
            role_id: user.role_id,
            email: user.email,
          }))
        );
      }

      if (Array.isArray(response.data[0].student)) {
        allUsers.push(
          ...response.data[0].student.map((user) => ({
            id: user.id,
            username: user.username,
            role_id: user.role_id,
            email: user.email,
          }))
        );
      }

      if (allUsers.length === 0) {
        setError("No users found.");
      } else {
        setUsers(allUsers);
        setError("");
      }
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setError("Unauthorized. Please check your credentials.");
        } else if (error.response.status === 404) {
          setError("API endpoint not found.");
        } else {
          setError("Error fetching users. Please try again.");
        }
      } else if (error.request) {
        setError("No response from server. Please check the API or network.");
      } else {
        setError("Request error. Please try again.");
      }

      toast({
        title: "Error fetching users",
        description:
          error.message || "An error occurred while fetching user data.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (userId) => {
    console.log(`Update user with ID: ${userId}`);
    // Implement update logic here

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const result = await axios.put("/user/update_user/", config);
    } catch (error) {
      console.log(error);
    }
  };

  //function to set the default form data
  const handleUpdateToggle = (userId, userUsername, userEmail, userRole_id) => {
    setToggleUpdate(!toggleUpdate);
    setDefaultFormData({ userId, userUsername, userEmail, userRole_id });
  };

  const handleDelete = async (userId) => {
    toast({
      title: "Confirm Delete",
      description: "Are you sure you want to Delete?",
      status: "warning",
      duration: 3000,
      position: "top-right",
      isClosable: true,
      render: () => (
        <Box
          color="black"
          p={3}
          className="bg-white flex flex-col items-center justify-center border border-gray-300/80"
          borderRadius="md"
          mt={16}
        >
          <Text fontWeight="bold">Confirm Delete!</Text>
          <Text>Are you sure you want to Delete?</Text>
          <Box>
            <Button
              mt={3}
              colorScheme="red"
              onClick={async () => {
                try {
                  // const newToken = JSON.parse(localStorage.getItem("newToken"));
                  const config = {
                    headers: {
                      Authorization: `Bearer ${authToken.access}`,
                    },
                  };
                  await axios.delete(`/proxy/user/delete/${userId}/`, config);
                  setUsers(users.filter((user) => user.id !== userId));
                  toast({
                    title: "User deleted",
                    status: "success",
                    duration: 3000,
                    position: "top-right",
                    isClosable: true,
                  });
                } catch (error) {
                  console.error("Error deleting user:", error);
                  toast({
                    title: "Error deleting user",
                    status: "error",
                    duration: 3000,
                    position: "top-right",
                    isClosable: true,
                  });
                }
                toast.closeAll(); // Close all toasts if user confirms
              }}
            >
              Delete
            </Button>
            <Button
              mt={3}
              ml={2}
              onClick={() => {
                toast.closeAll(); // Just close the toast if user cancels
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ),
    });
  };

  // Add a function to filter users
  const filteredUsers = users.filter((user) => {
    if (filter === "teachers") return user.role_id === 2;
    if (filter === "students") return user.role_id === 3;
    return true; // For "all" option
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="text-3xl font-bold h-screen flex flex-col justify-center items-center ">
        <img src={LoadingGif} alt="Loading..." className="w-14" />
        <p className="text-xl font-semibold">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex">
        <div className="flex-grow bg-gray-100 min-h-screen">
          <div className="px-6">
            <div className="container mx-auto ">
              {error && <div className="text-red-500">{error}</div>}
              {/* Buttons for filtering */}
              <div className="mb-4">
                <Button
                  colorScheme={filter === "all" ? "blue" : "gray"}
                  onClick={() => setFilter("all")}
                  className="mr-2"
                >
                  All
                </Button>
                <Button
                  colorScheme={filter === "teachers" ? "blue" : "gray"}
                  onClick={() => setFilter("teachers")}
                  className="mr-2"
                >
                  Teachers
                </Button>
                <Button
                  colorScheme={filter === "students" ? "blue" : "gray"}
                  onClick={() => setFilter("students")}
                >
                  Students
                </Button>
              </div>
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-2 border border-gray-300">ID</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Username
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Role ID
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Email</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="bg-white even:bg-gray-100">
                        <td className="px-4 py-2 border border-gray-300">
                          {user.id}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {user.username}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {user.role_id}
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          {user.email}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 flex justify-center items-center">
                          <button
                            onClick={() =>
                              handleUpdateToggle(
                                user.id,
                                user.username,
                                user.email,
                                user.role_id
                              )
                            }
                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white">
                      <td
                        colSpan="5"
                        className="px-4 py-2 border border-gray-300 text-center"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Update User Page */}
      {toggleUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className=" p-4 rounded-lg max-w-lg w-full">
            <button
              onClick={() => handleUpdateToggle()}
              className="absolute top-4 right-8 text-white hover:text-white/90 z-50 text-5xl"
            >
              &times; {/* Close Button */}
            </button>
            <UpdateUserPage
              userId={defaultFormData.userId}
              userUsername={defaultFormData.userUsername}
              userEmail={defaultFormData.userEmail}
              userRole_id={defaultFormData.userRole_id}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ListAllUser;
