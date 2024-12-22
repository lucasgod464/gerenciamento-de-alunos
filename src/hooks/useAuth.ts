import { useQuery } from "@tanstack/react-query";
import { User, AuthResponse, ROLE_PERMISSIONS } from "@/types/auth";

export function useAuth() {
  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async (): Promise<AuthResponse | null> => {
      const storedSession = localStorage.getItem("session");
      return storedSession ? JSON.parse(storedSession) : null;
    },
    staleTime: Infinity, // Prevent automatic refetching
    gcTime: Infinity, // Keep the data cached indefinitely (formerly cacheTime)
  });

  const login = async (email: string, password: string) => {
    console.log("Attempting login for:", email);

    // Super Admin login
    if (email === "super@teste.com" && password === "123456") {
      const response: AuthResponse = {
        user: {
          id: "super-1",
          name: "Super Admin",
          email: "super@teste.com",
          role: "SUPER_ADMIN",
          companyId: null,
          createdAt: new Date().toISOString(),
          lastAccess: new Date().toISOString(),
        },
        token: "super-admin-token",
      };
      localStorage.setItem("session", JSON.stringify(response));
      return response;
    }

    // Check created emails in localStorage
    const createdEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]");
    console.log("Created emails:", createdEmails);
    const foundEmail = createdEmails.find((e: any) => e.email.toLowerCase() === email.toLowerCase());
    
    // Check users created by admin
    const createdUsers = JSON.parse(localStorage.getItem("users") || "[]");
    console.log("Created users:", createdUsers);
    const foundUser = createdUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    // Login for emails created by super admin
    if (foundEmail && password === "123456") {
      console.log("Found email in createdEmails:", foundEmail);

      // Normalize accessLevel to correct format
      let role = foundEmail.accessLevel.toUpperCase();
      if (role.includes("ADMIN") || role.includes("ADMINISTRADOR")) {
        role = "ADMIN";
      } else if (role.includes("USER") || role.includes("USUÁRIO")) {
        role = "USER";
      }

      const response: AuthResponse = {
        user: {
          id: foundEmail.id,
          name: foundEmail.name,
          email: foundEmail.email,
          role: role,
          companyId: foundEmail.company,
          createdAt: foundEmail.createdAt,
          lastAccess: new Date().toISOString(),
        },
        token: `${role.toLowerCase()}-token`,
      };
      
      console.log("Login response for createdEmail:", response);
      localStorage.setItem("session", JSON.stringify(response));
      return response;
    }

    // Login for users created by admin
    if (foundUser && password === "123456") {
      console.log("Found user in users:", foundUser);
      const response: AuthResponse = {
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: "USER",
          companyId: foundUser.companyId,
          createdAt: foundUser.createdAt,
          lastAccess: new Date().toISOString(),
        },
        token: "user-token",
      };
      console.log("Login response for user:", response);
      localStorage.setItem("session", JSON.stringify(response));
      return response;
    }

    console.log("Login failed - Invalid credentials");
    throw new Error("Invalid credentials");
  };

  const logout = () => {
    localStorage.removeItem("session");
  };

  const isAuthenticated = !!session;
  const user = session?.user;

  const can = (permission: keyof typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS]) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role][permission];
  };

  const isCompanyMember = (companyId: string) => {
    if (!user) return false;
    if (user.role === "SUPER_ADMIN") return true;
    return user.companyId === companyId;
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    can,
    isCompanyMember,
  };
}