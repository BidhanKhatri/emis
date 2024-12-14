import React, { useEffect, useState, useContext } from "react";
import { Line, Doughnut, Pie, Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  BarElement,
  Filler,
} from "chart.js";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import LoadingGif from "../assets/loading-gif.gif";
import { AuthContext } from "../context/AuthContext"; // Ensure this path is correct

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const { authToken } = useContext(AuthContext); // Access authToken from context
  const [complaintData, setComplaintData] = useState([]);
  const [userData, setUserData] = useState([]);
  // const [notices, setNotices] = useState([]);
  // const [noticesBySemester, setNoticesBySemester] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();

  const fetchComplaints = async () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const response = await axios.get("/proxy/roles/list/complaints/", config);
      if (response && response.data && Array.isArray(response.data.results)) {
        setComplaintData(response.data.results);
      }
      setError("");
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Failed to load complaints",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError("Failed to load complaints.");
    } finally {
      setLoading(false); // Ensure this runs whether the request succeeds or fails
    }
  };

  const fetchUsers = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const response = await axios.get("/proxy/user/list/", config);
      const allUsers = [];

      if (Array.isArray(response.data[0].teacher)) {
        allUsers.push(...response.data[0].teacher);
      }

      if (Array.isArray(response.data[0].student)) {
        allUsers.push(...response.data[0].student);
      }

      setUserData(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Failed to load users",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // const fetchNotices = async () => {
  //   setLoading(true);
  //   let totalNotices = [];
  //   let noticeBySemester = {};

  //   for (let semesterId = 1; semesterId <= 8; semesterId++) {
  //     try {
  //       const config = {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${authToken.access}`,
  //         },
  //       };

  //       const response = await axios.get(
  //         `/proxy/roles/community/filter_notice/?faculty_batch_sem_id=${semesterId}`,
  //         config
  //       );

  //       if (Array.isArray(response.data)) {
  //         totalNotices = totalNotices.concat(response.data);
  //         noticeBySemester[semesterId] = response.data;
  //       } else {
  //         console.error("Expected an array, but got:", response.data);
  //         setNotices([]);
  //       }

  //       setError("");
  //     } catch (error) {
  //       console.error("Error fetching notices:", error);
  //       setError("Failed to fetch notices.");
  //       toast({
  //         title: "Error fetching notices",
  //         description:
  //           `${error.response?.data?.message} ${semesterId}` ||
  //           "An error occurred while fetching notices.",
  //         status: "error",
  //         position: "top-right",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //       setNotices([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   setNotices(totalNotices);
  //   setNoticesBySemester(noticeBySemester);
  // };

  const fetchAttendanceData = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const response = await axios.get(
        "/proxy/roles/attendance/getdata/",
        config
      );
      if (Array.isArray(response.data)) {
        setAttendanceData(response.data);
      }
      setError("");
    } catch (error) {
      setError("Failed to fetch attendance data.");
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchUsers();
    // fetchNotices();
    fetchAttendanceData();
  }, []);

  // Complaints Data
  const totalComplaints = complaintData.length;
  const solvedComplaints = complaintData.filter((item) => item.solved).length;
  const unsolvedComplaints = totalComplaints - solvedComplaints;

  //Notices Data
  // const totalNotices = notices.length;
  // const semFirstNotice = noticesBySemester[1]?.length || 0;
  // const semSecondNotice = noticesBySemester[2]?.length || 0;
  // const semThirdNotice = noticesBySemester[3]?.length || 0;
  // const semFourthNotice = noticesBySemester[4]?.length || 0;
  // const semFifthNotice = noticesBySemester[5]?.length || 0;
  // const semSixthNotice = noticesBySemester[6]?.length || 0;
  // const semSeventhNotice = noticesBySemester[7]?.length || 0;
  // const semEighthNotice = noticesBySemester[8]?.length || 0;

  const lineData = {
    labels: ["Total", "Solved", "Unsolved"],
    datasets: [
      {
        label: "Complaints",
        data: [totalComplaints, solvedComplaints, unsolvedComplaints],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Users Data for Doughnut Chart
  const teachersCount = userData.filter((user) => user.role_id === 2).length;
  const studentsCount = userData.filter((user) => user.role_id === 3).length;

  const doughnutData = {
    labels: ["Teachers", "Students"],
    datasets: [
      {
        label: "User Breakdown",
        data: [teachersCount, studentsCount],
        backgroundColor: ["#36A2EB", "#4CAF50"],
        borderColor: ["#36A2EB", "#4CAF50"],
        borderWidth: 1,
      },
    ],
  };
  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const chartElement = elements[0];
      const index = chartElement.index;

      if (doughnutData.labels[index] === "Teachers") {
        window.location.href = "/user/list";
      }
      if (doughnutData.labels[index] === "Students") {
        window.location.href = "/user/list";
      }
    }
  };

  const totalUsers = teachersCount + studentsCount;

  // const semesterNoticesData = [
  //   semFirstNotice,
  //   semSecondNotice,
  //   semThirdNotice,
  //   semFourthNotice,
  //   semFifthNotice,
  //   semSixthNotice,
  //   semSeventhNotice,
  //   semEighthNotice,
  // ];
  // const Noticedata = {
  //   labels: [
  //     "Semester 1",
  //     "Semester 2",
  //     "Semester 3",
  //     "Semester 4",
  //     "Semester 5",
  //     "Semester 6",
  //     "Semester 7",
  //     "Semester 8",
  //   ],
  //   datasets: [
  //     {
  //       label: "Notices Count per Semester",
  //       data: semesterNoticesData,
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.6)",
  //         "rgba(54, 162, 235, 0.6)",
  //         "rgba(255, 206, 86, 0.6)",
  //         "rgba(75, 192, 192, 0.6)",
  //         "rgba(153, 102, 255, 0.6)",
  //         "rgba(255, 159, 64, 0.6)",
  //         "rgba(99, 255, 132, 0.6)",
  //         "rgba(235, 54, 162, 0.6)",
  //       ],
  //       borderColor: "rgba(0, 0, 0, 0.1)",
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  if (loading) {
    return (
      <div className="h-[75vh] flex items-center justify-center">
        <img src={LoadingGif} alt="Loadiing..." className="h-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      {/* <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2> */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        {/* Total Users Card */}
        <Link
          to="/user/list"
          className="bg-white p-6 rounded-lg shadow-md border-r-2 border-blue-500  justify-between items-center flex-col lg:flex-row"
        >
          <div className="flex lg:flex-col gap-4 lg:gap-0">
            <h3 className="text-sm font-semibold">Total Users</h3>
            <p className="text-sm font-bold lg:font-3xl">{totalUsers}</p>{" "}
          </div>
          {/* Use totalUsers here */}
          <div>
            <p className="text-sm text-gray-500">Teachers: {teachersCount}</p>
            <p className="text-sm text-gray-500">Students: {studentsCount}</p>
          </div>
        </Link>

        <Link
          to="/list/complaints"
          className="bg-white p-6 rounded-lg shadow-md border-r-2 border-blue-500  justify-between items-center flex-col lg:flex-row"
        >
          <div className="flex lg:flex-col gap-4 lg:gap-0">
            <h3 className="text-sm font-semibold text-nowrap">
              Total Complaints
            </h3>
            <p className="text-sm font-bold lg:font-3xl">{totalComplaints}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Solved: {solvedComplaints}</p>
            <p className="text-sm text-gray-500">
              Unsolved: {unsolvedComplaints}
            </p>
          </div>
        </Link>

        <Link
          to="/"
          className="bg-white p-6 rounded-lg shadow-md border-r-2 border-blue-500 justify-between items-center hidden lg:flex"
        >
          <div>
            <h3 className="text-sm font-semibold">Total Notices</h3>
            <p className="text-3xl font-bold">-</p>{" "}
          </div>
          {/* Use totalNotices here */}
          <div className="grid grid-cols-4 gap-2">
            <p className="text-sm text-gray-500">I: -</p>
            <p className="text-sm text-gray-500">II: -</p>
            <p className="text-sm text-gray-500">III: -</p>
            <p className="text-sm text-gray-500">IV: -</p>
            <p className="text-sm text-gray-500">V: -</p>
            <p className="text-sm text-gray-500">VI: -</p>
            <p className="text-sm text-gray-500">VII: -</p>
            <p className="text-sm text-gray-500">VIII: -</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  ">
        <div className="bg-white rounded-lg shadow-md p-4 ">
          <h3 className="text-lg font-semibold mb-4">Complaints Trend</h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Users Doughnut Chart for displaying total users */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Users Overview</h3>
          <div className="h-64">
            <Doughnut
              data={doughnutData}
              options={{
                ...chartOptions,
                onClick: (event, elements) => handleChartClick(event, elements),
              }}
            />
          </div>
        </div>

        {/* Users Pie Chart for displaying notices */}
        {/* <div className="bg-white rounded-lg shadow-md p-4 ">
          <h3 className="text-lg font-semibold mb-4">Notice Overview</h3>
          <div className="h-64 flex flex-col justify-center items-center">
            <Pie data={Noticedata} options={chartOptions} />
          </div>
        </div> */}

        {/* User Bar Chart for displaying attendance */}
        {/* <div className="bg-white rounded-lg shadow-md p-4 ">
          <h3 className="text-lg font-semibold mb-4">Attendance Data</h3>
          <div className="h-64 flex flex-col justify-center items-center">
            <Bar data={attendanceBar} options={chartOptions} />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardPage;
