import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Lock, GripVertical } from "lucide-react";
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
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

interface FormPreviewProps {
  fields: FormField[];
  onDeleteField: (id: string) => void;
  onEditField: (field: FormField) => void;
  onReorderFields?: (fields: FormField[]) => void;
}

const SortableFieldCard = ({ field, onDelete, onEdit, isSystemField }: {
  field: FormField;
  onDelete: (id: string) => void;
  onEdit: (field: FormField) => void;
  isSystemField: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      {isSystemField ? (
        <Card className="p-4 bg-gray-50 border-dashed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{field.label}</h3>
                  <span className="text-sm text-red-500">*</span>
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Campo padrão do sistema
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
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
                {field.description && (
                  <p className="text-sm text-muted-foreground">
                    {field.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Tipo: {field.type}
                  {(field.type === "select" || field.type === "multiple") && field.options && (
                    <span className="ml-2">
                      (Opções: {field.options.join(", ")})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(field)}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(field.id)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export const FormPreview = ({ fields, onDeleteField, onEditField, onReorderFields }: FormPreviewProps) => {
  const systemFields = ["nome_completo", "data_nascimento", "sala", "status"];

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

    if (over && active.id !== over.id && onReorderFields) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      
      const newFields = arrayMove(fields, oldIndex, newIndex);
      onReorderFields(newFields);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 space-y-2">
        {fields.filter(field => systemFields.includes(field.id)).map((field) => (
          <SortableFieldCard
            key={field.id}
            field={field}
            onDelete={onDeleteField}
            onEdit={onEditField}
            isSystemField={true}
          />
        ))}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.filter(f => !systemFields.includes(f.id)).map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.filter(field => !systemFields.includes(field.id)).map((field) => (
            <SortableFieldCard
              key={field.id}
              field={field}
              onDelete={onDeleteField}
              onEdit={onEditField}
              isSystemField={false}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};