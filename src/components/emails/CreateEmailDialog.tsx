import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Email, mapSupabaseEmailToEmail, SupabaseEmail, DatabaseAccessLevel } from "@/types/email"
import { supabase } from "@/integrations/supabase/client"
import { EmailForm } from "./EmailForm"

interface CreateEmailDialogProps {
  onEmailCreated: (email: Email) => void;
}

export function CreateEmailDialog({ onEmailCreated }: CreateEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name")
      
      if (error) throw error;
      return data;
    },
  });

  const createEmailMutation = useMutation({
    mutationFn: async (newEmail: { 
      name: string;
      email: string;
      password: string;
      accessLevel: DatabaseAccessLevel;
      companyId: string;
    }) => {
      const { data, error } = await supabase
        .from("emails")
        .insert([{
          name: newEmail.name,
          email: newEmail.email,
          password: newEmail.password,
          access_level: newEmail.accessLevel,
          company_id: newEmail.companyId,
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
      return mapSupabaseEmailToEmail(data as SupabaseEmail);
    },
    onSuccess: (newEmail) => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      onEmailCreated(newEmail);
      setOpen(false);
      toast({
        title: "Email criado",
        description: "O email foi criado com sucesso.",
      });
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
    return password;
  };

  const handleSubmit = (formData: FormData) => {
    const newEmail = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      accessLevel: formData.get("accessLevel") as DatabaseAccessLevel,
      companyId: formData.get("company") as string,
    };
    
    createEmailMutation.mutate(newEmail);
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
        <EmailForm 
          onSubmit={handleSubmit}
          companies={companies}
          generateStrongPassword={generateStrongPassword}
        />
      </DialogContent>
    </Dialog>
  );
}