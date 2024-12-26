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

interface Company {
  id: string
  name: string
}

interface CreateEmailDialogProps {
  onEmailCreated: (email: any) => void
}

export function CreateEmailDialog({ onEmailCreated }: CreateEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Buscar empresas do localStorage
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: () => {
      const storedCompanies = localStorage.getItem("companies")
      return storedCompanies ? JSON.parse(storedCompanies) : []
    },
  })

  // Mutation para criar email
  const createEmailMutation = useMutation({
    mutationFn: (newEmail: any) => {
      const currentEmails = JSON.parse(localStorage.getItem("createdEmails") || "[]")
      const updatedEmails = [...currentEmails, newEmail]
      localStorage.setItem("createdEmails", JSON.stringify(updatedEmails))
      return newEmail
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
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      accessLevel: formData.get("accessLevel") as "Administrador" | "Usuário Comum",
      company: formData.get("company") as string,
      createdAt: new Date().toLocaleDateString(),
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
                <SelectItem value="Administrador">Administrador</SelectItem>
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
                  companies.map((company: Company) => (
                    <SelectItem key={company.id} value={company.name}>
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