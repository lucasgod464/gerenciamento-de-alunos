import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Email } from "@/types/email"
import { supabase } from "@/integrations/supabase/client"

interface CreateEmailDialogProps {
  onEmailCreated: (email: Email) => void
}

export function CreateEmailDialog({ onEmailCreated }: CreateEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Buscar empresas do Supabase
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name")
      
      if (error) throw error
      return data
    },
  })

  // Mutation para criar email
  const createEmailMutation = useMutation({
    mutationFn: async (newEmail: Omit<Email, "id" | "createdAt">) => {
      const { data, error } = await supabase
        .from("emails")
        .insert([{
          name: newEmail.name,
          email: newEmail.email,
          password: newEmail.password,
          access_level: newEmail.accessLevel === "Admin" ? "Admin" : "Usuário Comum",
          company_id: newEmail.company,
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (newEmail) => {
      queryClient.invalidateQueries({ queryKey: ["emails"] })
      onEmailCreated(newEmail)
      setOpen(false)
      toast({
        title: "Email criado",
        description: "O email foi criado com sucesso.",
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar email",
        description: "Ocorreu um erro ao criar o email. Tente novamente.",
        variant: "destructive",
      })
      console.error("Erro ao criar email:", error)
    },
  })

  const generateStrongPassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newEmail = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      accessLevel: formData.get("accessLevel") as "Admin" | "Usuário Comum",
      company: formData.get("company") as string,
    }
    
    createEmailMutation.mutate(newEmail)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Email</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Email</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo email no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              placeholder="Digite o nome completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite o email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Digite a senha"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = document.getElementById("password") as HTMLInputElement
                  input.value = generateStrongPassword()
                }}
              >
                Gerar
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessLevel">Nível de Acesso</Label>
            <Select name="accessLevel" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Administrador</SelectItem>
                <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Select name="company" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-companies" disabled>
                    Nenhuma empresa cadastrada
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Criar Email
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}