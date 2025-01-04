import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserFormFields from "./UserFormFields";
import { generateStrongPassword } from "@/utils/passwordUtils";
import { User } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";

interface CreateUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [password, setPassword] = useState(generateStrongPassword());
  const { user: currentUser } = useAuth();

  const handleCreateUser = async (formData: FormData) => {
    try {
      setLoading(true);

      const userData = {
        name: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        password: formData.get('password')?.toString() || '',
        access_level: formData.get('accessLevel')?.toString() as "Admin" | "Usuário Comum",
        company_id: currentUser?.companyId || '',
        location: formData.get('location')?.toString() || '',
        specialization: formData.get('specialization')?.toString() || '',
        status: 'active',
        address: formData.get('address')?.toString() || ''
      };

      const { data: emailData, error: emailError } = await supabase
        .from('emails')
        .insert(userData)
        .select()
        .single();

      if (emailError) throw emailError;

      const selectedTags = JSON.parse(formData.get('tags')?.toString() || '[]');
      
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

      const mappedUser: User = {
        id: emailData.id,
        name: emailData.name,
        email: emailData.email,
        role: emailData.access_level,
        companyId: emailData.company_id,
        location: emailData.location,
        specialization: emailData.specialization,
        createdAt: emailData.created_at,
        lastAccess: null,
        status: emailData.status,
        accessLevel: emailData.access_level,
        address: emailData.address,
        tags: selectedTags
      };

      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
      });

      onUserCreated(mappedUser);
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Adicionar Usuário</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreateUser(new FormData(e.currentTarget));
        }} className="space-y-4">
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