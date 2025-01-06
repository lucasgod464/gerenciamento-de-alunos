import { useAuth } from "@/hooks/useAuth";

export const useCompanyId = () => {
  const { user } = useAuth();
  return user?.companyId;
};