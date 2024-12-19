import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Mail,
  FileText,
  UserCircle,
  GraduationCap,
  ClipboardCheck,
  BarChart,
} from "lucide-react";

interface SidebarNavProps {
  role: "super-admin" | "admin" | "user";
}

export const SidebarNav = ({ role }: SidebarNavProps) => {
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
    <nav className="grid items-start gap-2 p-4">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                isActive
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {link.title}
          </NavLink>
        );
      })}
    </nav>
  );
};