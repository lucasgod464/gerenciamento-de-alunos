import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Lock, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FieldCardProps {
  field: FormField;
  onDelete: (id: string) => void;
  onEdit: (field: FormField) => void;
  isSystemField: boolean;
}

export const EnrollmentFieldCard = ({ field, onDelete, onEdit, isSystemField }: FieldCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative' as const,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? 'var(--background)' : undefined,
    boxShadow: isDragging ? 'var(--shadow-lg)' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isSystemField && (
              <button
                className="cursor-grab touch-none hover:text-primary transition-colors duration-200"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{field.label}</h3>
                {field.required && (
                  <span className="text-sm text-red-500">*</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Type: {field.type}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isSystemField ? (
              <Lock className="h-4 w-4 text-gray-400" />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(field)}
                >
                  <Edit className="h-4 w-4" />
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
        </div>
      </Card>
    </div>
  );
};