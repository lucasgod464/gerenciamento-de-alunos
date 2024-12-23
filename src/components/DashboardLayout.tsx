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
      <div className="min-h-screen flex w-full">
        <div className="w-52 min-h-screen border-r border-border bg-background">
          <AdminNav />
        </div>
        <main className="flex-1 p-4 lg:p-6 bg-muted/50 overflow-x-auto">
          <div className="container mx-auto max-w-[1400px] min-w-[600px] px-0">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};