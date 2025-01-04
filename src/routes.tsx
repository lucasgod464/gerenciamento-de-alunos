import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { TeacherRoute } from "@/components/TeacherRoute";
import { Loader } from "@/components/Loader";

const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Students = lazy(() => import("@/pages/Students"));
const StudentDetails = lazy(() => import("@/pages/StudentDetails"));
const Classes = lazy(() => import("@/pages/Classes"));
const ClassDetails = lazy(() => import("@/pages/ClassDetails"));
const Teachers = lazy(() => import("@/pages/Teachers"));
const TeacherDetails = lazy(() => import("@/pages/TeacherDetails"));
const Profile = lazy(() => import("@/pages/Profile"));
const AdminEnrollment = lazy(() => import("@/pages/Admin/Enrollment"));
const PublicEnrollment = lazy(() => import("@/pages/PublicEnrollment"));

export const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/students",
    element: (
      <PrivateRoute>
        <Students />
      </PrivateRoute>
    ),
  },
  {
    path: "/students/:id",
    element: (
      <PrivateRoute>
        <StudentDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/classes",
    element: (
      <TeacherRoute>
        <Classes />
      </TeacherRoute>
    ),
  },
  {
    path: "/classes/:id",
    element: (
      <TeacherRoute>
        <ClassDetails />
      </TeacherRoute>
    ),
  },
  {
    path: "/teachers",
    element: (
      <AdminRoute>
        <Teachers />
      </AdminRoute>
    ),
  },
  {
    path: "/teachers/:id",
    element: (
      <AdminRoute>
        <TeacherDetails />
      </AdminRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/enrollment",
    element: (
      <AdminRoute>
        <AdminEnrollment />
      </AdminRoute>
    ),
  },
  {
    path: "/enrollment/:companyId",
    element: <PublicEnrollment />,
  },
];

export const Router = () => {
  return (
    <RouterProvider
      router={createBrowserRouter(routes)}
      fallbackElement={<Loader />}
    />
  );
};
