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
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // Super Admin Routes
  {
    path: "/super-admin",
    element: (
      <RoleGuard role="SUPER_ADMIN">
        <SuperAdminDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/super-admin/companies",
    element: (
      <RoleGuard role="SUPER_ADMIN">
        <SuperAdminCompanies />
      </RoleGuard>
    ),
  },
  {
    path: "/super-admin/emails",
    element: (
      <RoleGuard role="SUPER_ADMIN">
        <SuperAdminEmails />
      </RoleGuard>
    ),
  },
  {
    path: "/super-admin/profile",
    element: (
      <RoleGuard role="SUPER_ADMIN">
        <SuperAdminProfile />
      </RoleGuard>
    ),
  },
  // User Routes
  {
    path: "/user",
    element: (
      <RoleGuard role="USER">
        <UserDashboard />
      </RoleGuard>
    ),
  },
  {
    path: "/user/students",
    element: (
      <RoleGuard role="USER">
        <StudentsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/user/attendance",
    element: (
      <RoleGuard role="USER">
        <AttendancePage />
      </RoleGuard>
    ),
  },
  {
    path: "/user/reports",
    element: (
      <RoleGuard role="USER">
        <ReportsPage />
      </RoleGuard>
    ),
  },
  {
    path: "/user/profile",
    element: (
      <RoleGuard role="USER">
        <UserProfile />
      </RoleGuard>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);