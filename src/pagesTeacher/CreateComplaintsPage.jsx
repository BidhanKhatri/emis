import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
const CreateComplaintsPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { authToken } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('suggestion', suggestion);
    formData.append('photo', photo);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          'Content-Type': 'multipart/form-data', // Since photo is uploaded
        },
      };

      await axios.post('/proxy/roles/complaints/create/', formData, config);
      setSuccess('Complaint submitted successfully.');
      setError(null);
      // Reset the form
      setTitle('');
      setDescription('');
      setSuggestion('');
      setPhoto(null);
    } catch (error) {
      setError('Failed to submit complaint.');
      setSuccess(null);
      console.error('Error submitting complaint:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 ">
      <h2 className="text-xl font-bold mb-4">Create a Complaint</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form className="w-full max-w-lg bg-white shadow-lg p-4 rounded" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter complaint title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter complaint description"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="suggestion">
            Suggestion
          </label>
          <input
            id="suggestion"
            type="text"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter your suggestion"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="photo">
            Upload Photo
          </label>
          <input
            id="photo"
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default CreateComplaintsPage;
