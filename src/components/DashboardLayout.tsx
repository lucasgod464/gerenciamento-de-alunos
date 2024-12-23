import { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
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
        <div className="w-64 min-h-screen border-r border-border bg-background">
          <AdminNav />
        </div>
        <main className="flex-1 p-6 bg-muted/50">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};