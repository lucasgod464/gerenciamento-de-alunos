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
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface CreateCompanyDialogProps {
  onCompanyCreated: (company: any) => void
}

export function CreateCompanyDialog({ onCompanyCreated }: CreateCompanyDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const companyData = {
        name: formData.get("name") as string,
        document: formData.get("document") as string,
        users_limit: Number(formData.get("usersLimit")),
        current_users: 0,
        rooms_limit: Number(formData.get("roomsLimit")),
        current_rooms: 0,
        status: "active",
      }

      const { data: company, error } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single()

      if (error) throw error

      onCompanyCreated(company)
      setOpen(false)
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      })
    } catch (error: any) {
      console.error('Error creating company:', error)
      toast({
        title: "Erro ao criar empresa",
        description: error.message || "Ocorreu um erro ao criar a empresa.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Empresa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Empresa</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar uma nova empresa no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input
              id="name"
              name="name"
              placeholder="Digite o nome da empresa"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document">Documento (CPF/CNPJ)</Label>
            <Input
              id="document"
              name="document"
              placeholder="Digite o CPF ou CNPJ"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usersLimit">Limite de Usuários</Label>
            <Input
              id="usersLimit"
              name="usersLimit"
              type="number"
              min="1"
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomsLimit">Limite de Salas</Label>
            <Input
              id="roomsLimit"
              name="roomsLimit"
              type="number"
              min="1"
              placeholder="0"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Empresa"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}