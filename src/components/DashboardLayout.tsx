import { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
import { AdminNav } from "./AdminNav";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "super-admin" | "admin" | "user";
}

export const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-white border-b md:border-r">
        <div className="p-4 md:p-6">
          {role === "admin" ? <AdminNav /> : <SidebarNav role={role} />}
        </div>
      </div>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
};
