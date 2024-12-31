import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Lock, GripVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FormPreviewProps {
  fields: FormField[];
  onDeleteField: (id: string) => void;
  onEditField: (field: FormField) => void;
  onReorderFields: (fields: FormField[]) => void;
}

const SortableFieldCard = ({ field, onDelete, onEdit, isSystemField, index }: { 
  field: FormField; 
  onDelete: (id: string) => void; 
  onEdit: (field: FormField) => void;
  isSystemField: boolean;
  index: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: field.id,
    data: {
      index: index,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative' as const,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
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
                <span className="text-sm text-muted-foreground">#{index + 1}</span>
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

export const FormPreview = ({ fields, onDeleteField, onEditField, onReorderFields }: FormPreviewProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  const systemFields = ["nome_completo", "data_nascimento"];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      
      const newFields = arrayMove(fields, oldIndex, newIndex);
      onReorderFields(newFields);
    }
  };

  const handleDeleteClick = (id: string) => {
    setFieldToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fieldToDelete) {
      onDeleteField(fieldToDelete);
      setFieldToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="relative">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <SortableFieldCard
                key={field.id}
                field={field}
                onDelete={handleDeleteClick}
                onEdit={onEditField}
                isSystemField={systemFields.includes(field.name)}
                index={index}
              />
            ))}
          </SortableContext>
        </DndContext>

        {fields.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No fields added. Click "Add Field" to start.
          </p>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this field? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};