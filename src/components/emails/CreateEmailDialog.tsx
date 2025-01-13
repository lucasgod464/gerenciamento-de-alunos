import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmailFormFields } from "./form/EmailFormFields";
import { useToast } from "@/hooks/use-toast";
import { Email, mapSupabaseEmailToEmail } from "@/types/email";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanySelect } from "./form/CompanySelect";
import { useCompanies } from "@/hooks/useCompanies";

interface CreateEmailDialogProps {
  onEmailCreated: (email: Email) => void;
}

export function CreateEmailDialog({ onEmailCreated }: CreateEmailDialogProps) {
  const { companies } = useCompanies();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState<"Admin" | "Usuário Comum">("Usuário Comum");
  const [companyId, setCompanyId] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEmail = useMutation({
    mutationFn: async (newEmail: Omit<Email, "id" | "createdAt" | "updatedAt" | "company">) => {
      const company = companies.find(c => c.id === newEmail.companyId);
      if (company && company.currentUsers >= company.usersLimit) {
        throw new Error("Limite de usuários atingido para esta empresa.");
      }

      const { data, error } = await supabase
        .from('emails')
        .insert([{
          name: newEmail.name,
          email: newEmail.email,
          password: newEmail.password,
          access_level: newEmail.accessLevel,
          company_id: newEmail.companyId,
          status: newEmail.status || 'active'
        }])
        .select(`
          *,
          companies (
            id,
            name,
            status
          )
        `)
        .single();

      if (error) throw error;
      return mapSupabaseEmailToEmail(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      onEmailCreated(data);
      setOpen(false);
      toast({
        title: "Email criado",
        description: "O email foi criado com sucesso.",
      });
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error creating email:', error);
      toast({
        title: "Erro ao criar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAccessLevel("Usuário Comum");
    setCompanyId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      toast({
        title: "Erro ao criar",
        description: "Selecione uma empresa.",
        variant: "destructive",
      });
      return;
    }

    createEmail.mutate({
      name,
      email,
      password,
      accessLevel,
      companyId,
      status: "active",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        Criar Email
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailFormFields
            name={name}
            email={email}
            password={password}
            accessLevel={accessLevel}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onAccessLevelChange={setAccessLevel}
          />
          <CompanySelect
            value={companyId}
            onChange={setCompanyId}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
