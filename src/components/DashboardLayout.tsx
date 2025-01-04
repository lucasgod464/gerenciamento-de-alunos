import { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
import { AdminNav } from "./AdminNav";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "super-admin" | "admin" | "user";
}

export const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          {role === "admin" ? <AdminNav /> : <SidebarNav role={role} />}
        </div>
      </div>
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
};