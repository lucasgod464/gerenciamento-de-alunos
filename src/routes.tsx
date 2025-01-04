import { createBrowserRouter } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { DashboardLayout } from "@/components/DashboardLayout";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AdminUsers from "@/pages/Admin/Users";
import AdminRooms from "@/pages/Admin/Rooms";
import AdminCategories from "@/pages/Admin/Categories";
import AdminEnrollment from "@/pages/Admin/Enrollment";
import AdminStudents from "@/pages/Admin/Students";
import AdminTags from "@/pages/Admin/Tags";
import AdminSpecializations from "@/pages/Admin/Specializations";
import AdminCourses from "@/pages/Admin/Courses";
import AdminStudies from "@/pages/Admin/Studies";
import SuperAdminCompanies from "@/pages/SuperAdmin/Companies";
import { PublicEnrollment } from "@/pages/PublicEnrollment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/enrollment/:companyId",
        element: <PublicEnrollment />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/users",
        element: <AdminUsers />,
      },
      {
        path: "/dashboard/rooms",
        element: <AdminRooms />,
      },
      {
        path: "/dashboard/categories",
        element: <AdminCategories />,
      },
      {
        path: "/dashboard/enrollment",
        element: <AdminEnrollment />,
      },
      {
        path: "/dashboard/students",
        element: <AdminStudents />,
      },
      {
        path: "/dashboard/tags",
        element: <AdminTags />,
      },
      {
        path: "/dashboard/specializations",
        element: <AdminSpecializations />,
      },
      {
        path: "/dashboard/courses",
        element: <AdminCourses />,
      },
      {
        path: "/dashboard/studies",
        element: <AdminStudies />,
      },
      {
        path: "/dashboard/companies",
        element: <SuperAdminCompanies />,
      },
    ],
  },
]);