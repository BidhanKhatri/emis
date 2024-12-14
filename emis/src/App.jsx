import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import ListComplaintsPage from "./pages/ListComplaintsPage";
import CreateUserPage from "./pages/CreateUserPage";
import ListAllUser from "./pages/ListAllUser";
import ListNoticePage from "./pages/ListNoticePage";
import AllAttendancePage from "./pages/AllAttendancePage";
import CreateRolePage from "./pages/CreateRolePage";
import ListAllRolesPage from "./pages/ListAllRolesPage";
import CreateNoticePage from "./pages/CreateNoticePage";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import CreatePermissionPage from "./pages/CreatePermissionPage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ListAllAssignmentPage from "./pages/ListAllAssignmentPage";
import CreateAttendacePage from "./pages/CreateAttendancePage";
import CreateAssignmentPage from "./pages/CreateAssignmentPage";
import CreateQuestionPage from "./pages/CreateQuestionPage";
import DisplayQnAPage from "./pages/DisplayQnAPage";
import CreateComplaintsPage from "./pagesTeacher/CreateComplaintsPage";
import MyComplaintsPage from "./pagesTeacher/MyComplaintsPage";
import EditProfile from "./components/EditProfile";
import ProfilePage from "./pagesTeacher/ProfilePage";
import ListPermissionPage from "./pages/ListPermissionPage";
import MyAssignmentPage from "./pagesTeacher/MyAssignmentPage";

function App() {
  const { userRole, authToken } = useContext(AuthContext);

  if (!authToken) {
    // Redirect to login if the user is not authenticated
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // Admin components
  function adminComponents() {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/create"
          element={
            <PrivateRoute>
              <CreateUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list/complaints"
          element={
            <PrivateRoute>
              <ListComplaintsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/list"
          element={
            <PrivateRoute>
              <ListAllUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-notice"
          element={
            <PrivateRoute>
              <ListNoticePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-attendance"
          element={
            <PrivateRoute>
              <AllAttendancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create/role"
          element={
            <PrivateRoute>
              <CreateRolePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create/permission"
          element={
            <PrivateRoute>
              <CreatePermissionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list/permission"
          element={
            <PrivateRoute>
              <ListPermissionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-assignment"
          element={
            <PrivateRoute>
              <ListAllAssignmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-assignment"
          element={
            <PrivateRoute>
              <CreateAssignmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-attendance"
          element={
            <PrivateRoute>
              <CreateAttendacePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-roles"
          element={
            <PrivateRoute>
              <ListAllRolesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-notice"
          element={
            <PrivateRoute>
              <CreateNoticePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-qna"
          element={
            <PrivateRoute>
              <CreateQuestionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-qna"
          element={
            <PrivateRoute>
              <DisplayQnAPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Teacher components
  function teacherComponents() {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/list-notice"
          element={
            <PrivateRoute>
              <ListNoticePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-complaint"
          element={
            <PrivateRoute>
              <CreateComplaintsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-complaint"
          element={
            <PrivateRoute>
              <MyComplaintsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-attendance"
          element={
            <PrivateRoute>
              <AllAttendancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-assignment"
          element={
            <PrivateRoute>
              <CreateAssignmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/view-profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-qna"
          element={
            <PrivateRoute>
              <CreateQuestionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-qna"
          element={
            <PrivateRoute>
              <DisplayQnAPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-assignment"
          element={
            <PrivateRoute>
              <MyAssignmentPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <>
      {authToken && (
        <div className="flex">
          <Sidebar />
          <div className="flex-grow bg-gray-100 min-h-screen">
            <Topbar />
            <div className="px-6">
              <div className="container mx-auto my-8">
                {userRole === "Admin" && <>{adminComponents()}</>}
                {userRole === "Teacher" && <>{teacherComponents()}</>}
                {userRole === "Student" && (
                  <h1>This is the student dashboard</h1>
                )}
                {!userRole && <h1>Invalid role</h1>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
