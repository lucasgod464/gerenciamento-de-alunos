import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, Users, School, BookOpen, Tag, GraduationCap, UserCircle, FormInput } from "lucide-react";

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart,
  },
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Salas",
    href: "/admin/rooms",
    icon: School,
  },
  {
    title: "Estudos",
    href: "/admin/studies",
    icon: BookOpen,
  },
  {
    title: "Etiquetas",
    href: "/admin/tags",
    icon: Tag,
  },
  {
    title: "Especializações",
    href: "/admin/specializations",
    icon: GraduationCap,
  },
  {
    title: "Construtor de Formulário",
    href: "/admin/form-builder",
    icon: FormInput,
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