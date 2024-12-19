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
import { supabase } from "@/integrations/supabase/client"
import { Email } from "@/types/email"

interface CreateEmailDialogProps {
  onEmailCreated: (email: Email) => void
}

export function CreateEmailDialog({ onEmailCreated }: CreateEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const generateStrongPassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const newEmail = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      access_level: formData.get("access_level") as "Admin" | "Usuário Comum",
      company_id: formData.get("company_id") as string,
    }
    
    try {
      const { data, error } = await supabase
        .from("emails")
        .insert([newEmail])
        .select()
        .single()

      if (error) throw error

      // Cast the data to ensure access_level is of the correct type
      const typedData = {
        ...data,
        access_level: data.access_level as "Admin" | "Usuário Comum"
      }

      onEmailCreated(typedData)
      setOpen(false)
      toast({
        title: "Email criado",
        description: "O email foi criado com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao criar email",
        description: error.message,
        variant: "destructive",
      })
    }
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
            <Label htmlFor="access_level">Nível de Acesso</Label>
            <Select name="access_level" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_id">Empresa</Label>
            <Select name="company_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company-1">Empresa Exemplo</SelectItem>
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