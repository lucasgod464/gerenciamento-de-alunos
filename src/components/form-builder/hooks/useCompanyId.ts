import { useAuth } from "@/hooks/useAuth";

export const useCompanyId = () => {
  const { user } = useAuth();
  
  if (!user?.companyId) {
    console.error("Company ID not found in user context");
    return null;
  }

  return user.companyId;
};