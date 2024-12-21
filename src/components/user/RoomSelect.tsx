import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  return (
    <Select value={value} onValueChange={onChange} required={required}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione a sala" />
      </SelectTrigger>
      <SelectContent>
        {rooms.map((room) => (
          <SelectItem key={room.id} value={room.id}>
            {room.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};