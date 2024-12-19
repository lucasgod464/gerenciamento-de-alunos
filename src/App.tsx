import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import UserDashboard from "./pages/User/Dashboard";
import StudentsPage from "./pages/User/Students";
import AttendancePage from "./pages/User/Attendance";
import ReportsPage from "./pages/User/Reports";
import AdminDashboard from "./pages/Admin/Dashboard";
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* User Routes */}
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/students" element={<StudentsPage />} />
        <Route path="/user/attendance" element={<AttendancePage />} />
        <Route path="/user/reports" element={<ReportsPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
