import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserWithTags } from "./UserWithTags";
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
      
      const { data: userData, error: userError } = await supabase
        .from('user_rooms')
        .select(`
          user_id,
          emails:user_id (
            id,
            name,
            email
          )
        `)
        .eq('room_id', roomId);

      if (userError) {
        console.error('Error fetching user rooms:', userError);
        throw userError;
      }

      if (userData) {
        const users = userData.map(ur => ({
          id: ur.emails.id,
          name: ur.emails.name,
          email: ur.emails.email,
          is_main_teacher: false
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
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum usuário vinculado</p>
      )}
    </div>
  );
};