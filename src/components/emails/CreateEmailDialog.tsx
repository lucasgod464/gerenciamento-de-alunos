import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Email } from "@/types/email";
import { supabase } from "@/integrations/supabase/client";
import { EmailFormFields } from "./form/EmailFormFields";
import { CompanySelect } from "./form/CompanySelect";

interface CreateEmailDialogProps {
  onEmailCreated: (email: Email) => void;
}

export function CreateEmailDialog({ onEmailCreated }: CreateEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState<"Admin" | "Usuário Comum">("Usuário Comum");
  const [companyId, setCompanyId] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEmailMutation = useMutation({
    mutationFn: async (newEmail: Omit<Email, "id" | "createdAt" | "updatedAt" | "company">) => {
      const { data, error } = await supabase
        .from("emails")
        .insert([{
          name: newEmail.name,
          email: newEmail.email,
          password: newEmail.password,
          access_level: newEmail.accessLevel,
          company_id: newEmail.companyId,
          status: 'active'
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
      onEmailCreated(data as Email);
      setOpen(false);
      toast({
        title: "Email criado",
        description: "O email foi criado com sucesso.",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar email",
        description: "Ocorreu um erro ao criar o email. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao criar email:", error);
    },
  });

  const generateStrongPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(password);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAccessLevel("Usuário Comum");
    setCompanyId("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createEmailMutation.mutate({
      name,
      email,
      password,
      accessLevel,
      companyId,
    });
  };

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
          <EmailFormFields
            name={name}
            email={email}
            password={password}
            accessLevel={accessLevel}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onAccessLevelChange={setAccessLevel}
            onGeneratePassword={generateStrongPassword}
            showPasswordGenerator={true}
          />
          <CompanySelect
            value={companyId}
            onChange={setCompanyId}
          />
          <Button type="submit" className="w-full">
            Criar Email
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
