import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  School,
  Tags,
  GraduationCap,
  UserCircle,
  FormInput,
  FolderKanban,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
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
    title: "Categorias",
    href: "/admin/categories",
    icon: FolderKanban,
  },
  {
    title: "Etiquetas",
    href: "/admin/tags",
    icon: Tags,
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
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-6">
        <h2 className="text-lg font-semibold">Painel Admin</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton asChild>
                  <Link
                    to={route.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      location.pathname === route.href
                        ? "bg-gray-100 text-primary dark:bg-gray-800"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{route.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}