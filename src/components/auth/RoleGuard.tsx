import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole, Permission } from "@/types/auth";
import { Navigate, useLocation } from "react-router-dom";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  companyId?: string;
  requiredPermissions?: Permission[];
}

export function RoleGuard({
  children,
  allowedRoles,
  companyId,
  requiredPermissions = [],
}: RoleGuardProps) {
  const { user, can, isCompanyMember } = useAuth();
  const location = useLocation();

  // Permitir acesso público à rota de formulário
  if (location.pathname.startsWith('/enrollment/')) {
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificação rigorosa de roles
  if (allowedRoles) {
    const hasAllowedRole = allowedRoles.some(role => {
      if (role === "Admin") {
        return user.role === "Admin";
      }
      if (role === "Usuário Comum") {
        return user.role === "Usuário Comum";
      }
      return false;
    });

    if (!hasAllowedRole) {
      // Redireciona para o dashboard apropriado baseado no papel do usuário
      if (user.role === "Admin") {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/user" replace />;
      }
    }
  }

  // Verificação de acesso à empresa
  if (companyId && !isCompanyMember(companyId)) {
    return <Navigate to="/login" replace />;
  }

  // Verificação de permissões
  const hasAllPermissions = requiredPermissions.every((permission) => can(permission));
  if (!hasAllPermissions) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}