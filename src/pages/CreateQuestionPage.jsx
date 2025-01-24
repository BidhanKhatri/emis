import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  useToast,
  Text,
} from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";

const CreateQnAPage = () => {
  const [questionName, setQuestionName] = useState(""); // State for questionName
  const [subjectID, setSubjectID] = useState(""); // State for subjectID
  const toast = useToast();
  const { authToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data with questionName and subjectID
    const questionData = { questionName, subjectID };

    try {
      console.log("Token:", authToken);

      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
          "Content-Type": "application/json",
        },
      };

      // Step 1: Create Question
      const questionResponse = await axios.post(
        `/proxy/roles/community/questions/create/`,
        questionData,
        config
      );

      console.log("Question created:", questionResponse.data);

      // Show success message
      toast({
        title: "QnA Created",
        description: "QnA has been created successfully!",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });

      // Reset fields
      setQuestionName("");
      setSubjectID("");
    } catch (error) {
      console.error(
        "Error creating QnA:",
        error.response?.data || error.message
      );
      toast({
        title: "Error Creating QnA",
        description:
          error.response?.data?.message ||
          error.message ||
          "An error occurred while creating the QnA.",
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
      mt={{ base: "200", sm: "200", md: "200", lg: "100", xl: "100" }}
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <Text fontSize="2xl" mb="4" textAlign="center">
        Create QnA
      </Text>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb="4">
          <FormLabel>Subject ID</FormLabel>
          <Input
            value={subjectID} // Binding subjectID state
            onChange={(e) => setSubjectID(e.target.value)}
            placeholder="Enter the subject ID"
          />
        </FormControl>
        <FormControl isRequired mb="4">
          <FormLabel>Question Name</FormLabel>
          <Textarea
            value={questionName} // Binding questionName state
            onChange={(e) => setQuestionName(e.target.value)}
            placeholder="Type your question here..."
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">
          Create QnA
        </Button>
      </form>
    </Box>
  );
};

export default CreateQnAPage;
