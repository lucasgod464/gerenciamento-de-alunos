import { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "super-admin" | "admin" | "user";
}

export const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <SidebarNav role={role} />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
};