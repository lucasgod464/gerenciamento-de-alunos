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
import UserProfile from "./pages/User/Profile";

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
  // User Routes
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