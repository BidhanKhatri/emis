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
  Text,
  Button,
  Input,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Legend } from "chart.js";

const AllAttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userID, setUserID] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const toast = useToast();

  const { authToken } = useContext(AuthContext);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.access}`,
    },
  };
  
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        "/proxy/roles/attendance/getdata/",
        config
      );
      console.log("Response from API:", response);
      if (Array.isArray(response.data.results)) {
        setAttendanceData(response.data.results);
      }
      // setAttendanceData(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (error) {
      setError("Failed to fetch attendance data.");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceForStudent = async () => {
    if (!userID) {
      setError("Please enter a User ID");
      return;
    }

    // setLoading(true);
    try {
      const response = await axios.get(
        `/proxy/roles/attendance/getdata/?userID=${userID}`,
        config
      );
      setAttendanceData(response.data.results);
      setError("");
    } catch (error) {
      toast({
        title: "Failed to fetch attendance data for the user.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const fetchAttendanceForSubject = async () => {
    if (!subjectID) return;
    try {
      const response = await axios.get(
        `/proxy/roles/attendance/getdata/?subjectID=${subjectID}`,
        config
      );
      setAttendanceData(response.data.results);
    } catch (error) {
      toast({
        title: "Failed to fetch attendance data for the subject.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }
  };

  const fetchAttendanceForDate = async () => {
    if (!selectedDate) return;
    try {
      const response = await axios.get(
        `/proxy/roles/attendance/getdata/?date=${selectedDate}`,
        config
      );
      setAttendanceData(response.data.results);
    } catch (error) {
      setError("Failed to fetch attendance data for the date.");
    }
  };

  const fetchAttendanceForUserAndSubject = async () => {
    if (!userID || !subjectID) {
      toast({
        title: "Please enter both User ID and Subject ID",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.get(
        `/proxy/roles/attendance/getdata/?subjectID=${subjectID}&userID=${userID}`,
        config
      );

      console.log(response.data.results);
      setAttendanceData(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  // if (loading) {
  //   return <Spinner size="xl" />;
  // }

  if (error) {
    toast({
      title: error,
      status: "error",
      duration: 3000,
      position: "top-right",
      isClosable: true,
    });
    return;
  }

  const semester =
    attendanceData.length > 0 ? attendanceData[0].faculty_batch_sem : "";
  const subject = attendanceData.length > 0 ? attendanceData[0].subject : "";
  const date =
    attendanceData.length > 0 ? new Date(attendanceData[0].date) : null;
  const year = date ? date.getFullYear() : "";
  const month = date ? date.toLocaleString("default", { month: "long" }) : "";

  return (
    

        <Box p="6" flex="1" overflowY="auto" backgroundColor="transparent">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb="4"
          >
            <Box display="flex" width="100%" justifyContent="" gap="10">
              <Box display="flex" flexDirection="column" gap="4">
                <Input
                  placeholder="User ID"
                  borderColor="blue.500"
                  onChange={(e) => setUserID(e.target.value)}
                  mr="2"
                />
                <Button
                  onClick={fetchAttendanceForStudent}
                  colorScheme="blue"
                  fontSize="sm"
                >
                  Fetch User Attendance
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap="4">
                <Input
                  placeholder="Subject ID"
                  borderColor="blue.500"
                  onChange={(e) => setSubjectID(e.target.value)}
                  mr="2"
                />
                <Button
                  onClick={fetchAttendanceForSubject}
                  colorScheme="blue"
                  fontSize="sm"
                >
                  Fetch Subject Attendance
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap="4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  borderColor="blue.500"
                  mr="2"
                />

                <Button
                  onClick={fetchAttendanceForDate}
                  colorScheme="blue"
                  fontSize="sm"
                >
                  Fetch Date Attendance
                </Button>
              </Box>

              <Box>
                <Box display="flex" flexDirection="column" gap="4">
                  <Box display="flex">
                    <Input
                      type="text"
                      onChange={(e) => setUserID(e.target.value)}
                      placeholder="User ID"
                      borderColor="blue.500"
                      mr="2"
                      required
                    />
                    <Input
                      type="text"
                      onChange={(e) => setSubjectID(e.target.value)}
                      placeholder="Subject ID"
                      borderColor="blue.500"
                      mr="2"
                      required
                    />
                  </Box>

                  <Button
                    onClick={fetchAttendanceForUserAndSubject}
                    colorScheme="blue"
                    fontSize="sm"
                  >
                    Fetch attendance
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box mb="4">
            {/* <Text fontSize="xl" fontWeight="bold">
              Semester: {semester} | Subject: {subject}
            </Text> */}
            <Text fontSize="xl" fontWeight="bold">
              Year: {year} | Month: {month}
            </Text>
          </Box>

          <Table
            variant="striped"
            colorScheme="gray"
            borderColor="gray.300"
            borderWidth="1px"
            borderStyle="solid"
          >
            <Thead bg="blue.500">
              <Tr>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  Subject
                </Th>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  Semester
                </Th>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  Date
                </Th>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  User ID
                </Th>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  Status
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((attendance, index) => (
                  <React.Fragment key={index}>
                    {attendance.records &&
                      attendance.records.map((record, i) => (
                        <Tr key={i} bg="transparent">
                          <Td borderColor="gray.300" borderWidth="1px">
                            {attendance.subject}
                          </Td>
                          <Td borderColor="gray.300" borderWidth="1px">
                            {attendance.faculty_batch_sem}
                          </Td>
                          <Td borderColor="gray.300" borderWidth="1px">
                            {attendance.date}
                          </Td>
                          <Td borderColor="gray.300" borderWidth="1px">
                            {record.userID}
                          </Td>
                          <Td borderColor="gray.300" borderWidth="1px">
                            {record.status === "True" ? (
                              <span className="text-green-500 font-semibold">
                                {" "}
                                Present
                              </span>
                            ) : (
                              <span className="text-red-500 font-semibold">
                                Absent
                              </span>
                            )}
                          </Td>
                        </Tr>
                      ))}
                  </React.Fragment>
                ))
              ) : (
                <Tr>
                  <Td
                    colSpan="5"
                    textAlign="center"
                    borderColor="gray.300"
                    borderWidth="1px"
                  >
                    No attendance records available.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
  );
};

export default AllAttendancePage;
