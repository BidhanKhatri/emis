import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://10.5.15.11:8000";

// Modal Component
const EditModal = ({
  isOpen,
  onClose,
  onSave,
  editFormData,
  handleEditChange,
  handlePhotoChange,
}) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Complaint</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <div className="mb-4">
            <label className="block mb-1">Title</label>
            <input
              name="title"
              value={editFormData.title}
              onChange={handleEditChange}
              className="border w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleEditChange}
              className="border w-full p-2"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Suggestion</label>
            <input
              name="suggestion"
              value={editFormData.suggestion}
              onChange={handleEditChange}
              className="border w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Photo</label>
            <input
              type="file"
              name="photo"
              onChange={handlePhotoChange}
              className="border w-full p-2"
            />
            {editFormData.photo && (
              <div className="mt-2">
                <img
                  src={editFormData.photo}
                  alt="Current photo"
                  className="h-24 w-24 object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [editComplaintId, setEditComplaintId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    suggestion: "",
    photo: null,
  });
  const [photoFile, setPhotoFile] = useState(null);

  const fetchComplaints = async (page) => {
    setLoading(true);
    try {
      const tokenString = localStorage.getItem("authToken");
      const authToken = tokenString ? JSON.parse(tokenString) : null;

      if (!authToken || !authToken.access) {
        throw new Error("Authorization token is missing or invalid");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
        },
      };

      const response = await axios.get(
        `/proxy/roles/complaints/mine/?page=${page}`,
        config
      );
     // console.log("API Response:", response.data);

      if (Array.isArray(response.data.results)) {
        const sortedComplaints = response.data.results.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setComplaints(sortedComplaints);
      } else {
        setComplaints([]);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError(error.response ? error.response.data.results.message : "Failed to fetch complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file); // Store the new photo file
    setEditFormData({ ...editFormData, photo: URL.createObjectURL(file) }); // Update the formData with the new photo URL
  };

  const startEditing = (complaint) => {
    setEditComplaintId(complaint.complainID);
    setEditFormData({
      title: complaint.title,
      description: complaint.description,
      suggestion: complaint.suggestion,
      photo: complaint.photo ? `${BASE_URL}${complaint.photo}` : null,
    });
    setIsModalOpen(true);
  };

  const saveEdit = async () => {
    try {
      const tokenString = localStorage.getItem("authToken");
      const authToken = tokenString ? JSON.parse(tokenString) : null;

      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("title", editFormData.title);
      formData.append("description", editFormData.description);
      formData.append("suggestion", editFormData.suggestion);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await axios.put(
        `/proxy/roles/complaints/edit/${editComplaintId}/`,
        formData,
        config
      );

      const updatedComplaint = response.data.results;
      const updatedPhotoUrl = `${BASE_URL}${updatedComplaint.photo}?${new Date().getTime()}`;

      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.complainID === editComplaintId
            ? { ...complaint, ...updatedComplaint, photo: updatedPhotoUrl }
            : complaint
        )
      );

      setEditComplaintId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error editing complaint:", error);
      setError(error.response ? error.response.data.results.message : "Failed to edit complaint");
    }
  };

  const deleteComplaint = async (complaintId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this complaint?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const tokenString = localStorage.getItem("authToken");
          const authToken = tokenString ? JSON.parse(tokenString) : null;

          const config = {
            headers: {
              Authorization: `Bearer ${authToken.access}`,
            },
          };

          const response = await axios.delete(
            `/proxy/roles/complaints/delete/${complaintId}/`,
            config
          );
          //console.log("Delete Response:", response.data);

          setComplaints((prevComplaints) =>
            prevComplaints.filter(
              (complaint) => complaint.complainID !== complaintId
            )
          );

          Swal.fire("Deleted!", "Your complaint has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting complaint:", error);
          Swal.fire("Error", "Failed to delete complaint", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchComplaints(page);
  }, [page]);

  return (
    <div className="flex flex-col items-center justify-center p-6 ">
      <h2 className="text-xl font-bold mb-4 ">My Complaints</h2>

      {loading ? (
        <p>Loading complaints...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2 border border-gray-300">Title</th>
              <th className="px-4 py-2 border border-gray-300">Description</th>
              <th className="px-4 py-2 border border-gray-300">Suggestion</th>
              <th className="px-4 py-2 border border-gray-300">Photo</th>
              <th className="px-4 py-2 border border-gray-300">Date</th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">No complaints found.</td>
              </tr>
            ) : (
              complaints.map((complaint) => {
                const isSolved = complaint.solved;

                return (
                  <tr key={complaint.complainID} className="bg-white even:bg-gray-100">
                    <td className="px-4 py-2 border">{complaint.title}</td>
                    <td className="px-4 py-2 border">{complaint.description}</td>
                    <td className="px-4 py-2 border">{complaint.suggestion}</td>
                    <td className="px-4 py-2 border">
                      <img
                        src={`${BASE_URL}${complaint.photo}`}
                        alt="Complaint"
                        className="w-20 h-20 object-cover"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(complaint.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">
                      {isSolved ? "Solved" : "Pending"}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => startEditing(complaint)}
                        className={`bg-blue-600 text-white px-2 py-1 rounded ${
                          isSolved ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isSolved || editComplaintId !== null}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteComplaint(complaint.complainID)}
                        className={`bg-red-500 text-white px-2 py-1 rounded ml-2 ${
                          isSolved ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isSolved}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveEdit}
        editFormData={editFormData}
        handleEditChange={handleEditChange}
        handlePhotoChange={handlePhotoChange}
      />
    </div>
  );
};

export default MyComplaintsPage;
