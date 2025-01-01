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
      console.log("Starting login process for:", email)

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('status', 'active')
        .maybeSingle()

      if (error) {
        console.error("Database error:", error)
        throw new Error("Error fetching user")
      }

      if (!user) {
        console.error("User not found:", email)
        throw new Error("Invalid email or password")
      }

      console.log("User found:", { id: user.id, role: user.role })

      // Check password (base64 encoded)
      const encodedPassword = btoa(password)
      const storedPassword = user.password.startsWith('b64_') 
        ? user.password.slice(4) 
        : user.password

      if (encodedPassword !== storedPassword) {
        console.error("Invalid password for user:", email)
        throw new Error("Invalid email or password")
      }

      // Update last access
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_access: new Date().toISOString() })
        .eq('id', user.id)

      if (updateError) {
        console.warn("Failed to update last access:", updateError)
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

      console.log("Login successful:", { userId: user.id, role: user.role })
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