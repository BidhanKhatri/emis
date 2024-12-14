import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const CreateNoticePage = () => {
  const [noticeName, setNoticeName] = useState("");
  const [facultyBatchSem, setFacultyBatchSem] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const toast = useToast();

  const { authToken } = useContext(AuthContext);
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("noticeName", noticeName);
    formData.append("faculty_batch_Sem", facultyBatchSem);
    formData.append("ImageFile", imageFile);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
        },
      };

      await axios.post(
        "/proxy/roles/community/create_notice/",
        formData,
        config
      );
      toast({
        title: "Notice Created",
        description: "Your notice has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Reset the form after successful submission
      setNoticeName("");
      setFacultyBatchSem("");
      setImageFile(null);
    } catch (error) {
      console.error("Error creating notice:", error.response.data);
      toast({
        title: "Error",
        description:
          error.response.data || "An error occurred while creating the notice.",
        status: "error",
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
            Create Notice
          </Text>
          <form onSubmit={handleSubmit}>
            <FormControl mb="4">
              <FormLabel htmlFor="noticeName">Notice Name</FormLabel>
              <Input
                id="noticeName"
                type="text"
                value={noticeName}
                onChange={(e) => setNoticeName(e.target.value)}
                placeholder="Enter notice name"
                required
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel htmlFor="facultyBatchSem">
                Faculty / Batch / Semester
              </FormLabel>
              <Input
                id="facultyBatchSem"
                type="text"
                value={facultyBatchSem}
                onChange={(e) => setFacultyBatchSem(e.target.value)}
                placeholder="Enter faculty / batch / semester"
                required
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel htmlFor="imageFile">Upload Image</FormLabel>
              <Input
                id="imageFile"
                type="file"
                onChange={handleFileChange}
                className="flex flex-col justify-center items-center bg-red-500 p-2"
                required
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" width="full">
              Create Notice
            </Button>
          </form>
        </Box>
  );
};

export default CreateNoticePage;
