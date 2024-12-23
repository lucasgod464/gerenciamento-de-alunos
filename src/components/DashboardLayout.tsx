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
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="flex-1 bg-muted/50">
          <div className="container mx-auto min-h-full p-6">
            <div className="min-w-[800px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}