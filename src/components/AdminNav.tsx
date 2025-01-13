import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Layers, 
  School, 
  Users, 
  Tag, 
  UserCircle,
  FormInput,
  UserPlus,
  Bell
} from "lucide-react";

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Inscrição Online",
    href: "/admin/enrollment",
    icon: UserPlus,
  },
  {
    title: "Alunos Total",
    href: "/admin/students-total",
    icon: Users,
  },
  {
    title: "Avisos",
    href: "/admin/notifications",
    icon: Bell,
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
    title: "Formulário",
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
    <nav className="grid items-start gap-1">
      {adminRoutes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full min-w-[200px]",
            location.pathname === route.href
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <route.icon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{route.title}</span>
        </Link>
      ))}
    </nav>
  );
}
