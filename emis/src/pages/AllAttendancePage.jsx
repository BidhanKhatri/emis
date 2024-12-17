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
  useToast,
} from "@chakra-ui/react";

const AllAttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
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
    const params = {};
    if (userID) params.userID = userID;
    if (subjectID) params.subjectID = subjectID;
    if (selectedDate) params.date = selectedDate;

    try {
      const response = await axios.get("/proxy/roles/attendance/getdata/", {
        ...config,
        params,
      });

      if (Array.isArray(response.data.results)) {
        setAttendanceData(response.data.results);
      } else {
        setAttendanceData([]);
      }
      setError("");
    } catch (error) {
      setError("Failed to fetch attendance data.");
      toast({
        title: "Error",
        description: "Failed to fetch attendance data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const semester =
    attendanceData.length > 0 ? attendanceData[0].faculty_batch_sem : "";
  const subject = attendanceData.length > 0 ? attendanceData[0].subject : "";
  const date =
    attendanceData.length > 0 ? new Date(attendanceData[0].date) : null;
  const year = date ? date.getFullYear() : "";
  const month = date ? date.toLocaleString("default", { month: "long" }) : "";

  return (
    <Box p="6" flex="1" overflowY="auto" backgroundColor="transparent">
      <Box display="flex" justifyContent="space-between" mb="4">
        <Box display="flex" width="100%" gap="10">
          <Box display="flex" flexDirection="column" gap="4">
            <Input
              placeholder="User ID"
              borderColor="blue.500"
              onChange={(e) => setUserID(e.target.value)}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap="4">
            <Input
              placeholder="Subject ID"
              borderColor="blue.500"
              onChange={(e) => setSubjectID(e.target.value)}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap="4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              borderColor="blue.500"
            />
          </Box>
        </Box>
        <Button
          onClick={fetchAttendanceData}
          colorScheme="blue"
          fontSize="sm"
          ml="4"
        >
          Fetch Attendance
        </Button>
      </Box>

      <Box mb="4">
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
            <Th color="white" borderColor="gray.300">Subject</Th>
            <Th color="white" borderColor="gray.300">Semester</Th>
            <Th color="white" borderColor="gray.300">Date</Th>
            <Th color="white" borderColor="gray.300">User ID</Th>
            <Th color="white" borderColor="gray.300">Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((attendance, index) => (
              <React.Fragment key={index}>
                {attendance.records &&
                  attendance.records.map((record, i) => (
                    <Tr key={i}>
                      <Td borderColor="gray.300">{attendance.subject}</Td>
                      <Td borderColor="gray.300">
                        {attendance.faculty_batch_sem}
                      </Td>
                      <Td borderColor="gray.300">{attendance.date}</Td>
                      <Td borderColor="gray.300">{record.userID}</Td>
                      <Td borderColor="gray.300">
                        {record.status === "True" ? (
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            Present
                          </span>
                        ) : (
                          <span style={{ color: "red", fontWeight: "bold" }}>
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
              <Td colSpan="5" textAlign="center" borderColor="gray.300">
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
