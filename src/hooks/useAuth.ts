import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { User, AuthResponse, AccessLevel } from "@/types/auth"
import { supabase } from "@/integrations/supabase/client"

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: session, refetch } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async (): Promise<AuthResponse | null> => {
      const storedSession = localStorage.getItem("session")
      if (!storedSession) return null
      
      try {
        const parsedSession = JSON.parse(storedSession)
        if (!parsedSession?.user?.id || !parsedSession?.token) {
          localStorage.removeItem("session")
          return null
        }
        return parsedSession
      } catch (error) {
        localStorage.removeItem("session")
        return null
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log("🔍 Iniciando processo de login para:", email)

      // 1. Buscar usuário
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('status', 'active')
        .maybeSingle()

      if (userError) {
        console.error("❌ Erro ao buscar usuário:", userError)
        throw new Error("Erro ao buscar usuário")
      }

      if (!user) {
        console.error("❌ Usuário não encontrado:", email)
        throw new Error("Email ou senha inválidos")
      }

      console.log("✅ Usuário encontrado:", { id: user.id, role: user.role })

      // 2. Verificar senha
      const encodedPassword = btoa(password)
      const storedPassword = user.password.startsWith('b64_') 
        ? user.password.slice(4) 
        : user.password

      console.log("🔐 Verificando senha:", {
        fornecida: encodedPassword,
        armazenada: storedPassword
      })

      if (encodedPassword !== storedPassword) {
        console.error("❌ Senha inválida para usuário:", email)
        throw new Error("Email ou senha inválidos")
      }

      console.log("✅ Senha válida")

      // 3. Atualizar último acesso
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_access: new Date().toISOString() })
        .eq('id', user.id)

      if (updateError) {
        console.warn("⚠️ Falha ao atualizar último acesso:", updateError)
      }

      // 4. Criar resposta
      const response: AuthResponse = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as AccessLevel,
          companyId: user.company_id,
          createdAt: user.created_at,
          lastAccess: user.last_access,
          profilePicture: user.profile_picture,
        },
        token: `${user.role.toLowerCase()}-token`,
      }

      console.log("🎉 Login bem-sucedido:", { userId: user.id, role: user.role })
      localStorage.setItem("session", JSON.stringify(response))
      return response
    },
  })

  const login = async (email: string, password: string) => {
    const response = await loginMutation.mutateAsync({ email, password })
    await refetch()
    return response
  }

  const logout = () => {
    localStorage.removeItem("session")
    queryClient.clear()
  }

  const isAuthenticated = !!session?.user?.id && !!session?.token
  const user = session?.user

  const can = (permission: string) => {
    if (!user) return false
    return true
  }

  const isCompanyMember = (companyId: string) => {
    if (!user) return false
    if (user.role === "SUPER_ADMIN") return true
    return user.companyId === companyId
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    can,
    isCompanyMember,
  }
}