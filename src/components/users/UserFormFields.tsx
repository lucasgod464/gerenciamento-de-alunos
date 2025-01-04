import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { AccessLevel } from "@/types/user";
import { RoomSelectionFields } from "./fields/RoomSelectionFields";
import { TagSelectionFields } from "./fields/TagSelectionFields";

interface UserFormFieldsProps {
  defaultValues?: {
    name?: string;
    email?: string;
    specialization?: string;
    location?: string;
    status?: string;
    tags?: { id: string; name: string; color: string; }[];
    accessLevel?: AccessLevel;
    authorizedRooms?: { id: string; name: string; }[];
    address?: string;
  };
  onTagsChange?: (tags: { id: string; name: string; color: string; }[]) => void;
  onRoomsChange?: (rooms: string[]) => void;
  isEditing?: boolean;
}

const UserFormFields = ({ 
  defaultValues = {}, 
  onTagsChange,
  onRoomsChange,
  isEditing
}: UserFormFieldsProps) => {
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>(
    defaultValues.tags || []
  );
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    defaultValues.authorizedRooms?.map(room => room.id) || []
  );

  // Initialize selected rooms when defaultValues change
  useEffect(() => {
    if (defaultValues.authorizedRooms) {
      const roomIds = defaultValues.authorizedRooms.map(room => room.id);
      setSelectedRooms(roomIds);
      onRoomsChange?.(roomIds);
    }
  }, [defaultValues.authorizedRooms]);

  const handleTagToggle = (tag: { id: string; name: string; color: string; }) => {
    const newSelectedTags = selectedTags.some(t => t.id === tag.id)
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    onTagsChange?.(newSelectedTags);
  };

  const handleRoomToggle = (roomId: string) => {
    console.log('Room toggle called with:', roomId);
    console.log('Current selectedRooms:', selectedRooms);
    
    const newSelectedRooms = selectedRooms.includes(roomId)
      ? selectedRooms.filter(id => id !== roomId)
      : [...selectedRooms, roomId];
    
    console.log('New selectedRooms:', newSelectedRooms);
    setSelectedRooms(newSelectedRooms);
    onRoomsChange?.(newSelectedRooms);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultValues.email}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="location"
            name="location"
            defaultValue={defaultValues.location}
            className="pl-9"
            placeholder="Digite o local..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          defaultValue={defaultValues.address}
          placeholder="Digite o endereço completo..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Especialização</Label>
        <Input
          id="specialization"
          name="specialization"
          defaultValue={defaultValues.specialization}
          placeholder="Digite a especialização..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessLevel">Nível de Acesso</Label>
        <Select name="accessLevel" defaultValue={defaultValues.accessLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o nível de acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={defaultValues.status || 'active'}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TagSelectionFields
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        defaultValues={defaultValues}
      />

      <RoomSelectionFields
        selectedRooms={selectedRooms}
        onRoomToggle={handleRoomToggle}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default UserFormFields;