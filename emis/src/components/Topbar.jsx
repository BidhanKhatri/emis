import React, { useContext, useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import ProfilePage from "../pagesTeacher/ProfilePage";
import axios from "axios";
import nscLogo from "../assets/nsc_logo.png"; // Import the NSC logo from assets
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiMenu, FiX } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [role, setRole] = useState(null); // State to hold the user's role

  const { authToken, handleLeftSideBarToggle, isLeftSideBarOpen, userName } =
    useContext(AuthContext);
  const { logoutUser } = useContext(AuthContext);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleViewProfileToggle = () => {
    setIsOpen(!isOpen);
  };

  // Fetch user profile and role on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authToken && authToken.access) {
        try {
          const response = await axios.get("/proxy/user/profile/", {
            headers: {
              Authorization: `Bearer ${authToken.access}`,
            },
          });

          const profileData = response.data.profile;
          const photoURL = `http://10.5.15.11:8000${profileData.Photo}`; // Adjust URL according to your backend
          setProfilePhoto(photoURL); // Set the profile photo in state
          setRole(response.data.role); // Set the user's role in state
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchUserProfile();
  }, [authToken]);

  return (
    <>
      {/* This is the top bar for mobile or small devices */}
      <div className="w-full bg-white  flex items-center justify-between p-4 lg:px-10 shadow-md ">
        <div
          className="relative flex items-center cursor-pointer p-2 bg-gray-200/80 rounded-full hover:scale-110 transition-all duration-700"
          onClick={handleLeftSideBarToggle}
        >
          {isLeftSideBarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>
        <div className="flex items-center space-x-4 ">
          <p>
            Hello{" "}
            <span className="font-semibold text-md text-blue-700">
              {userName || "User"}
            </span>
            !
          </p>
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full focus:outline-none"
              onClick={handleMenuToggle}
            >
              {/* Conditionally display user profile photo or NSC logo */}
              <img
                src={
                  role === "Admin"
                    ? nscLogo
                    : profilePhoto || "https://via.placeholder.com/150"
                } // Display NSC logo if admin
                alt="profile"
                className="w-full h-full rounded-full"
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-[999]">
                <ul className="py-1">
                  <li>
                    <a
                      onClick={handleViewProfileToggle}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      View Profile
                    </a>
                  </li>
                  <li>
                    <span
                      onClick={logoutUser}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer w-full flex items-center"
                    >
                      <MdLogout /> <span className="ml-2">Logout</span>
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* This is the top bar for desktop or large devices */}
      {/* <div className={` justify-between items-center bg-white shadow px-6 py-4 hidden lg:flex`}>
        

        
      </div> */}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* ProfilePage Content */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl">
            {/* Close Button inside the popup */}
            <button
              onClick={handleViewProfileToggle}
              className="absolute top-2 right-4 text-gray-600 text-2xl hover:text-gray-900"
            >
              &times;
            </button>

            {/* ProfilePage Content */}
            <div className="p-4">
              <ProfilePage closeModal={handleViewProfileToggle} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
