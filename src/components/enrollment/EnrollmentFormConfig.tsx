import { FormField } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { EnrollmentFieldCard } from "./EnrollmentFieldCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { defaultFields } from "@/hooks/useEnrollmentFields";

interface EnrollmentFormConfigProps {
  fields: FormField[];
  onAddField: () => void;
  onDeleteField: (id: string) => Promise<void>;
  onEditField: (field: FormField) => void;
  onReorderFields: (fields: FormField[]) => Promise<void>;
}

export const EnrollmentFormConfig = ({
  fields,
  onAddField,
  onDeleteField,
  onEditField,
  onReorderFields,
}: EnrollmentFormConfigProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      const newFields = arrayMove(fields, oldIndex, newIndex);
      onReorderFields(newFields);
    }
  };

  // Combina os campos padrão com os campos personalizados
  const allFields = [...defaultFields, ...fields.filter(field => !defaultFields.some(df => df.id === field.id))];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Configuração do Formulário</h3>
            <p className="text-sm text-muted-foreground">
              Personalize os campos e seções do formulário de inscrição
            </p>
          </div>
          <Button onClick={onAddField}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Campo
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={allFields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {allFields.map((field) => (
                <EnrollmentFieldCard
                  key={field.id}
                  field={field}
                  onDelete={onDeleteField}
                  onEdit={onEditField}
                  isDefault={field.isDefault}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Card>
    </div>
  );
};