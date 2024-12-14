import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const BASE_URL = "http://10.5.15.11:8000";

const ProfilePage = ({ closeModal }) => {
  // Accept closeModal as a prop
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      setError("No access token found. Please log in again.");
      setLoading(false);
      return;
    }

    const authToken = JSON.parse(storedToken);

    if (!authToken?.access) {
      setError("Invalid token. Please log in again.");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const response = await axios.get("/proxy/user/profile/", config);
      console.log("API Response: ", response.data);
      setProfileData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile: ", error);
      setError("Error fetching profile data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    closeModal(); // Close the modal before navigation
    navigate("/edit-profile"); // Redirect to the /edit-profile route
  };

  const handleCreateComplaintClick = () => {
    closeModal(); // Close the modal before navigation
    navigate("/create-complaint"); // Redirect to the /create-complaint route
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!profileData || !profileData.profile) {
    return <p className="text-center text-gray-500">No profile data found</p>;
  }

  const { profile, role } = profileData;

  return (
    <div className="flex items-center justify-center mt-6 bg-gray-100">
      {role !== "admin" ? (
        <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6 flex">
          {/* Left Side */}
          <div className="w-1/2 px-6 pt-0 pb-6">
            <h1 className="text-4xl font-bold text-blue-600 text-nowrap">
              {profile.username}
            </h1>
            <span className="text-black">
              <p className="text-lg text-black">{role}</p>
            </span>
            <div className="mt-6">
              <p className="text-lg text-black">
                <strong className="text-black">Address:</strong>{" "}
                {profile.address}
              </p>
              <p className="text-lg text-black">
                <strong className="text-black">Phone Number:</strong>{" "}
                {profile.phone_no}
              </p>
              <p className="text-lg text-black">
                <strong className="text-black">Date of Birth:</strong>{" "}
                {profile.DOB}
              </p>
              <p className="text-lg text-black">
                <strong className="text-black">Father's Name:</strong>{" "}
                {profile.Father_name}
              </p>
              <p className="text-lg text-black">
                <strong className="text-black">Mother's Name:</strong>{" "}
                {profile.Mother_name}
              </p>
              <p className="text-lg text-black">
                <strong className="text-black">Parents' Phone Number:</strong>{" "}
                {profile.Parents_phone_no}
              </p>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleEditClick} // Call the function to navigate
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
              >
                Edit Profile
              </button>
              <button
                onClick={handleCreateComplaintClick} // Call the function to navigate
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
              >
                Create Complaint
              </button>
            </div>
          </div>

          {/* Right Side - Profile */}
          <div className="w-1/2 flex items-center justify-center relative">
            <div className="relative">
              <div className="absolute inset-0 border-t-8 border-r-8 border-blue-600 transform rotate-45"></div>
              <img
                src={`${BASE_URL}${profile.Photo}`}
                onClick={() => window.open(`${BASE_URL}${profile.Photo}`)}
                alt="Profile pic"
                className="w-48 h-48 object-cover rounded-full z-10 relative border-4 border-blue-600 bg-gray-400/20 flex justify-center items-center"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6 flex">
          <div className="w-full text-center">
            <h1 className="text-4xl font-bold text-blue-600">
              {profile.username}
            </h1>
            <p className="text-lg text-black">{role}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
