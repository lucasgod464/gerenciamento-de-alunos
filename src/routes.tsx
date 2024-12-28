import { createBrowserRouter, Navigate } from "react-router-dom";
import { RoleGuard } from "./components/auth/RoleGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";

// Super Admin
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import SuperAdminCompanies from "./pages/SuperAdmin/Companies";
import SuperAdminEmails from "./pages/SuperAdmin/Emails";
import SuperAdminProfile from "./pages/SuperAdmin/Profile";
import SuperAdminRooms from "./pages/SuperAdmin/Rooms";

// Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminProfile from "./pages/Admin/Profile";
import AdminUsers from "./pages/Admin/Users";
import AdminRooms from "./pages/Admin/Rooms";
import AdminCategories from "./pages/Admin/Categories";
import AdminTags from "./pages/Admin/Tags";
import AdminSpecializations from "./pages/Admin/Specializations";
import AdminFormBuilder from "./pages/Admin/FormBuilder";
import AdminEnrollment from "./pages/Admin/Enrollment";
import AdminStudentsTotal from "./pages/Admin/StudentsTotal";
import AdminNotifications from "./pages/Admin/Notifications";

// User
import UserDashboard from "./pages/User/Dashboard";
import UserProfile from "./pages/User/Profile";
import StudentsPage from "./pages/User/Students";
import AttendancePage from "./pages/User/Attendance";
import ReportsPage from "./pages/User/Reports";
import MyRooms from "./pages/User/MyRooms";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // Super Admin Routes
  {
    path: "/super-admin",
    element: (
      <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
        <SuperAdminDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/super-admin/companies",
    element: (
      <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
        <SuperAdminCompanies />
      </RoleGuard>
    ),
  },
  {
    path: "/super-admin/rooms",
    element: (
      <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
        <SuperAdminRooms />
      </RoleGuard>
    ),
  },
  {
    path: "/super-admin/emails",
    element: (
      <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
        <SuperAdminEmails />
      </RoleGuard>
    ),
  },
  {
    path: "/super-admin/profile",
    element: (
      <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
        <SuperAdminProfile />
      </RoleGuard>
    ),
  },
  // Admin Routes
  {
    path: "/admin",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/enrollment",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminEnrollment />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/students-total",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminStudentsTotal />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/notifications",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminNotifications />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminUsers />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/rooms",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminRooms />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/categories",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminCategories />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/tags",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminTags />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/specializations",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminSpecializations />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminProfile />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/form-builder",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminFormBuilder />
      </RoleGuard>
    ),
  },
  // User Routes
  {
    path: "/user",
    element: (
      <RoleGuard allowedRoles={["USER"]}>
        <UserDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/user/students",
    element: (
      <RoleGuard allowedRoles={["USER"]}>
        <StudentsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/user/attendance",
    element: (
      <RoleGuard allowedRoles={["USER"]}>
        <AttendancePage />
      </RoleGuard>
    ),
  },
  {
    path: "/user/my-rooms",
    element: (
      <RoleGuard allowedRoles={["USER"]}>
        <MyRooms />
      </RoleGuard>
    ),
  },
  {
    path: "/user/reports",
    element: (
      <RoleGuard allowedRoles={["USER"]}>
        <ReportsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/user/profile",
    element: (
      <RoleGuard allowedRoles={["USER"]}>
        <UserProfile />
      </RoleGuard>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
