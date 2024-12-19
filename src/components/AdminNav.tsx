import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, Users2, ClipboardList, FileBarChart2, UserCircle } from "lucide-react";

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart,
  },
  {
    title: "Alunos",
    href: "/admin/students",
    icon: Users2,
  },
  {
    title: "Frequência",
    href: "/admin/attendance",
    icon: ClipboardList,
  },
  {
    title: "Relatórios",
    href: "/admin/reports",
    icon: FileBarChart2,
  },
  {
    title: "Meu Perfil",
    href: "/admin/profile",
    icon: UserCircle,
  },
];

export function AdminNav() {
  const location = useLocation();

  return (
    <nav className="grid items-start gap-2">
      {adminRoutes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
            location.pathname === route.href
              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          <route.icon className="h-4 w-4" />
          <span>{route.title}</span>
        </Link>
      ))}
    </nav>
  );
}