import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserWithTags } from "./UserWithTags";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthorizedUsersListProps {
  roomId: string;
  companyId: string;
}

interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  is_main_teacher?: boolean;
}

export const AuthorizedUsersList = ({ roomId, companyId }: AuthorizedUsersListProps) => {
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([]);
  const { toast } = useToast();

  const fetchAuthorizedUsers = async () => {
    try {
      console.log('Fetching authorized users for room:', roomId);
      
      // Busca os usuários autorizados com join na tabela users
      const { data: authorizedData, error: authorizedError } = await supabase
        .from('room_authorized_users')
        .select(`
          user_id,
          is_main_teacher,
          users (
            id,
            name,
            email
          )
        `)
        .eq('room_id', roomId);

      if (authorizedError) {
        console.error('Error fetching authorized users:', authorizedError);
        throw authorizedError;
      }

      console.log('Raw authorized users data:', authorizedData);

      if (authorizedData) {
        const users = authorizedData
          .filter(item => item.users) // Remove any null users
          .map(item => ({
            id: item.users.id,
            name: item.users.name,
            email: item.users.email,
            is_main_teacher: item.is_main_teacher
          }));
        
        console.log('Processed authorized users:', users);
        setAuthorizedUsers(users);
      }
    } catch (error) {
      console.error('Error fetching authorized users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar os usuários vinculados.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchAuthorizedUsers();
    }
  }, [roomId]);

  const handleRemoveAuthorization = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('room_authorized_users')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Autorização removida",
        description: "O usuário foi desvinculado da sala com sucesso.",
      });

      fetchAuthorizedUsers();
    } catch (error) {
      console.error('Error removing authorization:', error);
      toast({
        title: "Erro ao remover autorização",
        description: "Ocorreu um erro ao desvincular o usuário da sala.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pl-6 space-y-1">
      {authorizedUsers.length > 0 ? (
        authorizedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <UserWithTags 
                userName={user.name} 
                companyId={companyId} 
              />
              {user.is_main_teacher && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Professor Responsável
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveAuthorization(user.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum usuário vinculado</p>
      )}
    </div>
  );
};