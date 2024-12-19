import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, Users, School, BookOpen, Tag, GraduationCap } from "lucide-react";

const adminRoutes = [
  {
    title: "Relatório",
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
    title: "Cursos/Treinamentos",
    href: "/admin/courses",
    icon: GraduationCap,
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
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            location.pathname === route.href ? "bg-accent" : "transparent"
          )}
        >
          <route.icon className="mr-2 h-4 w-4" />
          <span>{route.title}</span>
        </Link>
      ))}
    </nav>
  );
}