import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import Companies from "./pages/SuperAdmin/Companies";
import Emails from "./pages/SuperAdmin/Emails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/super-admin/companies" element={<Companies />} />
      <Route path="/super-admin/emails" element={<Emails />} />
      <Route path="/admin/*" element={<div>Admin Dashboard</div>} />
      <Route path="/user/*" element={<div>User Dashboard</div>} />
    </Routes>
  );
}

export default App;