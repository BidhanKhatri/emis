import React, { useContext, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { FaUser, FaIdBadge, FaUserTag, FaEnvelope } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LoadingGif from "../assets/loading-gif.gif";
function CreateUserPage() {
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);

  const { createUser, updateToken } = useContext(AuthContext);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      await updateToken();
    } catch (error) {
      console.log(error);
      return;
    }

    try {
      setLoading(true);
      await createUser(id, name, email, role);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div>
        {/* <Sidebar /> */}

        {/* <Topbar /> */}
        <div className="px-6">
          <div className="flex  justify-center items-center min-h-screen my-2 w-full ">
            <div className=" shadow-lg rounded-lg w-full overflow-hidden pb-8 bg-white">
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
              <h2 className="text-2xl  mb-2 text-center text-gray-800">
                Create User
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
                      className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select Role</option>
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
                        alt="Creating..."
                        className="h-6 w-fit "
                      />
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>

              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                className="svg_img2"
              >
                <path
                  fill="#1D4ED8"
                  fillOpacity="1"
                  d="M0,64L40,85.3C80,107,160,149,240,170.7C320,192,400,192,480,186.7C560,181,640,171,720,144C800,117,880,75,960,74.7C1040,75,1120,117,1200,128C1280,139,1360,117,1400,106.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                ></path>
              </svg> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateUserPage;
