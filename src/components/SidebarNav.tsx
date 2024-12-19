import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, Building2, Mail, Menu } from "lucide-react";

const roleRoutes = {
  "super-admin": [
    { icon: BarChart, label: "Relatórios", path: "/super-admin" },
    { icon: Building2, label: "Empresas", path: "/super-admin/companies" },
    { icon: Mail, label: "E-mails", path: "/super-admin/emails" },
  ],
  "admin": [
    { icon: BarChart, label: "Dashboard", path: "/admin" },
    { icon: User, label: "Usuários", path: "/admin/users" },
  ],
  "user": [
    { icon: BarChart, label: "Dashboard", path: "/user" },
    { icon: User, label: "Perfil", path: "/user/profile" },
  ],
};

interface SidebarNavProps {
  role: "super-admin" | "admin" | "user";
}

export const SidebarNav = ({ role }: SidebarNavProps) => {
  const location = useLocation();
  const routes = roleRoutes[role];

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Painel {role}</h1>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Menu className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="space-y-1">
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
              location.pathname === route.path
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <route.icon className="w-5 h-5" />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};