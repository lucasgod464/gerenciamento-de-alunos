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
  status: "Ativa" | "Inativa"
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
      status: "Ativa" as const,
    }
    
    onCompanyCreated(newCompany)
    setOpen(false)
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
          <Button type="submit" className="w-full">
            Criar Empresa
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}