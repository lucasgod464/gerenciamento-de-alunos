import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AccessLevel } from "@/types/auth";

interface RoleGuardProps {
  children: ReactNode;
  role: AccessLevel;
  companyId?: string;
}

export function RoleGuard({
  children,
  role,
  companyId,
}: RoleGuardProps) {
  const { user, isCompanyMember } = useAuth();

  if (!user) return null;

  // Check role access
  if (role && user.role !== role) {
    return null;
  }

  // Check company access
  if (companyId && !isCompanyMember(companyId)) {
    return null;
  }

  return <>{children}</>;
}