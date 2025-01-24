import React, { useContext, useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { FaUser, FaIdBadge, FaUserTag, FaEnvelope } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import LoadingGif from "../assets/loading-gif.gif";
function UpdateUserPage({ userId, userUsername, userEmail, userRole_id }) {
  const [id, setId] = useState(userId);
  const [name, setName] = useState(userUsername);
  const [email, setEmail] = useState(userEmail);
  const [role, setRole] = useState(userRole_id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setId(userId);
    setName(userUsername);
    setEmail(userEmail);
    setRole(userRole_id);
  }, [userId, userUsername, userEmail, userRole_id]);

  const { createUser, updateToken } = useContext(AuthContext);

  async function onSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <div>
        <div className="px-6">
          <div className="flex justify-center items-center min-h-screen my-2 w-full">
            <div className="bg-white shadow-lg rounded-lg w-full overflow-hidden pb-8 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                className="svg_img"
              >
                <path
                  fill="#3B82F6"
                  fillOpacity="1"
                  d="M0,128L40,149.3C80,171,160,213,240,234.7C320,256,400,256,480,224C560,192,640,128,720,128C800,128,880,192,960,213.3C1040,235,1120,213,1200,218.7C1280,224,1360,256,1400,272L1440,288L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
                ></path>
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
                Update User
              </h2>

              <form
                onSubmit={onSubmit}
                className="px-8 flex flex-col space-y-4 "
              >
                {/* User ID */}
                <div className="mb-2">
                  <label
                    htmlFor="userId"
                    className="text-sm font-semibold text-gray-600 mb-1 cursor-pointer"
                  >
                    User ID
                  </label>
                  <div className="relative mt-2">
                    <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Enter user ID"
                      id="userId"
                      onChange={(e) => setId(e.target.value)}
                      value={id}
                      className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>{" "}
                {/* User Name */}
                <div className="mb-2">
                  <label
                    htmlFor="userName"
                    className="text-sm font-semibold text-gray-600 mb-1 cursor-pointer"
                  >
                    User Name
                  </label>
                  <div className="relative mt-2">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Enter user name"
                      id="userName"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>{" "}
                {/* Email */}
                <div className="mb-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-600 mb-1 cursor-pointer"
                  >
                    Email
                  </label>
                  <div className="relative mt-2">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="email"
                      placeholder="Enter user email"
                      id="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>{" "}
                {/* Role */}
                <div className="mb-2">
                  <label
                    htmlFor="roleId"
                    className="text-sm font-semibold text-gray-600 mb-1"
                  >
                    Role
                  </label>
                  <div className="relative mt-2">
                    <FaUserTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <select
                      id="roleId"
                      onChange={(e) => setRole(e.target.value)}
                      value={role}
                      className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    >
                      <option value={role}>
                        {role === 3 ? "Student" : "Teacher"}
                      </option>
                      <option value="2">Teacher</option>
                      <option value="3">Student</option>
                    </select>
                  </div>
                </div>{" "}
                <div className="flex justify-center ">
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:opactity-90 transition-all duration-300 shadow-lg hover:shadow-xl mt-2 font-semibold flex justify-center items-center"
                  >
                    {loading ? (
                      <img
                        src={LoadingGif}
                        alt="Updating..."
                        className="h-6 w-fit "
                      />
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateUserPage;
