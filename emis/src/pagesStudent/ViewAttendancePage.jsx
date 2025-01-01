import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  Input,
  Button,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const ViewAttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [subjectID, setSubjectID] = useState("");
  const [loading, setLoading] = useState(false);
  const { authToken } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const API_URL = "proxy/roles/attendance/getdata/";

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      });

      setAttendanceData(response.data.results || []);
      setFilteredData(response.data.results || []);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const handleSearch = () => {
    if (!subjectID) {
      setFilteredData(attendanceData);
    } else {
      const filtered = attendanceData.filter(
        (attendance) =>
          attendance.subject.toLowerCase() === subjectID.toLowerCase()
      );
      setFilteredData(filtered);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={{ base: 4, md: 6 }} flex="1" overflowY="auto">
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Text fontSize="lg" fontWeight="bold" color="blue.500">
          Attendance Records
        </Text>
        <Flex flexDirection="row" alignItems="center" gap={2}>
          <Input
            placeholder="Enter Subject ID"
            value={subjectID}
            onChange={(e) => setSubjectID(e.target.value)}
            maxW="300px"
            size="md"
          />
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </Flex>
      </Flex>

      <Flex flexDirection={{ base: "column", lg: "row" }} gap={6}>
        <Box flex="1" overflowX="auto">
          <Table variant="striped" colorScheme="gray">
            <Thead bg="blue.500">
              <Tr>
                <Th color="white">Subject</Th>
                <Th color="white">Semester</Th>
                <Th color="white">Date</Th>
                <Th color="white">User ID</Th>
                <Th color="white">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentRows.length > 0 ? (
                currentRows.map((attendance, index) => (
                  <React.Fragment key={index}>
                    {attendance.records &&
                      attendance.records.map((record, i) => (
                        <Tr key={i}>
                          <Td>{attendance.subject}</Td>
                          <Td>{attendance.faculty_batch_sem}</Td>
                          <Td>{attendance.date}</Td>
                          <Td>{record.userID}</Td>
                          <Td fontWeight="bold">
                            <span
                              style={{
                                color:
                                  record.status === "True" ? "green" : "red",
                              }}
                            >
                              {record.status === "True" ? "Present" : "Absent"}
                            </span>
                          </Td>
                        </Tr>
                      ))}
                  </React.Fragment>
                ))
              ) : (
                <Tr>
                  <Td colSpan="5" textAlign="center">
                    No data available
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>

          <Flex justifyContent="space-between" mt={4}>
            <IconButton
              icon={<ChevronLeftIcon />}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            />
            <Text>
              Page {currentPage} of{" "}
              {Math.ceil(filteredData.length / rowsPerPage)}
            </Text>
            <IconButton
              icon={<ChevronRightIcon />}
              onClick={handleNextPage}
              disabled={
                currentPage === Math.ceil(filteredData.length / rowsPerPage)
              }
            />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default ViewAttendancePage;
