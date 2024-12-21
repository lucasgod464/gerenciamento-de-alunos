import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Room {
  id: string;
  name: string;
  companyId: string;
  status: boolean;
}

interface RoomSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const RoomSelect = ({ value, onChange, required = false }: RoomSelectProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    const loadAuthorizedRooms = () => {
      // Carregar todos os usuários para obter as salas autorizadas
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const currentUserData = users.find((u: any) => 
        u.id === currentUser.id || u.email === currentUser.email
      );

      // Carregar todas as salas
      const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
      
      // Filtrar salas da empresa que estão ativas
      const companyRooms = allRooms.filter((room: Room) => 
        room.companyId === currentUser.companyId && 
        room.status === true
      );

      // Se o usuário tem salas autorizadas, mostrar apenas essas
      if (currentUserData?.authorizedRooms?.length) {
        const authorizedRooms = companyRooms.filter((room: Room) =>
          currentUserData.authorizedRooms.includes(room.id)
        );
        setRooms(authorizedRooms);
        
        // Se não há valor selecionado e existem salas autorizadas, seleciona a primeira
        if (!value && authorizedRooms.length > 0) {
          onChange(authorizedRooms[0].id);
        }
      } else {
        setRooms([]);
      }
    };

    loadAuthorizedRooms();
  }, [currentUser, value, onChange]);

  const handleRoomToggle = (roomId: string) => {
    const updatedRooms = selectedRooms.includes(roomId)
      ? selectedRooms.filter(id => id !== roomId)
      : [...selectedRooms, roomId];
    
    setSelectedRooms(updatedRooms);
    // Atualiza o valor com a primeira sala selecionada (para manter compatibilidade)
    onChange(updatedRooms[0] || "");
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Salas Autorizadas</Label>
        <Input
          type="text"
          placeholder="Buscar salas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
      </div>
      <div className="space-y-2 border rounded-md p-4 max-h-[200px] overflow-y-auto">
        {filteredRooms.map((room) => (
          <div key={room.id} className="flex items-center space-x-2">
            <Checkbox
              id={room.id}
              checked={selectedRooms.includes(room.id)}
              onCheckedChange={() => handleRoomToggle(room.id)}
            />
            <Label htmlFor={room.id} className="cursor-pointer">
              {room.name}
            </Label>
          </div>
        ))}
        {filteredRooms.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            {searchTerm ? "Nenhuma sala encontrada" : "Nenhuma sala disponível"}
          </p>
        )}
      </div>
      {required && selectedRooms.length === 0 && (
        <p className="text-sm text-destructive">
          Selecione pelo menos uma sala
        </p>
      )}
    </div>
  );
};