import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Lock, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className={`p-4 ${isSystemField ? 'bg-gray-50 border-dashed' : ''}`}>
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
                {field.required && <span className="text-sm text-red-500">*</span>}
                {isSystemField && (
                  <>
                    <Badge variant="outline" className="bg-gray-100">
                      Campo Padrão
                    </Badge>
                    <Lock className="h-4 w-4 text-gray-400" />
                  </>
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
            {isSystemField ? (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 cursor-not-allowed"
                disabled
              >
                <Lock className="h-4 w-4" />
              </Button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const FormPreview = ({ fields, onDeleteField, onEditField, onReorderFields }: FormPreviewProps) => {
  const systemFields = [
    {
      id: "nome_completo",
      name: "nome_completo",
      label: "Nome Completo",
      type: "text",
      required: true,
      order: -4,
      source: "system",
      isDefault: true
    },
    {
      id: "data_nascimento",
      name: "data_nascimento",
      label: "Data de Nascimento",
      type: "date",
      required: true,
      order: -3,
      source: "system",
      isDefault: true
    },
    {
      id: "sala",
      name: "sala",
      label: "Sala",
      type: "select",
      required: true,
      order: -2,
      source: "system",
      isDefault: true
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      order: -1,
      source: "system",
      isDefault: true
    }
  ];

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
      {/* Campos do Sistema */}
      <div className="space-y-2">
        {systemFields.map((field) => (
          <SortableFieldCard
            key={field.id}
            field={field}
            onDelete={onDeleteField}
            onEdit={onEditField}
            isSystemField={true}
          />
        ))}
      </div>

      {/* Campos Personalizados */}
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

      {fields.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Nenhum campo personalizado adicionado. Clique em "Adicionar Campo" para começar.
        </p>
      )}
    </div>
  );
};