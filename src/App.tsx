import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Emails from "@/pages/SuperAdmin/Emails";
import SuperAdminDashboard from "@/pages/SuperAdmin/Dashboard";
import Companies from "@/pages/SuperAdmin/Companies";
import AdminDashboard from "@/pages/Admin/Dashboard";
import Users from "@/pages/Admin/Users";
import Rooms from "@/pages/Admin/Rooms";
import Studies from "@/pages/Admin/Studies";
import Tags from "@/pages/Admin/Tags";
import Specializations from "@/pages/Admin/Specializations";
import UserDashboard from "@/pages/User/Dashboard";
import UserProfile from "@/pages/User/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/companies" element={<Companies />} />
        <Route path="/super-admin/emails" element={<Emails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        <Route path="/admin/studies" element={<Studies />} />
        <Route path="/admin/tags" element={<Tags />} />
        <Route path="/admin/specializations" element={<Specializations />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;