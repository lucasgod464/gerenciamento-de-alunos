import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import Companies from "./pages/SuperAdmin/Companies";
import Emails from "./pages/SuperAdmin/Emails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/super-admin">
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="companies" element={<Companies />} />
        <Route path="emails" element={<Emails />} />
      </Route>
      <Route path="/admin/*" element={<div>Admin Dashboard</div>} />
      <Route path="/user/*" element={<div>User Dashboard</div>} />
    </Routes>
  );
}

export default App;