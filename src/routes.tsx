import { createBrowserRouter, Navigate } from "react-router-dom";
import { RoleGuard } from "./components/auth/RoleGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";

// Super Admin
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import SuperAdminCompanies from "./pages/SuperAdmin/Companies";
import SuperAdminEmails from "./pages/SuperAdmin/Emails";
import SuperAdminProfile from "./pages/SuperAdmin/Profile";

// User
import UserDashboard from "./pages/User/Dashboard";
import UserProfile from "./pages/User/Profile";
import StudentsPage from "./pages/User/Students";
import AttendancePage from "./pages/User/Attendance";
import ReportsPage from "./pages/User/Reports";

export const router = createBrowserRouter([
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
        <UserDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/students",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <StudentsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/attendance",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AttendancePage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <ReportsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <UserProfile />
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