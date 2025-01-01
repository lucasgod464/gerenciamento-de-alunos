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

interface Company {
  id: string
  name: string
  document: string
  usersLimit: number
  currentUsers: number
  roomsLimit: number
  currentRooms: number
  status: "Ativa" | "Inativa"
  createdAt: string
  publicFolderPath: string
}

interface CreateCompanyDialogProps {
  onCompanyCreated: (company: Company) => void
}

export function CreateCompanyDialog({ onCompanyCreated }: CreateCompanyDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newCompany = {
      id: crypto.randomUUID(),
      name: formData.get("name") as string,
      document: formData.get("document") as string,
      usersLimit: Number(formData.get("usersLimit")) || 5,
      currentUsers: 0,
      roomsLimit: Number(formData.get("roomsLimit")) || 5,
      currentRooms: 0,
      status: "Ativa" as const,
      createdAt: new Date().toLocaleDateString(),
      publicFolderPath: `/storage/${crypto.randomUUID()}`,
    }
    
    onCompanyCreated(newCompany)
    setOpen(false)
    toast({
      title: "Empresa criada",
      description: "A empresa foi criada com sucesso.",
    })
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
          <Button type="submit" className="w-full">
            Criar Empresa
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}