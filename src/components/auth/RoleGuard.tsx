import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole, Permission } from "@/types/auth";
import { Navigate } from "react-router-dom";

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificação rigorosa de roles
  if (allowedRoles) {
    const hasAllowedRole = allowedRoles.some(role => {
      if (role === "SUPER_ADMIN") {
        return user.role === "SUPER_ADMIN";
      }
      if (role === "ADMIN") {
        return user.role === "ADMIN" || user.accessLevel === "Admin";
      }
      if (role === "USER") {
        return user.role === "USER" || user.accessLevel === "Usuário Comum";
      }
      return false;
    });

    if (!hasAllowedRole) {
      // Redireciona para o dashboard apropriado baseado no papel do usuário
      if (user.role === "SUPER_ADMIN") {
        return <Navigate to="/super-admin" replace />;
      } else if (user.role === "ADMIN" || user.accessLevel === "Admin") {
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