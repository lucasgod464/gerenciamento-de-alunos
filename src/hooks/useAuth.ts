import { useQuery } from "@tanstack/react-query";
import { User, AuthResponse } from "@/types/auth";

export function useAuth() {
  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async (): Promise<AuthResponse | null> => {
      // Aqui você implementaria a lógica para buscar a sessão atual
      const storedSession = localStorage.getItem("session");
      return storedSession ? JSON.parse(storedSession) : null;
    },
  });

  const login = async (email: string, password: string) => {
    // Super Admin
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

    // Verificar emails criados no localStorage
    const createdEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]");
    const foundEmail = createdEmails.find((e: any) => e.email === email);
    
    if (foundEmail && password === "123456") {
      const response: AuthResponse = {
        user: {
          id: foundEmail.id,
          name: foundEmail.name,
          email: foundEmail.email,
          role: foundEmail.accessLevel === "Admin" ? "ADMIN" : "USER",
          companyId: foundEmail.company,
          createdAt: foundEmail.createdAt,
          lastAccess: new Date().toISOString(),
        },
        token: `${foundEmail.accessLevel.toLowerCase()}-token`,
      };
      localStorage.setItem("session", JSON.stringify(response));
      return response;
    }

    throw new Error("Credenciais inválidas");
  };

  const logout = () => {
    localStorage.removeItem("session");
  };

  const isAuthenticated = !!session;
  const user = session?.user;

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}