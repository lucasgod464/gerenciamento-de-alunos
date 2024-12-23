import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, GraduationCap, Layers, School, Users, Tag, UserCircle } from "lucide-react";

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Especializações",
    href: "/admin/specializations",
    icon: GraduationCap,
  },
  {
    title: "Categorias",
    href: "/admin/categories",
    icon: Layers,
  },
  {
    title: "Salas",
    href: "/admin/rooms",
    icon: School,
  },
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Etiquetas",
    href: "/admin/tags",
    icon: Tag,
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
    <nav className="flex flex-col space-y-1 w-full">
      {adminRoutes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className={cn(
            "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg",
            location.pathname === route.href
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <route.icon className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className="flex-1">{route.title}</span>
        </Link>
      ))}
    </nav>
  );
}