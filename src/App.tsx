import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import Companies from "./pages/SuperAdmin/Companies";
import Emails from "./pages/SuperAdmin/Emails";
import { AuthGuard } from "./components/AuthGuard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/super-admin/dashboard"
        element={
          <AuthGuard requiredRole="super-admin">
            <SuperAdminDashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/super-admin/companies"
        element={
          <AuthGuard requiredRole="super-admin">
            <Companies />
          </AuthGuard>
        }
      />
      <Route
        path="/super-admin/emails"
        element={
          <AuthGuard requiredRole="super-admin">
            <Emails />
          </AuthGuard>
        }
      />
      <Route
        path="/admin/*"
        element={
          <AuthGuard requiredRole="admin">
            <div>Admin Dashboard</div>
          </AuthGuard>
        }
      />
      <Route
        path="/user/*"
        element={
          <AuthGuard requiredRole="user">
            <div>User Dashboard</div>
          </AuthGuard>
        }
      />
    </Routes>
  );
}

export default App;