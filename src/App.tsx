import { Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Companies from "./pages/SuperAdmin/Companies"
import Emails from "./pages/SuperAdmin/Emails"
import Dashboard from "./pages/SuperAdmin/Dashboard"

// Admin routes
import AdminDashboard from "./pages/Admin/Dashboard"
import AdminUsers from "./pages/Admin/Users"
import AdminCourses from "./pages/Admin/Courses"
import AdminRooms from "./pages/Admin/Rooms"
import AdminStudies from "./pages/Admin/Studies"
import AdminSpecializations from "./pages/Admin/Specializations"
import AdminTags from "./pages/Admin/Tags"

// User routes
import UserDashboard from "./pages/User/Dashboard"
import UserProfile from "./pages/User/Profile"
import UserStudents from "./pages/User/Students"
import UserAttendance from "./pages/User/Attendance"
import UserReports from "./pages/User/Reports"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Super Admin Routes */}
      <Route path="/super-admin/dashboard" element={<Dashboard />} />
      <Route path="/super-admin/companies" element={<Companies />} />
      <Route path="/super-admin/emails" element={<Emails />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/rooms" element={<AdminRooms />} />
      <Route path="/admin/studies" element={<AdminStudies />} />
      <Route path="/admin/specializations" element={<AdminSpecializations />} />
      <Route path="/admin/tags" element={<AdminTags />} />
      
      {/* User Routes */}
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/students" element={<UserStudents />} />
      <Route path="/user/attendance" element={<UserAttendance />} />
      <Route path="/user/reports" element={<UserReports />} />
    </Routes>
  )
}

export default App