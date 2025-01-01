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

      // Primeiro, vamos verificar se o usuário existe, independente do status
      const { data: userCheck, error: checkError } = await supabase
        .from('users')
        .select('status')
        .eq('email', email.toLowerCase())
        .maybeSingle()

      console.log("Verificação inicial do usuário:", { userCheck, checkError })

      if (checkError) {
        console.error("Erro ao verificar usuário:", checkError)
        throw new Error("Erro ao verificar usuário")
      }

      if (!userCheck) {
        console.error("Nenhum usuário encontrado com o email:", email)
        throw new Error("Email ou senha inválidos")
      }

      if (userCheck.status !== 'active') {
        console.error("Usuário não está ativo:", email)
        throw new Error("Usuário inativo")
      }

      // Agora buscar os dados completos do usuário
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('status', 'active')
        .maybeSingle()

      console.log("Resultado da busca completa:", { user, userError })

      if (userError) {
        console.error("Erro ao buscar dados do usuário:", userError)
        throw new Error("Erro ao buscar dados do usuário")
      }

      if (!user) {
        console.error("Dados do usuário não encontrados:", email)
        throw new Error("Email ou senha inválidos")
      }

      // Verificar senha
      const encodedPassword = btoa(password)
      const storedPassword = user.password.startsWith('b64_') 
        ? user.password.slice(4) 
        : user.password

      console.log("Verificando senha:", {
        senhaCorreta: encodedPassword === storedPassword,
        formatoAntigo: !user.password.startsWith('b64_')
      })

      if (encodedPassword !== storedPassword) {
        console.error("Senha incorreta para o usuário:", email)
        throw new Error("Email ou senha inválidos")
      }

      // Atualizar último acesso e formato da senha se necessário
      const updates: any = {
        last_access: new Date().toISOString(),
      }

      if (!user.password.startsWith('b64_')) {
        updates.password = `b64_${storedPassword}`
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (updateError) {
        console.error("Erro ao atualizar último acesso:", updateError)
        // Não vamos falhar o login por causa disso
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

      console.log("Login bem sucedido:", { userId: user.id, role: user.role })
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