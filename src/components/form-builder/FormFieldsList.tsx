import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, GripVertical } from "lucide-react";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FormFieldsListProps {
  fields: FormField[];
  onEditField: (field: FormField) => void;
  onDeleteField: (id: string) => void;
  onReorderFields: (fields: FormField[]) => void;
}

const SortableField = ({ field, onEdit, onDelete }: {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (id: string) => void;
}) => {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-4 mb-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="cursor-grab touch-none hover:text-primary transition-colors duration-200"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{field.label}</h3>
                {field.required && (
                  <span className="text-sm text-red-500">*</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Tipo: {field.type}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
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
          </div>
        </div>
      </Card>
    </div>
  );
};

export const FormFieldsList = ({
  fields,
  onEditField,
  onDeleteField,
  onReorderFields,
}: FormFieldsListProps) => {
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
      
      const newFields = [...fields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      
      onReorderFields(newFields);
    }
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field) => (
            <SortableField
              key={field.id}
              field={field}
              onEdit={onEditField}
              onDelete={onDeleteField}
            />
          ))}
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Nenhum campo adicionado. Clique em "Adicionar Campo" para começar.
        </p>
      )}
    </div>
  );
};