import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface UserFormFieldsProps {
  onTagsChange: Dispatch<SetStateAction<{ id: string; name: string; color: string; }[]>>;
  onRoomsChange: Dispatch<SetStateAction<string[]>>;
  generateStrongPassword?: () => string;
  defaultValues?: {
    name?: string;
    email?: string;
    accessLevel?: string;
    location?: string;
    specialization?: string;
    status?: string;
    address?: string;
    authorizedRooms?: { id: string; name: string; }[];
  };
}

export default function UserFormFields({ 
  onTagsChange, 
  onRoomsChange, 
  generateStrongPassword,
  defaultValues 
}: UserFormFieldsProps) {
  const [tags, setTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string; }[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [searchTagTerm, setSearchTagTerm] = useState("");
  const [searchRoomTerm, setSearchRoomTerm] = useState("");
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.companyId) return;

      try {
        // Fetch tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('tags')
          .select('*')
          .eq('company_id', currentUser.companyId)
          .eq('status', true);

        if (tagsError) throw tagsError;
        setTags(tagsData || []);

        // Fetch rooms
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('id, name')
          .eq('company_id', currentUser.companyId)
          .eq('status', true);

        if (roomsError) throw roomsError;
        setRooms(roomsData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar os dados",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [currentUser?.companyId]);

  useEffect(() => {
    if (defaultValues?.authorizedRooms) {
      const roomIds = defaultValues.authorizedRooms.map(room => room.id);
      setSelectedRooms(roomIds);
      onRoomsChange(roomIds);
    }
  }, [defaultValues?.authorizedRooms]);

  const handleTagToggle = (tag: { id: string; name: string; color: string; }) => {
    setSelectedTags(prev => {
      const newTags = prev.some(t => t.id === tag.id)
        ? prev.filter(t => t.id !== tag.id)
        : [...prev, tag];
      onTagsChange(newTags);
      return newTags;
    });
  };

  const handleRoomToggle = (roomId: string) => {
    setSelectedRooms(prev => {
      const newRooms = prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId];
      onRoomsChange(newRooms);
      return newRooms;
    });
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTagTerm.toLowerCase())
  );

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchRoomTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nome do usuário"
            defaultValue={defaultValues?.name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@exemplo.com"
            defaultValue={defaultValues?.email}
          />
        </div>
      </div>

      {generateStrongPassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="flex gap-2">
            <Input
              id="password"
              name="password"
              type="text"
              placeholder="Senha"
              defaultValue={generateStrongPassword()}
              readOnly
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const passwordInput = document.getElementById('password') as HTMLInputElement;
                if (passwordInput) {
                  passwordInput.value = generateStrongPassword();
                }
              }}
            >
              Gerar Nova
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="accessLevel">Nível de Acesso</Label>
          <Select name="accessLevel" defaultValue={defaultValues?.accessLevel || "Usuário Comum"}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível de acesso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Administrador</SelectItem>
              <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={defaultValues?.status || "active"}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            name="location"
            placeholder="Localização"
            defaultValue={defaultValues?.location}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialization">Especialização</Label>
          <Input
            id="specialization"
            name="specialization"
            placeholder="Especialização"
            defaultValue={defaultValues?.specialization}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          placeholder="Endereço"
          defaultValue={defaultValues?.address}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Tags</Label>
          <Card>
            <CardContent className="p-3 space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tags..."
                  value={searchTagTerm}
                  onChange={(e) => setSearchTagTerm(e.target.value)}
                  className="pl-8 bg-background"
                />
              </div>
              <ScrollArea className="h-[120px]">
                <div className="space-y-2 pr-2">
                  {filteredTags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded-md cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedTags.some(t => t.id === tag.id)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Label>Salas Autorizadas</Label>
          <Card>
            <CardContent className="p-3 space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar salas..."
                  value={searchRoomTerm}
                  onChange={(e) => setSearchRoomTerm(e.target.value)}
                  className="pl-8 bg-background"
                />
              </div>
              <ScrollArea className="h-[120px]">
                <div className="space-y-2 pr-2">
                  {filteredRooms.map((room) => (
                    <label
                      key={room.id}
                      className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded-md cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedRooms.includes(room.id)}
                        onCheckedChange={() => handleRoomToggle(room.id)}
                      />
                      <span>{room.name}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}