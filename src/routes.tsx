import { createBrowserRouter } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";
import { Companies } from "@/pages/Admin/Companies";
import { Users } from "@/pages/Admin/Users";
import { Rooms } from "@/pages/Admin/Rooms";
import { Students } from "@/pages/Admin/Students";
import { StudentsTotal } from "@/pages/Admin/StudentsTotal";
import { Enrollment } from "@/pages/Admin/Enrollment";
import { PublicEnrollment } from "@/pages/PublicEnrollment";
import { NotFound } from "@/pages/NotFound";

export const routes = [
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute allowedRoles={["ADMIN", "USER"]} />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />,
    children: [
      {
        path: "/admin/companies",
        element: <Companies />,
      },
      {
        path: "/admin/users",
        element: <Users />,
      },
      {
        path: "/admin/rooms",
        element: <Rooms />,
      },
      {
        path: "/admin/students",
        element: <Students />,
      },
      {
        path: "/admin/students-total",
        element: <StudentsTotal />,
      },
      {
        path: "/admin/enrollment",
        element: <Enrollment />,
      },
    ],
  },
  {
    path: "/enrollment/:companyId",
    element: <PublicEnrollment />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);