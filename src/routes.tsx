import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import PublicEnrollment from "@/pages/PublicEnrollment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/enrollment/:companyId",
    element: <PublicEnrollment />,
  },
]);