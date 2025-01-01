import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { User, AuthResponse, AccessLevel, RolePermissions, ROLE_PERMISSIONS } from "@/types/auth"
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
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios")
      }

      console.log("Iniciando processo de login para:", email)

      // Buscar usuário com email exato e status ativo
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('status', 'active')
        .single()

      console.log("Resultado da busca:", { users, userError })

      if (userError) {
        console.error("Erro ao buscar usuário:", userError)
        throw new Error("Email ou senha inválidos")
      }

      if (!users) {
        console.error("Nenhum usuário encontrado com o email:", email)
        throw new Error("Email ou senha inválidos")
      }

      // Verificar senha
      const encodedPassword = btoa(password)
      const storedPassword = users.password.startsWith('b64_') 
        ? users.password.slice(4) 
        : users.password

      console.log("Verificando senha:", {
        senhaCorreta: encodedPassword === storedPassword,
        formatoAntigo: !users.password.startsWith('b64_')
      })

      if (encodedPassword !== storedPassword) {
        console.error("Senha incorreta para o usuário:", email)
        throw new Error("Email ou senha inválidos")
      }

      // Atualizar último acesso e formato da senha se necessário
      const updates: any = {
        last_access: new Date().toISOString(),
      }

      if (!users.password.startsWith('b64_')) {
        updates.password = `b64_${storedPassword}`
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', users.id)

      if (updateError) {
        console.error("Erro ao atualizar último acesso:", updateError)
        // Não vamos falhar o login por causa disso
      }

      const response: AuthResponse = {
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role as AccessLevel,
          companyId: users.company_id,
          createdAt: users.created_at,
          lastAccess: users.last_access,
          profilePicture: users.profile_picture,
        },
        token: `${users.role.toLowerCase()}-token`,
      }

      console.log("Login bem sucedido:", { userId: users.id, role: users.role })
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