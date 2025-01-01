import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { User, AuthResponse, AccessLevel, RolePermissions, ROLE_PERMISSIONS } from "@/types/auth"
import { comparePasswords } from "@/utils/passwordUtils"
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
      console.log("Tentando login para:", email)

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle()

      console.log("Resposta do banco:", { user, error })

      if (error) {
        console.error("Erro no banco:", error)
        throw new Error("Erro ao buscar usuário")
      }

      if (!user) {
        console.error("Usuário não encontrado com email:", email)
        throw new Error("Email ou senha inválidos")
      }

      // Primeiro vamos atualizar a senha do usuário para o novo formato se necessário
      if (!user.password.startsWith('b64_')) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            password: 'b64_' + btoa(password),
            last_access: new Date().toISOString() 
          })
          .eq('id', user.id)

        if (updateError) {
          console.error("Erro atualizando senha:", updateError)
          throw new Error("Erro ao atualizar senha")
        }

        console.log("Senha atualizada para o novo formato")
      }

      // Agora vamos verificar a senha
      const storedPassword = user.password.startsWith('b64_') 
        ? user.password.slice(4) // Remove o prefixo b64_
        : user.password

      const isPasswordValid = btoa(password) === storedPassword
      console.log("Senha válida:", isPasswordValid)

      if (!isPasswordValid) {
        throw new Error("Email ou senha inválidos")
      }

      // Update last_access
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_access: new Date().toISOString() })
        .eq('id', user.id)

      if (updateError) {
        console.error("Erro atualizando último acesso:", updateError)
      }

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

  const can = (permission: keyof RolePermissions) => {
    if (!user) return false
    return ROLE_PERMISSIONS[user.role][permission]
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