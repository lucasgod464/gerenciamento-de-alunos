import { Routes as RouterRoutes, Route } from "react-router-dom"
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard"
import Companies from "./pages/SuperAdmin/Companies"
import Emails from "./pages/SuperAdmin/Emails"
import Profile from "./pages/SuperAdmin/Profile"
import UserDashboard from "./pages/User/Dashboard"
import UserProfile from "./pages/User/Profile"
import ReportsPage from "./pages/User/Reports"

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
      <Route path="/super-admin/companies" element={<Companies />} />
      <Route path="/super-admin/emails" element={<Emails />} />
      <Route path="/super-admin/profile" element={<Profile />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/reports" element={<ReportsPage />} />
    </RouterRoutes>
  )
}