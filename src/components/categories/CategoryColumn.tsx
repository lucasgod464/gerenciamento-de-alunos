import { Room } from "@/types/room";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RoomCard } from "./RoomCard";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { CategoryHeader } from "./CategoryHeader";
import { CategoryStats } from "./CategoryStats";
import { TransferInterface } from "./TransferInterface";

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
  const { toast } = useToast();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTransferMode, setIsTransferMode] = useState(false);

  const handleTransferRooms = (targetCategoryId: string) => {
    onTransferRooms(selectedRooms, targetCategoryId);
    setSelectedRooms([]);
    setIsTransferMode(false);
    
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

  const toggleAllRooms = () => {
    if (selectedRooms.length === rooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(rooms.map(room => room.id));
    }
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
        <CategoryHeader 
          category={category}
          onEdit={onEdit}
          onOpenDeleteDialog={() => setIsDeleteDialogOpen(true)}
        />
        
        <CategoryStats rooms={rooms} />

        {rooms.length > 0 && (
          <div className="mb-4 space-y-2">
            {!isTransferMode ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTransferMode(true)}
                className="w-full bg-white/50 hover:bg-white/70"
              >
                Iniciar Transferência
              </Button>
            ) : (
              <TransferInterface
                categories={categories}
                currentCategoryId={category.id}
                selectedRooms={selectedRooms}
                onCancelTransfer={() => {
                  setIsTransferMode(false);
                  setSelectedRooms([]);
                }}
                onToggleAllRooms={toggleAllRooms}
                onTransferRooms={handleTransferRooms}
              />
            )}
          </div>
        )}
        
        <div className="space-y-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onSelect={() => isTransferMode && toggleRoomSelection(room.id)}
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