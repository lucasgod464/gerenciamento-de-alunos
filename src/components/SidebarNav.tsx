import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Mail,
  UserCircle,
  GraduationCap,
  ClipboardCheck,
  BarChart,
  DoorOpen,
} from "lucide-react";

interface SidebarNavProps {
  role: "super-admin" | "admin" | "user";
}

export const SidebarNav = ({ role }: SidebarNavProps) => {
  const location = useLocation();

  const superAdminLinks = [
    {
      title: "Dashboard",
      href: "/super-admin",
      icon: LayoutDashboard,
    },
    {
      title: "Empresas",
      href: "/super-admin/companies",
      icon: Building2,
    },
    {
      title: "E-mails",
      href: "/super-admin/emails",
      icon: Mail,
    },
    {
      title: "Meu Perfil",
      href: "/super-admin/profile",
      icon: UserCircle,
    },
  ];

  const userLinks = [
    {
      title: "Dashboard",
      href: "/user",
      icon: LayoutDashboard,
    },
    {
      title: "Cadastro de Alunos",
      href: "/user/students",
      icon: GraduationCap,
    },
    {
      title: "Controle de Presença",
      href: "/user/attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Minhas Salas",
      href: "/user/my-rooms",
      icon: DoorOpen,
    },
    {
      title: "Relatórios",
      href: "/user/reports",
      icon: BarChart,
    },
    {
      title: "Meu Perfil",
      href: "/user/profile",
      icon: UserCircle,
    },
  ];

  const links = role === "super-admin" ? superAdminLinks : userLinks;

  return (
    <nav className="grid items-start gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === link.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{link.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};