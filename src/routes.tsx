import { Routes as RouterRoutes, Route } from "react-router-dom"
import Login from "./pages/Login"
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard"
import Companies from "./pages/SuperAdmin/Companies"
import Emails from "./pages/SuperAdmin/Emails"
import Profile from "./pages/SuperAdmin/Profile"
import UserDashboard from "./pages/User/Dashboard"
import UserProfile from "./pages/User/Profile"
import ReportsPage from "./pages/User/Reports"
import AdminDashboard from "./pages/Admin/Dashboard"
import AdminUsers from "./pages/Admin/Users"
import AdminRooms from "./pages/Admin/Rooms"
import AdminStudies from "./pages/Admin/Studies"
import AdminTags from "./pages/Admin/Tags"
import AdminSpecializations from "./pages/Admin/Specializations"
import AdminProfile from "./pages/Admin/Profile"

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Login />} />
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
      <Route path="/super-admin/companies" element={<Companies />} />
      <Route path="/super-admin/emails" element={<Emails />} />
      <Route path="/super-admin/profile" element={<Profile />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/reports" element={<ReportsPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/rooms" element={<AdminRooms />} />
      <Route path="/admin/studies" element={<AdminStudies />} />
      <Route path="/admin/tags" element={<AdminTags />} />
      <Route path="/admin/specializations" element={<AdminSpecializations />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
    </RouterRoutes>
  )
}