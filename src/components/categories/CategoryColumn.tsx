import { Room } from "@/types/room";
import { Edit2, Trash2, School, GraduationCap, MoveRight, Tag as TagIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RoomCard } from "./RoomCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryColumnProps {
  category: Category;
  rooms: Room[];
  categories: Category[];
  onEdit: () => void;
  onDelete: () => void;
  onTransferRooms: (roomIds: string[], targetCategoryId: string) => void;
}

export const CategoryColumn = ({ 
  category, 
  rooms, 
  categories,
  onEdit, 
  onDelete,
  onTransferRooms 
}: CategoryColumnProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const getAuthorizedUserNames = (room: Room) => {
    if (!currentUser?.companyId) return "Nenhum usuário vinculado";

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const authorizedUsers = allUsers.filter((user: any) => 
      user.companyId === currentUser.companyId && 
      user.authorizedRooms?.includes(room.id)
    );

    if (authorizedUsers.length === 0) return "Nenhum usuário vinculado";
    return authorizedUsers.map(user => user.name).join(", ");
  };

  const getUserTags = (userName: string) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const allTags = JSON.parse(localStorage.getItem("tags") || "[]");
    
    const user = allUsers.find((u: any) => 
      u.name.toLowerCase() === userName.toLowerCase() && 
      u.companyId === currentUser?.companyId
    );
    
    if (!user?.tags?.length) return [];

    return user.tags
      .map((tagId: string) => allTags.find((tag: any) => tag.id === tagId))
      .filter(Boolean);
  };

  const getTotalStudents = () => {
    return rooms.reduce((total, room) => total + (room.students?.length || 0), 0);
  };

  const getStudentsCount = (room: Room) => {
    return room.students?.length || 0;
  };

  const handleTransferRooms = (targetCategoryId: string) => {
    if (selectedRooms.length === 0) {
      toast({
        title: "Selecione as salas",
        description: "Selecione pelo menos uma sala para transferir.",
        variant: "destructive",
      });
      return;
    }

    onTransferRooms(selectedRooms, targetCategoryId);
    setSelectedRooms([]);
    
    toast({
      title: "Salas transferidas",
      description: "As salas selecionadas foram transferidas com sucesso.",
    });
  };

  const toggleRoomSelection = (roomId: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  return (
    <div className="flex-none w-[350px]">
      <div 
        className="p-4 rounded-lg mb-4 shadow-lg transition-all duration-200 hover:shadow-xl"
        style={{ 
          backgroundColor: category.color || '#f3f4f6',
          opacity: 0.95
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="hover:bg-white/20"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="hover:bg-white/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4 p-3 bg-white/30 rounded-lg">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4" />
            <span className="text-sm font-medium">
              {rooms.length} {rooms.length === 1 ? 'sala' : 'salas'}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm font-medium">
              {getTotalStudents()} {getTotalStudents() === 1 ? 'aluno' : 'alunos'}
            </span>
          </div>
        </div>

        {rooms.length > 0 && (
          <div className="mb-4 p-3 bg-white/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MoveRight className="h-4 w-4" />
              <span className="text-sm font-medium">Transferir salas para:</span>
            </div>
            <Select onValueChange={handleTransferRooms}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter(cat => cat.id !== category.id)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="space-y-3">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white/40 p-3 rounded-lg">
              <RoomCard
                room={room}
                isSelected={selectedRooms.includes(room.id)}
                companyId={currentUser?.companyId || ""}
                onToggleSelection={toggleRoomSelection}
                getAuthorizedUserNames={getAuthorizedUserNames}
                getStudentsCount={getStudentsCount}
              />
              
              {/* Novo bloco para exibir as etiquetas dos usuários */}
              <div className="mt-2 p-2 bg-white/30 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <TagIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Etiquetas dos usuários:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getAuthorizedUserNames(room).split(", ").map((userName) => {
                    const userTags = getUserTags(userName);
                    if (userTags.length === 0) return null;
                    
                    return (
                      <div key={userName} className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">{userName}:</span>
                        <div className="flex gap-1">
                          {userTags.map((tag: any) => (
                            <TooltipProvider key={tag.id}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <TagIcon 
                                    className="h-4 w-4 cursor-help" 
                                    style={{ 
                                      color: tag.color,
                                      fill: tag.color,
                                      fillOpacity: 0.2
                                    }} 
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{tag.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};