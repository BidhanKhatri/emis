import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignmentPage = () => {
  const [subjectID, setSubjectID] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchAssignments = async () => {
    setLoading(true);
    setError("");

    if (!subjectID.trim()) {
      setError("Subject ID is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `/roles/assignment/getYourSubjectAssignment/${subjectID}/`
      );
      setAssignments(response.data.results || []);
    } catch (err) {
      setError("Failed to fetch assignments. Please check the Subject ID.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Assignments for Subject
      </h1>
      <div className="flex items-center justify-center gap-4 mb-6">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-lg w-64 focus:ring-2 focus:ring-blue-400"
          placeholder="Enter Subject ID"
          value={subjectID}
          onChange={(e) => setSubjectID(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleFetchAssignments}
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Title
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((assignment, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {assignment.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {assignment.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {assignment.dueDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentPage;
