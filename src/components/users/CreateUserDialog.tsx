import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserFormFields } from "./UserFormFields";
import { generateStrongPassword } from "@/utils/passwordUtils";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
  companyId: string;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onUserCreated,
  companyId,
}: CreateUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [password, setPassword] = useState(generateStrongPassword());

  const handleCreateUser = async (formData: FormData) => {
    try {
      setLoading(true);

      const { data: emailData, error: emailError } = await supabase
        .from('emails')
        .insert({
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
          access_level: formData.get('accessLevel'),
          company_id: companyId,
          location: formData.get('location'),
          specialization: formData.get('specialization'),
        })
        .select()
        .single();

      if (emailError) throw emailError;

      const selectedTags = JSON.parse(formData.get('tags') as string || '[]');
      
      if (selectedTags.length > 0) {
        const userTagsToInsert = selectedTags.map((tag: { id: string }) => ({
          user_id: emailData.id,
          tag_id: tag.id,
        }));

        const { error: tagsError } = await supabase
          .from('user_tags')
          .insert(userTagsToInsert);

        if (tagsError) throw tagsError;
      }

      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });

      onUserCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
        </DialogHeader>
        <form action={handleCreateUser} className="space-y-4">
          <UserFormFields
            generateStrongPassword={() => {
              const newPassword = generateStrongPassword();
              setPassword(newPassword);
              return newPassword;
            }}
            defaultValues={{
              password,
            }}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar Usuário"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}