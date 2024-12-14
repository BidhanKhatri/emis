import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaCalendarAlt, FaBook, FaGraduationCap } from "react-icons/fa"; // 

const CreateAttendancePage = () => {
  const [semesterId, setSemesterId] = useState("");
  const [yearId, setYearId] = useState(""); // optional
  const [subjectID, setSubjectID] = useState("");
  const [date, setDate] = useState("");
  const [userId, setUserId] = useState("");
  const toast = useToast();

  const { authToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAttendance(semesterId, yearId, subjectID, date, userId);
  };

  const createAttendance = async (
    facultyBatchSem,
    facultyBatchYear,
    subjectID,
    date,
    userId
  ) => {
    if (!facultyBatchSem || !subjectID || !date || !userId) {
      toast({
        title: "Please fill all required fields",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    const payload = {
      faculty_batch_sem: facultyBatchSem,
      faculty_batch_year: facultyBatchYear || null,
      subject: subjectID,
      date: date,
      userId: userId,
    };

    console.log("Creating attendance with payload:", payload);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      };

      const result = await axios.post(
        "/proxy/roles/attendance/createAttendance/",
        payload,
        config
      );

      if (result && result.data) {
        console.log("Attendance created successfully:", result.data);
        toast({
          title: "Attendance created successfully",
          description: `Attendance ID: ${result.data.attendance_id}`,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        // Reset form fields
        setSemesterId("");
        setYearId("");
        setSubjectID("");
        setDate("");
        setUserId("");
      } else {
        console.error("Unexpected response structure:", result);
        toast({
          title: "Failed to create attendance",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error creating attendance:", err);
      const errorMessage = err.response?.data?.detail || "An error occurred";
      console.error("Error details:", errorMessage);

      // Display error message to user
      toast({
        title: errorMessage,
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      mt="0"
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="svg_img"
            style={{ marginTop: "-25px", width: "500px", marginLeft: "-25px" }}
          >
            <path
              fill="#4f46e5"
              fillOpacity="1"
              d="M0,128L40,149.3C80,171,160,213,240,234.7C320,256,400,256,480,224C560,192,640,128,720,128C800,128,880,192,960,213.3C1040,235,1120,213,1200,218.7C1280,224,1360,256,1400,272L1440,288L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            ></path>
          </svg> */}
      <Text fontSize="2xl" mb="4" textAlign="center">
        Create Attendance
      </Text>
      <form onSubmit={handleSubmit}>
        {/* Semester ID */}
        <FormControl mb="4">
          <FormLabel
            htmlFor="semesterId"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Semester ID
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaGraduationCap color="gray.500" />
            </InputLeftElement>
            <Input
              id="semesterId"
              type="text"
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              placeholder="Enter Semester ID"
              className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </InputGroup>
        </FormControl>

        {/* Year ID (Optional) */}
        <FormControl mb="4">
          <FormLabel
            htmlFor="yearId"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Year ID (Optional)
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaGraduationCap color="gray.500" />
            </InputLeftElement>
            <Input
              id="yearId"
              type="text"
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
              placeholder="Enter Year ID"
              className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </InputGroup>
        </FormControl>

        {/* Subject ID */}
        <FormControl mb="4">
          <FormLabel
            htmlFor="subjectID"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Subject ID
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaBook color="gray.500" />
            </InputLeftElement>
            <Input
              id="subjectID"
              type="text"
              value={subjectID}
              onChange={(e) => setSubjectID(e.target.value)}
              placeholder="Enter Subject ID"
              className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </InputGroup>
        </FormControl>

        {/* Date */}
        <FormControl mb="4">
          <FormLabel
            htmlFor="date"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Date
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaCalendarAlt color="gray.500" />
            </InputLeftElement>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </InputGroup>
        </FormControl>

        {/* User ID */}
        <FormControl mb="4">
          <FormLabel
            htmlFor="userId"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            User ID
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaUser color="gray.500" />
            </InputLeftElement>
            <Input
              className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              required
            />
          </InputGroup>
        </FormControl>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Create Attendance
        </button>
        {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="svg_img2"
              style={{
                marginBottom: "-25px",
                width: "500px",
                marginLeft: "-25px",
              }}
            >
              <path
                fill="#4f46e5"
                fillOpacity="1"
                d="M0,64L40,85.3C80,107,160,149,240,170.7C320,192,400,192,480,186.7C560,181,640,171,720,144C800,117,880,75,960,74.7C1040,75,1120,117,1200,128C1280,139,1360,117,1400,106.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
              ></path>
            </svg> */}
      </form>
    </Box>
  );
};

export default CreateAttendancePage;
