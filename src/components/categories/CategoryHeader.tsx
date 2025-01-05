import { Category } from "@/types/category";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryHeaderProps {
  category: Category;
  onEdit: () => void;
  onOpenDeleteDialog: () => void;
}

export const CategoryHeader = ({ 
  category, 
  onEdit, 
  onOpenDeleteDialog 
}: CategoryHeaderProps) => {
  return (
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
          onClick={onOpenDeleteDialog}
          className="hover:bg-white/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};