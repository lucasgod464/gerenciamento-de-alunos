import { useEffect, useState } from "react";
import { Room } from "@/types/room";
import { CategoryColumn } from "./CategoryColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Category } from "@/types/category";

interface CategoriesKanbanProps {
  categories: Category[];
  companyId: string | null;
}

export const CategoriesKanban = ({ categories, companyId }: CategoriesKanbanProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);

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

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex flex-wrap gap-6 p-4">
        {categories.map((category) => (
          <CategoryColumn
            key={category.id}
            category={category}
            rooms={rooms.filter((room) => room.category === category.id)}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};