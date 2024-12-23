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
      <div className="flex min-h-screen w-full bg-muted/50">
        <div className="w-52 border-r border-border bg-background">
          <AdminNav />
        </div>
        <main className="flex-1">
          <div className="container mx-auto max-w-[1400px] min-w-[600px] p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};