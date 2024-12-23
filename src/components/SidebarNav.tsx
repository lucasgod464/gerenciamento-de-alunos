import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  Tag,
  GraduationCap,
  LayoutGrid,
  UserCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarNavProps {
  role: "super-admin" | "admin" | "user";
}

export const SidebarNav = ({ role }: SidebarNavProps) => {
  const adminLinks = [
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
      icon: DoorOpen,
    },
    {
      title: "Categorias",
      href: "/admin/categories",
      icon: Tag,
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
      icon: LayoutGrid,
    },
    {
      title: "Meu Perfil",
      href: "/admin/profile",
      icon: UserCircle,
    },
  ];

  const superAdminLinks = [
    {
      title: "Dashboard",
      href: "/super-admin",
      icon: LayoutDashboard,
    },
    {
      title: "Empresas",
      href: "/super-admin/companies",
      icon: Users,
    },
    {
      title: "E-mails",
      href: "/super-admin/emails",
      icon: Tag,
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
      icon: Users,
    },
    {
      title: "Controle de Presença",
      href: "/user/attendance",
      icon: Tag,
    },
    {
      title: "Minhas Salas",
      href: "/user/my-rooms",
      icon: DoorOpen,
    },
    {
      title: "Relatórios",
      href: "/user/reports",
      icon: LayoutGrid,
    },
    {
      title: "Meu Perfil",
      href: "/user/profile",
      icon: UserCircle,
    },
  ];

  const links = role === "super-admin" ? superAdminLinks : role === "admin" ? adminLinks : userLinks;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild>
                  <NavLink
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
                    <span>{link.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};