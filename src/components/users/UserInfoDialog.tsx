import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Tag, Building2, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserInfoDialogProps {
  user: User | null;
  onClose: () => void;
}

interface Specialization {
  id: string;
  name: string;
}

export function UserInfoDialog({ user, onClose }: UserInfoDialogProps) {
  const [authorizedRooms, setAuthorizedRooms] = useState<{ id: string; name: string; }[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  useEffect(() => {
    if (!user) return;

    // Buscar salas autorizadas
    const fetchAuthorizedRooms = async () => {
      const { data: roomsData, error } = await supabase
        .from('user_rooms')
        .select(`
          rooms (
            id,
            name
          )
        `)
        .eq('user_id', user.id);

      if (!error && roomsData) {
        const rooms = roomsData
          .map(rd => rd.rooms)
          .filter(Boolean);
        setAuthorizedRooms(rooms);
      }
    };

    // Buscar especializações
    const fetchSpecializations = async () => {
      const { data: specsData, error } = await supabase
        .from('user_specializations')
        .select(`
          specializations (
            id,
            name
          )
        `)
        .eq('user_id', user.id);

      if (!error && specsData) {
        const specs = specsData
          .map(sd => sd.specializations)
          .filter(Boolean);
        setSpecializations(specs);
      }
    };

    // Configurar listener para atualizações em tempo real
    const channel = supabase
      .channel('user-info-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_rooms',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchAuthorizedRooms();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_specializations',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchSpecializations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_tags',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // O componente pai já atualiza as tags automaticamente
        }
      )
      .subscribe();

    fetchAuthorizedRooms();
    fetchSpecializations();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Informações do Usuário</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Dados Básicos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p>{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nível de Acesso</p>
                <p>{user.accessLevel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Etiquetas */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Etiquetas
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.tags && user.tags.length > 0 ? (
                user.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    style={{ 
                      backgroundColor: tag.color,
                      color: 'white'
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma etiqueta atribuída</p>
              )}
            </div>
          </div>

          {/* Salas Autorizadas */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Salas Autorizadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {authorizedRooms.length > 0 ? (
                authorizedRooms.map((room) => (
                  <Badge key={room.id} variant="outline">
                    {room.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma sala autorizada</p>
              )}
            </div>
          </div>

          {/* Especializações */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Especializações
            </h3>
            <div className="flex flex-wrap gap-2">
              {specializations.length > 0 ? (
                specializations.map((spec) => (
                  <Badge key={spec.id} variant="secondary">
                    {spec.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma especialização atribuída</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
