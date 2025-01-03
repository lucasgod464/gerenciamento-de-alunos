import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Email, mapSupabaseEmailToEmail } from "@/types/email";
import { supabase } from "@/integrations/supabase/client";
import { EmailFormFields } from "./form/EmailFormFields";
import { CompanySelect } from "./form/CompanySelect";

interface EditEmailDialogProps {
  email: Email | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailUpdated: (email: Email) => void;
}

export function EditEmailDialog({
  email,
  open,
  onOpenChange,
  onEmailUpdated,
}: EditEmailDialogProps) {
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState<"Admin" | "Usuário Comum">("Usuário Comum");
  const [companyId, setCompanyId] = useState("");
  const [status, setStatus] = useState<string>("active");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (email) {
      setName(email.name);
      setEmailAddress(email.email);
      setPassword("");
      setAccessLevel(email.accessLevel);
      setCompanyId(email.companyId);
      setStatus(email.status || "active");
    }
  }, [email]);

  const updateEmailMutation = useMutation({
    mutationFn: async (updatedEmail: Partial<Email>) => {
      if (!email?.id) {
        throw new Error("Email ID is required for update");
      }

      const updateData: any = {
        name: updatedEmail.name,
        email: updatedEmail.email,
        access_level: updatedEmail.accessLevel,
        company_id: updatedEmail.companyId,
        status: updatedEmail.status || 'active'
      };

      if (password) {
        updateData.password = password;
      }

      const { data, error } = await supabase
        .from("emails")
        .update(updateData)
        .eq("id", email.id)
        .select(`
          *,
          companies (
            id,
            name,
            status
          )
        `)
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from update");
      }

      return mapSupabaseEmailToEmail(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      onEmailUpdated(data);
      onOpenChange(false);
      toast({
        title: "Email atualizado",
        description: "O email foi atualizado com sucesso.",
      });
      resetForm();
    },
    onError: (error) => {
      console.error("Error updating email:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao tentar atualizar o email.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setName("");
    setEmailAddress("");
    setPassword("");
    setAccessLevel("Usuário Comum");
    setCompanyId("");
    setStatus("active");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!email?.id) {
      toast({
        title: "Erro ao atualizar",
        description: "ID do email não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (!companyId) {
      toast({
        title: "Erro ao atualizar",
        description: "Selecione uma empresa.",
        variant: "destructive",
      });
      return;
    }

    updateEmailMutation.mutate({
      name,
      email: emailAddress,
      password,
      accessLevel,
      companyId,
      status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailFormFields
            name={name}
            email={emailAddress}
            password={password}
            accessLevel={accessLevel}
            onNameChange={setName}
            onEmailChange={setEmailAddress}
            onPasswordChange={setPassword}
            onAccessLevelChange={setAccessLevel}
          />
          <CompanySelect
            value={companyId}
            onChange={setCompanyId}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}