import { createContext, useEffect, useState } from "react";
import { useToast, Box, Text, Button } from "@chakra-ui/react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const toast = useToast();
  const navigate = useNavigate();

  //state handler
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken")
      ? JSON.parse(localStorage.getItem("authToken"))
      : null
  );
  const [userData, setUserData] = useState(
    localStorage.getItem("authToken")
      ? jwtDecode(localStorage.getItem("authToken"))
      : null
  );
  const [userRole, setUserRole] = useState("");
  const [userIdLogin, setUserIdLogin] = useState("");
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(true);
  const [userName, setUserName] = useState("");

  console.log(authToken);
  // function for handleLogin
  async function handleLogin(email, password) {
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const result = await axios.post(
        "/proxy/user/login_page/",
        { email, password },
        config
      );

      console.log(result);

      if (
        result &&
        result.data &&
        result.status === 200 &&
        result.statusText === "OK"
      ) {
        console.log(result);
        localStorage.setItem("authToken", JSON.stringify(result.data.data));
        if (result.data.msg === "user is inactive") {
          localStorage.removeItem("authToken");
          setAuthToken(null);
          setUserData(null);
          toast({
            title: result.data.msg,
            status: "error",
            duration: 3000,
            position: "top-right",
            isClosable: true,
          });
          return;
        }
        setUserData(jwtDecode(result.data.data.access));
        setAuthToken(result.data.data);
        setUserRole(result.data.roleId);
        setUserName(result.data.name);
        setUserIdLogin(result.data.userId);
        navigate("/");

        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      } else {
        toast({
          title: "Login Failed",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (err) {
      const errorMessage = err.response.data.detail || "An error occurred";
      toast({
        title: errorMessage,
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  }

  // function for createUser
  async function createUser(userID, username, email, role_id) {
    if (!userID || !username || !email || !role_id) {
      toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      };

      const result = await axios.post(
        "/proxy/user/create/",
        [{ userID, username, email, role_id }],
        config
      );

      if (result) {
        toast({
          title: "User created successfully",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      } else {
        const errMsg = "Failed to create user";
        toast({
          title: errMsg,
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (err) {
      let errMsg = "An error occurred"; // Properly declaring the errMsg variable

      if (err.response) {
        let responseData = err.response.data;

        if (Array.isArray(responseData)) {
          // If the response is an array, extract the first element's message
          if (responseData[0]?.email) {
            errMsg = responseData[0].email[0]; // Extract the email error message if it exists
          }
        } else if (responseData?.msg) {
          // If responseData has a msg field, use it
          errMsg = responseData.msg;
        } else if (responseData?.detail) {
          // If responseData has a detail field, use it
          errMsg = responseData.detail;
        } else if (responseData?.email) {
          // If the response contains an email-specific error, use it
          errMsg = responseData.email[0];
        }
      } else if (err.message) {
        // Use the generic error message if no specific error details are available
        errMsg = err.message;
      }

      // Display the error message using toast
      toast({
        title: errMsg,
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  }

  // function for logout user
  async function logoutUser(e) {
    e.preventDefault();
    toast({
      title: "Confirm Logout",
      description: "Are you sure you want to logout?",
      status: "warning",
      duration: 3000,
      position: "top-right",
      isClosable: true,
      render: () => (
        <Box
          color="black"
          p={3}
          className="bg-white flex flex-col items-center justify-center border border-gray-300/80"
          borderRadius="md"
          mt={16}
        >
          <Text fontWeight="bold">Confirm Logout !</Text>
          <Text>Are you sure you want to logout?</Text>
          <Box>
            <Button
              mt={3}
              colorScheme="red"
              onClick={() => {
                localStorage.removeItem("authToken");
                //localStorage.removeItem("newToken");
                setAuthToken(null);
                setUserData(null);
                setUserName("");
                setUserRole("");
                navigate("/login");
                toast.closeAll(); // Close all toasts if user confirms
              }}
            >
              Logout
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
  }

  // function to update token using refresh token
  async function updateToken() {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const result = await axios.post(
        "/proxy/api/token/refresh/",
        { refresh: authToken.refresh },
        config
      );
      if (result && result.data) {
        console.log("Received token response:", result.data);
        //localStorage.setItem("newToken", JSON.stringify(result.data));
        setAuthToken({ ...authToken, access: result.data.access });
        // setUserData(jwtDecode(result.data.access));
      } else {
        console.error("Unexpected response structure:", result);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (authToken) {
        updateToken();
      } else {
        setAuthToken(null);
        setUserData(null);
        navigate("/login");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [authToken]);

  //fucntion to check the user profile
  async function checkUser() {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access}`,
        },
      };
      console.log(config);
      const result = await axios.get("/proxy/user/profile/", config);
      if (result && result.data) {
        // console.log(result.data.role);
        setUserRole(result.data.role);
        setUserName(result.data.profile.username);
        console.log(result.data.role);
      }
    } catch (err) {
      console.log(err);
    }
  }

  //function to toggle left side bar for small screen

  const handleLeftSideBarToggle = () => {
    setIsLeftSideBarOpen(!isLeftSideBarOpen);
  };

  useEffect(() => {
    checkUser();
  }, []);

  //function to toggle Popup box
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleToggle = () => {
    setIsPopupOpen((prev) => !prev);
  };

  //sending the function at the top level and variable value at the bottom
  let contextValue = {
    //functions here
    handleLogin,
    createUser,
    updateToken,
    logoutUser,
    handleToggle,
    checkUser,
    handleLeftSideBarToggle,
    setIsLeftSideBarOpen,
    //variables here
    authToken,
    userData,
    userRole,
    userIdLogin,
    isLeftSideBarOpen,
    userName,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
