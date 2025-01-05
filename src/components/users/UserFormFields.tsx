import React, { useState, useEffect } from 'react';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UserFormFieldsProps {
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
    specializations?: { id: string; name: string; }[];
  };
  onTagsChange?: (tags: { id: string; name: string; color: string; }[]) => void;
  onRoomsChange?: (rooms: string[]) => void;
  onSpecializationsChange?: (specializations: { id: string; name: string; }[]) => void;
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
  const [selectedSpecializations, setSelectedSpecializations] = useState<{ id: string; name: string; }[]>(
    defaultValues.specializations || []
  );
  const [specializations, setSpecializations] = useState<{ id: string; name: string; }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchSpecializations = async () => {
      if (!currentUser?.companyId) return;

      const { data, error } = await supabase
        .from('specializations')
        .select('id, name')
        .eq('company_id', currentUser.companyId)
        .eq('status', true)
        .order('name');

      if (error) {
        console.error('Erro ao buscar especializações:', error);
        return;
      }

      setSpecializations(data || []);
    };

    fetchSpecializations();
  }, [currentUser?.companyId]);

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
    const newSelectedRooms = selectedRooms.includes(roomId)
      ? selectedRooms.filter(id => id !== roomId)
      : [...selectedRooms, roomId];
    
    setSelectedRooms(newSelectedRooms);
    onRoomsChange?.(newSelectedRooms);
  };

  const handleSpecializationToggle = (specialization: { id: string; name: string; }) => {
    const newSelectedSpecializations = selectedSpecializations.some(s => s.id === specialization.id)
      ? selectedSpecializations.filter(s => s.id !== specialization.id)
      : [...selectedSpecializations, specialization];
    
    setSelectedSpecializations(newSelectedSpecializations);
    onSpecializationsChange?.(newSelectedSpecializations);
  };

  const filteredSpecializations = specializations.filter(spec =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Label>Especializações</Label>
        <Input
          placeholder="Buscar especializações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {filteredSpecializations.map((spec) => (
              <div key={spec.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`spec-${spec.id}`}
                  checked={selectedSpecializations.some(s => s.id === spec.id)}
                  onCheckedChange={() => handleSpecializationToggle(spec)}
                />
                <label
                  htmlFor={`spec-${spec.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {spec.name}
                </label>
              </div>
            ))}
            {filteredSpecializations.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Nenhuma especialização encontrada" : "Nenhuma especialização disponível"}
              </p>
            )}
          </div>
        </ScrollArea>
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