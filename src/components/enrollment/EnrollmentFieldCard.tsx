import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Grip, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EnrollmentFieldCardProps {
  field: FormField;
  onDelete: (id: string) => Promise<void>;
  onEdit: (field: FormField) => void;
  isDefault?: boolean;
}

export const EnrollmentFieldCard = ({
  field,
  onDelete,
  onEdit,
  isDefault = false,
}: EnrollmentFieldCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Grip className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </p>
          <p className="text-sm text-muted-foreground">
            Tipo: {field.type}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isDefault && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(field)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(field.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};