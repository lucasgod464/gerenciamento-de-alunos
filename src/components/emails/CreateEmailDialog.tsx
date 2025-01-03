import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmailFormFields } from "./form/EmailFormFields";
import { useToast } from "@/hooks/use-toast";
import { Email, mapSupabaseEmailToEmail } from "@/types/email";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CreateEmailDialogProps {
  onEmailCreated: (email: Email) => void;
}

export function CreateEmailDialog({ onEmailCreated }: CreateEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEmail = useMutation({
    mutationFn: async (newEmail: Omit<Email, "id" | "createdAt" | "updatedAt" | "company">) => {
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
    },
    onError: (error) => {
      console.error('Error creating email:', error);
      toast({
        title: "Erro ao criar",
        description: "Ocorreu um erro ao criar o email.",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        Criar Email
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Email</DialogTitle>
        </DialogHeader>
        <EmailFormFields
          name=""
          email=""
          password=""
          accessLevel="Usuário Comum"
          onNameChange={() => {}}
          onEmailChange={() => {}}
          onPasswordChange={() => {}}
          onAccessLevelChange={() => {}}
          onSubmit={createEmail.mutate}
        />
      </DialogContent>
    </Dialog>
  );
}