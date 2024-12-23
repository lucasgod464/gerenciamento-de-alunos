import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  Building2,
  Tags,
  Boxes,
  GraduationCap,
  FormInput,
  UserCircle,
} from "lucide-react";

const adminRoutes = [
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Salas",
    href: "/admin/rooms",
    icon: Building2,
  },
  {
    title: "Categorias",
    href: "/admin/categories",
    icon: Boxes,
  },
  {
    title: "Tags",
    href: "/admin/tags",
    icon: Tags,
  },
  {
    title: "Especializações",
    href: "/admin/specializations",
    icon: GraduationCap,
  },
  {
    title: "Form Builder",
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
    <nav className="flex flex-col h-full">
      {adminRoutes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className={cn(
            "flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100",
            location.pathname === route.href
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          <route.icon className="h-5 w-5 mr-3" />
          <span className="flex-1">{route.title}</span>
        </Link>
      ))}
    </nav>
  );
};