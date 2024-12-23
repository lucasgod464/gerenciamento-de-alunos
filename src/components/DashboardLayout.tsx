import { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
import { AdminNav } from "./AdminNav";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "super-admin" | "admin" | "user";
}

export const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen w-full">
      <div className="w-64 min-w-[250px] bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {role === "admin" ? <AdminNav /> : <SidebarNav role={role} />}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};