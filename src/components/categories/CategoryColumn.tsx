import { Room } from "@/types/room";
import { Edit2, Trash2, School, GraduationCap, MoveRight } from "lucide-react";
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
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getTotalStudents = () => {
    return rooms.reduce((total, room) => total + (room.students?.length || 0), 0);
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

  const handleDeleteConfirm = async () => {
    try {
      await onDelete();
      setIsDeleteDialogOpen(false);
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: "Ocorreu um erro ao excluir a categoria.",
        variant: "destructive",
      });
    }
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
              onClick={() => setIsDeleteDialogOpen(true)}
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
            <RoomCard
              key={room.id}
              room={room}
              companyId={currentUser?.companyId || ""}
              onSelect={() => toggleRoomSelection(room.id)}
              selected={selectedRooms.includes(room.id)}
            />
          ))}
        </div>
      </div>

      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        categoryName={category.name}
      />
    </div>
  );
};