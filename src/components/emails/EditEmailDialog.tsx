import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Email } from "@/types/email"
import { Eye, EyeOff } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

export function EditEmailDialog({ email, open, onOpenChange, onEmailUpdated }: EditEmailDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Email | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (email) {
      setFormData(email);
      setNewPassword("");
    }
  }, [email]);

  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name")
      
      if (error) throw error
      return data
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: async (updatedEmail: Email) => {
      const company = companies.find(c => c.name === updatedEmail.company);
      if (!company) throw new Error("Company not found");

      const updateData: any = {
        name: updatedEmail.name,
        email: updatedEmail.email,
        access_level: updatedEmail.accessLevel,
        company_id: company.id,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      const { data, error } = await supabase
        .from("emails")
        .update(updateData)
        .eq("id", updatedEmail.id)
        .select(`
          *,
          companies (
            name,
            status
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      const updatedEmail: Email = {
        id: data.id,
        name: data.name,
        email: data.email,
        accessLevel: data.access_level,
        company: data.companies.name,
        companyId: data.company_id,
        companyStatus: data.companies.status,
        createdAt: new Date(data.created_at).toLocaleDateString(),
      };
      onEmailUpdated(updatedEmail);
      onOpenChange(false);
      toast({
        title: "Email atualizado",
        description: "As informações do email foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error updating email:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao tentar atualizar o email.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData) return

    updateEmailMutation.mutate(formData)
  }

  if (!formData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Email</DialogTitle>
          <DialogDescription>
            Atualize as informações do email no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha (opcional)</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha se desejar alterá-la"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessLevel">Nível de Acesso</Label>
            <Select
              value={formData.accessLevel}
              onValueChange={(value) => setFormData({ ...formData, accessLevel: value as "Admin" | "Usuário Comum" })}
            >
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
            <Select
              value={formData.company}
              onValueChange={(value) => setFormData({ ...formData, company: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company: { id: string; name: string }) => (
                  <SelectItem key={company.id} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Salvar Alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
