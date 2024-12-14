import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useToast } from "@chakra-ui/react";
import LoadingGif from "../assets/news-loading.gif";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://10.5.15.11:8000";

const SimpleTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All"); // State for active tab (All, Solved, Unsolved)
  const [statusToggle, setStatusToggle] = useState(false);

  const toast = useToast();
  const { authToken } = useContext(AuthContext);

  const changeFinalStatusColor = () => {};

  const fetchComplaints = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.access}`, 
      },
    };

    try {
      const response = await axios.get("/proxy/roles/list/complaints/", config);
      setData(response.data.results);
      //console.log(`list complaints data ${response.data}`);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setLoading(false);
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized. Redirect to login or refresh token.");
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    // setStatusText(status);

    let toggle = status;

    if (toggle === "Solved") {
      toggle = true;
    } else {
      toggle = false;
    }
    setStatusToggle(toggle);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`, // Using authToken.access in the Authorization header
        },
      };
      const response = await axios.patch(
        `/proxy/roles/list/complaints/solve/${id}/`,
        {
          solved: toggle,
        },
        config
      );

      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((item) =>
            item.complainID === id
              ? { ...item, solved: status === "Solved" }
              : item
          )
        );
        // alert('Status updated successfully');
        toast({
          title: "Status updated successfully",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      } else {
        console.error("Failed to update status");
        // alert('Failed to update the status. Please try again.');
        toast({
          title: "Failed to update the status. Please try again",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        "Error updating the status. Please check the network or try again later."
      );
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter data based on the active tab
  const filteredData = data.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Solved") return item.solved;
    if (activeTab === "Unsolved") return !item.solved;
    return true;
  });

  if (loading) {
    return (
      <div className="text-3xl font-bold h-screen flex flex-col justify-center items-center ">
        <img src={LoadingGif} alt="Loading..." className="w-52" />
        <p className="text-xl font-semibold">Loading complaints...</p>
      </div>
    );
  }

  return (
    <>
      
          <div className="px-6">
            <div className="container mx-auto mt-10 ">
              {/* Buttons at the Top */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab("All")}
                  className={`px-6 py-2 rounded-md font-semibold border ${
                    activeTab === "All"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("Solved")}
                  className={`px-6 py-2 rounded-md font-semibold border ${
                    activeTab === "Solved"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Solved
                </button>
                <button
                  onClick={() => setActiveTab("Unsolved")}
                  className={`px-6 py-2 rounded-md font-semibold border ${
                    activeTab === "Unsolved"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Unsolved
                </button>
              </div>

              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-blue-500 text-white text-nowrap ">
                    <th className="px-4 py-2 border border-gray-300">
                      Complaint ID
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      User ID
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Title</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Description
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Photo</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Suggestion
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Date</th>
                    <th className="px-4 py-2 border border-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr
                      key={item.complainID}
                      className="bg-white even:bg-gray-100"
                    >
                      <td className="px-4 py-2 border border-gray-300">
                        {item.complainID}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {item.userID}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {item.title}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {item.description}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 h-20 w-20 overflow-hidden">
                        <img
                          src={`${BASE_URL}${item.photo}`}
                          onClick={() =>
                            window.open(`${BASE_URL}${item.photo}`)
                          }
                          alt="img"
                          className="w-full h-full cursor-pointer transition-all hover:scale-125  hover:ease-in-out duration-200"
                        />{" "}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {item.suggestion}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {new Date(item.date).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        <select
                          value={item.solved ? "Solved" : "Unsolved"}
                          onChange={(e) =>
                            handleStatusChange(item.complainID, e.target.value)
                          }
                          className={`border border-gray-300 rounded px-2 py-1 ${
                            item.solved ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          <option value="Solved" className="text-green-500">
                            Solved
                          </option>
                          <option value="Unsolved" className="text-red-500">
                            Unsolved
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </>
  );
};

export default SimpleTable;
