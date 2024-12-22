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
      <div className="w-64 min-h-screen bg-white border-r">
        {role === "admin" ? (
          <div className="p-4">
            <AdminNav />
          </div>
        ) : (
          <SidebarNav role={role} />
        )}
      </div>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
};