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
import { Company } from "@/types/company"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useCompanies } from "@/hooks/useCompanies";

interface CreateCompanyDialogProps {
  onCompanyCreated: (company: Omit<Company, "id" | "createdAt">) => void
}

export function CreateCompanyDialog({ onCompanyCreated }: CreateCompanyDialogProps) {
  const { companies } = useCompanies();
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(event.currentTarget)
      
      const newCompany = {
        name: formData.get("name") as string,
        document: formData.get("document") as string || "",
        users_limit: Number(formData.get("usersLimit")) || 5,
        current_users: 0,
        rooms_limit: Number(formData.get("roomsLimit")) || 5,
        current_rooms: 0,
        status: "Ativa" as const,
        public_folder_path: `/storage/${Math.random().toString(36).substr(2, 9)}`,
        storage_used: 0,
      }

      console.log("Tentando criar empresa:", newCompany)
      
      // Inserir no Supabase
      const { data, error } = await supabase
        .from('companies')
        .insert([newCompany])
        .select()
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        throw new Error("Não foi possível criar a empresa")
      }

      console.log("Empresa criada com sucesso:", data)
      
      await onCompanyCreated(newCompany)
      setOpen(false)
      toast({
        title: "Empresa criada com sucesso",
        description: `A empresa ${newCompany.name} foi criada.`,
      })
    } catch (error) {
      console.error("Erro ao criar empresa:", error)
      toast({
        title: "Erro ao criar empresa",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar a empresa",
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
              placeholder="Digite o CPF ou CNPJ (opcional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usersLimit">Limite de Usuários</Label>
            <Input
              id="usersLimit"
              name="usersLimit"
              type="number"
              min="1"
              placeholder="5"
              defaultValue="5"
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
              placeholder="5"
              defaultValue="5"
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
