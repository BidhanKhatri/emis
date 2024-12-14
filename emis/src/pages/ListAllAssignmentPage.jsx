import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react";
import LoadingGif from "../assets/news-loading.gif";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://10.5.15.11:8000";
const PAGES_TO_LOAD = 4; // Number of pages to fetch per view

const ListAllAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSet, setCurrentSet] = useState(1); // Tracks the current set of pages
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const toast = useToast();
  const { authToken } = useContext(AuthContext);

  const fetchAssignments = async (pageSet) => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      // Fetch the data for the current set of pages
      const requests = Array.from({ length: PAGES_TO_LOAD }, (_, i) =>
        axios.get(`/proxy/roles/assignment/listAssignment/?page=${(pageSet - 1) * PAGES_TO_LOAD + i + 1}`, config)
      );

      const responses = await Promise.allSettled(requests);

      // Filter successful responses
      const successfulResponses = responses.filter(
        (response) => response.status === "fulfilled"
      );

      const combinedAssignments = successfulResponses.flatMap(
        (response) => response.value.data.results
      );

      setAssignments(combinedAssignments);

      // Update total pages if available from any response
      if (successfulResponses.length > 0) {
        setTotalPages(Math.ceil(successfulResponses[0].value.data.count / PAGES_TO_LOAD));
      }

      setError("");
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError("Failed to fetch assignments.");
      toast({
        title: "Error fetching assignments",
        description:
          error.response?.data?.message ||
          "An error occurred while fetching assignments.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setUpdatedDetails({
      assignmentTitle: assignment.assignmentTitle,
      assignmentInText: assignment.assignmentInText || "",
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
        },
      };
      await axios.put(
        `/proxy/roles/assignment/updateAssignment/${editingAssignment.assignmentID}/`,
        updatedDetails,
        config
      );

      toast({
        title: "Assignment updated successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });

      // Refresh assignments list after update
      fetchAssignments(currentPage);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast({
        title: "Error updating assignment",
        description:
          error.response?.data?.message ||
          "An error occurred while updating the assignment.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
  };
  const handleDelete = (assignmentID) => {
    toast({
      title: "Confirm Delete",
      description: "Are you sure you want to delete this assignment?",
      status: "warning",
      duration: null,
      position: "top-right",
      isClosable: false,
      render: () => (
        <Box
          color="black"
          p={3}
          className="bg-white flex flex-col items-center justify-center border border-gray-300/80"
          borderRadius="md"
          mt={16}
        >
          <Text fontWeight="bold">Confirm Delete!</Text>
          <Text>Are you sure you want to delete this assignment?</Text>
          <Box>
            <Button
              mt={3}
              colorScheme="red"
              onClick={async () => {
                try {
                  const config = {
                    headers: {
                      Authorization: `Bearer ${authToken.access}`,
                    },
                  };
                  await axios.delete(
                    `/proxy/roles/assignment/deleteAssignment/${assignmentID}/`,
                    config
                  );
                  setAssignments(assignments.filter((assignment) => assignment.assignmentID !== assignmentID));
                  toast({
                    title: "Assignment deleted",
                    status: "success",
                    duration: 3000,
                    position: "top-right",
                    isClosable: true,
                  });
                } catch (error) {
                  console.error("Error deleting assignment:", error);
                  toast({
                    title: "Error deleting assignment",
                    description:
                      error.response?.data?.message ||
                      "An error occurred while deleting the assignment.",
                    status: "error",
                    duration: 3000,
                    position: "top-right",
                    isClosable: true,
                  });
                }
                toast.closeAll();
              }}
            >
              Delete
            </Button>
            <Button
              mt={3}
              ml={2}
              onClick={() => {
                toast.closeAll(); // Just close the toast if user cancels
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ),
    });
  };

  const handlePrevious = () => {
    if (currentSet > 1) {
      setCurrentSet((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSet < totalPages) {
      setCurrentSet((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchAssignments(currentSet);
  }, [currentSet]);

  if (loading) {
    return (
      <div className="text-3xl font-bold h-screen flex flex-col justify-center items-center ">
        <img src={LoadingGif} alt="Loading..." className="w-52" />
        <p className="text-xl font-semibold">Loading assignment...</p>
      </div>
    );
  }

  return (
    <Box display="flex">
      <Box flex="1" bg="gray.100">
        <Text fontSize="2xl" mt="4" textAlign="center">
          List of Assignments
        </Text>

        {error && <Text color="red.500">{error}</Text>}

        <Box p="6">
          <Table className="min-w-full table-auto border-collapse border border-gray-200">
            <Thead>
              <Tr className="bg-blue-500">
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  S.N.
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Batch
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Subject
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Title
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  File
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Description
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Created At
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Due Date
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Posted By
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <Tr key={assignment.assignmentID} className="bg-white even:bg-gray-100">
                    <Td className="px-4 py-2 border border-gray-300">{index + 1}</Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.batchID.name}</Td>
                    <Td className="px-4 py-2 border border-gray-300">
                      {`${assignment.subjectID.subjectID} - ${assignment.subjectID.subjectName}`}
                    </Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.assignmentTitle}</Td>
                    <Td className="px-4 py-2 border border-gray-300">
                      {assignment.assignmentInFile ? (
                        <a
                          href={`${BASE_URL}${assignment.assignmentInFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View File
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.assignmentInText || "N/A"}</Td>
                    <Td className="px-4 py-2 border border-gray-300">
                      {new Date(assignment.created_at).toLocaleString()}
                    </Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.due_date}</Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.userID}</Td>
                    <Td className="px-4 py-2 border border-gray-300">
                      <ButtonGroup spacing={2}>
                        <Button
                          colorScheme="blue"
                          onClick={() => handleEdit(assignment)}
                          size="sm"
                        >
                          Edit
                        </Button>
                      
                    
                        <Button
                          colorScheme="red"
                          onClick={() => handleDelete(assignment.assignmentID)}
                          size="sm"
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr textAlign="center">
                  <Td colSpan="10" textAlign="center">
                    No assignments found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              colorScheme="blue"
              disabled={currentSet === 1}
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Text>Page {currentSet} of {totalPages}</Text>
            <Button
              colorScheme="blue"
              disabled={currentSet === totalPages}
              onClick={handleNext}
            >
              Next
            </Button>
          </Box>
        </Box>
        <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Assignment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  name="assignmentTitle"
                  value={updatedDetails.assignmentTitle}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mt="4">
                <FormLabel>Description</FormLabel>
                <Input
                  name="assignmentInText"
                  value={updatedDetails.assignmentInText}
                  onChange={handleInputChange}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleEditSubmit}>
                Save
              </Button>
              <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      </Box>

  );
};

export default ListAllAssignmentsPage;
