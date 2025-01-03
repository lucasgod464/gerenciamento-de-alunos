import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserWithTags } from "./UserWithTags";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  is_main_teacher?: boolean;
}

interface AuthorizedUsersListProps {
  roomId: string;
  companyId: string;
  onRemoveAuthorization: (userId: string) => void;
}

export const AuthorizedUsersList = ({ 
  roomId, 
  companyId,
  onRemoveAuthorization 
}: AuthorizedUsersListProps) => {
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([]);
  const { toast } = useToast();

  const fetchAuthorizedUsers = async () => {
    try {
      console.log('Fetching authorized users for room:', roomId);
      
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
        console.error('Error details:', authorizedError);
        throw authorizedError;
      }

      console.log('Authorized users data:', authorizedData);

      if (authorizedData) {
        const users = authorizedData
          .filter(item => item.users) // Filter out any null users
          .map(item => ({
            id: item.users.id,
            name: item.users.name,
            email: item.users.email,
            is_main_teacher: item.is_main_teacher
          }));
        console.log('Processed users:', users);
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
    fetchAuthorizedUsers();
  }, [roomId]);

  return (
    <div>
      <div className="flex items-center gap-2 text-sm mb-1">
        <span className="font-medium text-xs text-foreground/70">Usuários Vinculados</span>
      </div>
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
                  onRemoveAuthorization(user.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm">Nenhum usuário vinculado</p>
        )}
      </div>
    </div>
  );
};