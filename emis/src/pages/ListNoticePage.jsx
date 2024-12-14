import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import { CloseButton } from "@chakra-ui/react";
import LoadingGif from "../assets/news-loading.gif";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Button,
  Select,
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
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const BASE_URL = "http://10.5.15.11:8000";

const ListNoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [facultyBatchSemId, setFacultyBatchSemId] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { authToken } = useContext(AuthContext);


  const fetchNotices = async (semesterId) => {
    setLoading(true);
    try {;
      const config = {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
        },
      };

      if (semesterId) {
        const response = await axios.get(
          `/proxy/roles/community/filter_notice/?faculty_batch_sem_id=${semesterId}`,
          config
        );

        // Debugging - Log the API response for each semester
        console.log(`API Response for Semester ${semesterId}:`, response.data);

        if (Array.isArray(response.data)) {
          setNotices(response.data);
        } else {
          console.error("Expected an array, but got:", response.data);
          setNotices([]);
        }
      } else {
        setNotices([]);
      }

      setError("");
    } catch (error) {
      console.error("Error fetching notices:", error);
      setError("Failed to fetch notices.");
      toast({
        title: "Error fetching notices",
        description:
          error.response?.data?.message ||
          "An error occurred while fetching notices.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const selectedSemesterId = e.target.value;
    setFacultyBatchSemId(selectedSemesterId);
    fetchNotices(selectedSemesterId);
  };

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
    onOpen();
  };

  useEffect(() => {
    fetchNotices(facultyBatchSemId);
  }, [facultyBatchSemId]);

  if (loading) {
    return (
      <div className="text-3xl font-bold h-screen flex flex-col justify-center items-center ">
        <img src={LoadingGif} alt="Loading..." className="w-52" />
        <p className="text-xl font-semibold">Loading Notices...</p>
      </div>
    );
  }

  return (
    <Box display="flex">
      <Box flex="1" bg="gray.100">
        <Box
          maxW="800px"
          mx="auto"
          mt="5"
          p="6"
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
        >
          <Text fontSize="2xl" mb="4" textAlign="center">
            List of Notices
          </Text>

          <Select
            placeholder="Select Semester"
            onChange={handleFilterChange}
            value={facultyBatchSemId}
            mb="4"
          >
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
          </Select>

          {error && <Text color="red.500">{error}</Text>}

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Notice Name</Th>
                <Th>Semester</Th>
                <Th>Image</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <Tr key={notice.id}>
                    <Td>{notice.noticeName}</Td>
                    <Td>{notice.faculty_batch_Sem}</Td>
                    <Td className="flex justify-center item-center">
                      <img
                        src={`${BASE_URL}${notice.ImageFile}`}
                        alt="notice-img"
                        className="w-20 h-20"
                      />
                    </Td>
                    <Td>
                      <Button
                        colorScheme="blue"
                        mr={2}
                        onClick={() => handleViewNotice(notice)}
                      >
                        View
                      </Button>
                      <Button colorScheme="red">Delete</Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr textAlign="center">
                  <Td colSpan="4" textAlign="center">
                    <span className="text-red-500">* </span>Select semester to
                    view notices.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent
            borderRadius="20px"
            bg="white"
            p="6"
            textAlign="center"
            maxW="650px"
            mx="auto"
            boxShadow="xl"
          >
            <ModalHeader position="relative">
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                size="lg"
                color="gray.500"
                onClick={onClose}
              />
            </ModalHeader>
            <ModalBody>
              {selectedNotice && (
                <>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    color="blue.600"
                    mb="3"
                  >
                    {selectedNotice.noticeName}
                  </Text>

                  <Box
                    border="2px"
                    borderColor="gray.200"
                    p="1"
                    mb="5"
                    borderRadius="md"
                    boxShadow="lg"
                  >
                    <Image
                      src={`${BASE_URL}${selectedNotice.ImageFile}`}
                      alt="Notice Image"
                      maxW="100%"
                      maxH="400px"
                      objectFit="contain"
                      mx="auto"
                      borderRadius="md"
                    />
                  </Box>

                  <Text fontSize="lg" fontWeight="semibold" mb="2">
                    Semester:{" "}
                    <Text as="span" fontWeight="normal">
                      {selectedNotice.faculty_batch_Sem}
                    </Text>
                  </Text>

                  <Text fontSize="lg" fontWeight="semibold" mb="2">
                    Posted By:{" "}
                    <Text as="span" fontWeight="normal">
                      {selectedNotice.userID || "N/A"}
                    </Text>
                  </Text>

                  <Text fontSize="md" mt="4" lineHeight="tall" color="gray.600">
                    {selectedNotice.description}
                  </Text>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default ListNoticePage;
