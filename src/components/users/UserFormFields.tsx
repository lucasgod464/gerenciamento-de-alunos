import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomSelectionFields } from "./fields/RoomSelectionFields";
import { TagSelectionFields } from "./fields/TagSelectionFields";
import { SpecializationSelectionFields } from "./fields/SpecializationSelectionFields";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export interface UserFormFieldsProps {
  defaultValues?: {
    name?: string;
    email?: string;
    specialization?: string;
    status?: string;
    accessLevel?: string;
    authorizedRooms?: { id: string; name: string; }[];
    address?: string;
    tags?: { id: string; name: string; color: string; }[];
  };
  onTagsChange?: (tags: { id: string; name: string; color: string; }[]) => void;
  onRoomsChange?: (rooms: string[]) => void;
  onSpecializationsChange?: (specializations: string[]) => void;
  isEditing?: boolean;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ 
  defaultValues = {}, 
  onTagsChange,
  onRoomsChange,
  onSpecializationsChange,
  isEditing
}) => {
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>(
    defaultValues.tags || []
  );
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    defaultValues.authorizedRooms?.map(room => room.id) || []
  );
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleTagToggle = (tag: { id: string; name: string; color: string; }) => {
    const newSelectedTags = selectedTags.some(t => t.id === tag.id)
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    onTagsChange?.(newSelectedTags);
  };

  const handleRoomToggle = (roomId: string) => {
    const newSelectedRooms = selectedRooms.includes(roomId)
      ? selectedRooms.filter(id => id !== roomId)
      : [...selectedRooms, roomId];
    
    setSelectedRooms(newSelectedRooms);
    onRoomsChange?.(newSelectedRooms);
  };

  const handleSpecializationToggle = (specializationId: string) => {
    const newSelectedSpecializations = selectedSpecializations.includes(specializationId)
      ? selectedSpecializations.filter(id => id !== specializationId)
      : [...selectedSpecializations, specializationId];
    
    setSelectedSpecializations(newSelectedSpecializations);
    onSpecializationsChange?.(newSelectedSpecializations);
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
        <Label htmlFor="password">
          {isEditing ? "Nova Senha (opcional)" : "Senha"}
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={isEditing ? "Digite para alterar a senha" : "Digite a senha"}
            required={!isEditing}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
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

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          defaultValue={defaultValues.address}
          placeholder="Digite o endereço completo..."
        />
      </div>

      <RoomSelectionFields
        selectedRooms={selectedRooms}
        onRoomToggle={handleRoomToggle}
        defaultValues={defaultValues}
      />

      <TagSelectionFields
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        defaultValues={defaultValues}
      />

      <SpecializationSelectionFields
        selectedSpecializations={selectedSpecializations}
        onSpecializationToggle={handleSpecializationToggle}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default UserFormFields;