import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Text,
  Flex,
} from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar"; // Adjust the path as necessary
import Topbar from "../components/Topbar"; // Adjust the path as necessary

const CreateAssignmentPage = () => {
  const [subjectID, setSubjectID] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignmentInFile, setAssignmentInFile] = useState(null);
  const [assignmentInText, setAssignmentInText] = useState("");
  const [batchID, setBatchID] = useState("");
  const toast = useToast();
  
  const { authToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("subjectID", subjectID);
    formData.append("assignmentTitle", assignmentTitle);
    formData.append("due_date", dueDate);
    formData.append("assignmentInFile", assignmentInFile);
    formData.append("assignmentInText", assignmentInText);
    formData.append("batchID", batchID);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          "Content-Type": "multipart/form-data", // Important for file upload
        },
      };

      const response = await axios.post(`/proxy/roles/assignment/createAssignment/`, formData, config);
      
      // Show success message
      toast({
        title: "Assignment Created",
        description: response.data.message || "Assignment has been created successfully!",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });

      // Clear the form fields
      setSubjectID("");
      setAssignmentTitle("");
      setDueDate("");
      setAssignmentInFile(null);
      setAssignmentInText("");
      setBatchID("");
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Error Creating Assignment",
        description: error.response?.data?.message || "An error occurred while creating the assignment.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    
        <Box
          maxW="500px"
          mx="auto"
          mt="5"
          p="6"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          bg="white"
        >
          <Text fontSize="2xl" mb="4" textAlign="center">
            Create Assignment
          </Text>
          <form onSubmit={handleSubmit}>
            <Flex mb="4" justify="space-between">
              <FormControl isRequired width="48%">
                <FormLabel>Subject ID</FormLabel>
                <Input
                  type="text"
                  value={subjectID}
                  onChange={(e) => setSubjectID(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired width="48%">
                <FormLabel>Batch ID</FormLabel>
                <Input
                  type="text"
                  value={batchID}
                  onChange={(e) => setBatchID(e.target.value)}
                />
              </FormControl>
            </Flex>
            <FormControl isRequired mb="4">
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mb="4">
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Attach File</FormLabel>
              <Input
                type="file"
                onChange={(e) => setAssignmentInFile(e.target.files[0])}
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Description</FormLabel>
              <Textarea
                value={assignmentInText}
                onChange={(e) => setAssignmentInText(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Create Assignment
            </Button>
          </form>
        </Box>
  );
};

export default CreateAssignmentPage;
