import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Text,
  Flex,
} from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";
import { FiUpload } from "react-icons/fi";

const AssignmentSubmission = () => {
  const [assignmentID, setAssignmentID] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const { authToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assignmentID || !attachment) {
      toast({
        title: "All Fields Required",
        description: "Please provide both Assignment ID and a PDF file.",
        status: "warning",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("assignment", assignmentID);
    formData.append("attachment", attachment);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "/proxy/roles/assignment/submitAssignment/",
        formData,
        config
      );

      // Success message
      toast({
        title: "Assignment Submitted",
        description:
          response.data.message ||
          "Your assignment has been submitted successfully!",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });

      setAssignmentID("");
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      if (error.response?.status === 409) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to submit assignment. Please try again.";
        console.error("Error Response:", error.response);
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
        // Double submission case
        toast({
          title: "Assignment Already Submitted",
          description: "You have already submitted this assignment.",
          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Assignment Already Submitted",
          description: "You have already submitted this assignment.",
          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box
      maxW={{ base: "95%", md: "500px" }}
      mx="auto"
      mt="5"
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <Text fontSize="2xl" mb="4" textAlign="center">
        Submit Assignment
      </Text>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb="4">
          <FormLabel>Assignment ID</FormLabel>
          <Input
            type="number"
            placeholder="Enter assignment ID"
            value={assignmentID}
            onChange={(e) => setAssignmentID(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired mb="4">
          <FormLabel>Upload File</FormLabel>
          <Flex align="center">
            <Button
              leftIcon={<FiUpload />}
              colorScheme="teal"
              onClick={() => fileInputRef.current.click()}
            >
              Choose File
            </Button>
            <Text ml="3" isTruncated>
              {attachment ? attachment.name : "No file selected"}
            </Text>
          </Flex>
          <Input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => setAttachment(e.target.files[0])}
            style={{ display: "none" }}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full" mt="4">
          Submit Assignment
        </Button>
      </form>
    </Box>
  );
};

export default AssignmentSubmission;
