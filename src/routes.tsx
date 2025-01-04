import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { TeacherRoute } from "@/components/TeacherRoute";
import { Loader } from "@/components/Loader";

const Login = lazy(() => import("@/pages/Login"));
const AdminEnrollment = lazy(() => import("@/pages/Admin/Enrollment"));
const PublicEnrollment = lazy(() => import("@/pages/PublicEnrollment"));

export const routes = [
  {
    path: "/",
    element: <Login />,
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