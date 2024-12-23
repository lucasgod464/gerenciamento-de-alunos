import { ReactNode } from "react";
import { AdminNav } from "./AdminNav";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "super-admin" | "admin" | "user";
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="w-52 border-r border-border bg-background">
          <AdminNav />
        </div>
        <main className="flex-1 bg-background overflow-auto">
          <div className="h-full p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};