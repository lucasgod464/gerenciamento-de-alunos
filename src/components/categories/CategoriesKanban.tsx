import { useEffect, useState } from "react";
import { Room } from "@/types/room";
import { CategoryColumn } from "./CategoryColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Category } from "@/types/category";
import { useToast } from "@/hooks/use-toast";

interface CategoriesKanbanProps {
  categories: Category[];
  companyId: string | null;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategoriesKanban = ({ 
  categories, 
  companyId,
  onEditCategory,
  onDeleteCategory 
}: CategoriesKanbanProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: Room) => room.companyId === companyId
      );
      setRooms(companyRooms);
    }
  }, [companyId]);

  const handleTransferRooms = (roomIds: string[], targetCategoryId: string) => {
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const updatedRooms = allRooms.map((room: Room) => {
      if (roomIds.includes(room.id)) {
        return { ...room, category: targetCategoryId };
      }
      return room;
    });

    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    
    // Atualizar o estado local
    setRooms(prevRooms => 
      prevRooms.map(room => {
        if (roomIds.includes(room.id)) {
          return { ...room, category: targetCategoryId };
        }
        return room;
      })
    );
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex gap-6 p-4">
        {categories.map((category) => (
          <CategoryColumn
            key={category.id}
            category={category}
            categories={categories}
            rooms={rooms.filter((room) => room.category === category.id)}
            onEdit={() => onEditCategory(category)}
            onDelete={() => onDeleteCategory(category.id)}
            onTransferRooms={handleTransferRooms}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};