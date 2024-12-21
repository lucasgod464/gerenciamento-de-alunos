import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySelect } from "./CategorySelect";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface UserFormFieldsProps {
  generateStrongPassword?: () => void;
  defaultValues?: {
    specialization?: string;
    authorizedRooms?: string[];
  };
  onAuthorizedRoomsChange?: (roomIds: string[]) => void;
}

interface Room {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

interface Specialization {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

export const UserFormFields = ({ 
  generateStrongPassword, 
  defaultValues,
  onAuthorizedRoomsChange 
}: UserFormFieldsProps) => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(defaultValues?.authorizedRooms || []);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    // Carregar especializações
    const allSpecializations = JSON.parse(localStorage.getItem("specializations") || "[]");
    const companySpecializations = allSpecializations.filter(
      (spec: Specialization) => spec.companyId === currentUser.companyId && spec.status
    );
    setSpecializations(companySpecializations);

    // Carregar salas
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter(
      (room: Room) => room.companyId === currentUser.companyId && room.status
    );
    setRooms(companyRooms);
  }, [currentUser]);

  const handleRoomToggle = (roomId: string) => {
    const updatedRooms = selectedRooms.includes(roomId)
      ? selectedRooms.filter(id => id !== roomId)
      : [...selectedRooms, roomId];
    
    setSelectedRooms(updatedRooms);
    onAuthorizedRoomsChange?.(updatedRooms);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          placeholder="Digite o nome completo"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Digite o email"
          required
        />
      </div>
      {generateStrongPassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="flex gap-2">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Digite a senha"
              required
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateStrongPassword}
            >
              Gerar
            </Button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="responsibleCategory">Categoria Responsável</Label>
        <CategorySelect
          value=""
          onChange={() => {}}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          name="location"
          placeholder="Digite o local"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialization">Especialização</Label>
        <Select name="specialization" defaultValue={defaultValues?.specialization}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a especialização" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec.id} value={spec.id}>
                {spec.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Salas Autorizadas</Label>
        <div className="grid gap-2">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`room-${room.id}`}
                checked={selectedRooms.includes(room.id)}
                onChange={() => handleRoomToggle(room.id)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor={`room-${room.id}`}>{room.name}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue="active">
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};