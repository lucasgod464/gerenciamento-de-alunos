import { FormField } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
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
import { EnrollmentFieldCard } from "@/components/enrollment/EnrollmentFieldCard";

interface FormPreviewProps {
  fields: FormField[];
  onDeleteField: (id: string) => void;
  onEditField: (field: FormField) => void;
  onReorderFields: (fields: FormField[]) => void;
}

export const FormPreview = ({ fields, onDeleteField, onEditField, onReorderFields }: FormPreviewProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  const systemFields = [
    {
      id: "nome_completo_preview",
      name: "nome_completo",
      label: "Nome Completo",
      type: "text",
      required: true,
      order: -3,
      source: "system",
      isDefault: true
    },
    {
      id: "data_nascimento_preview",
      name: "data_nascimento",
      label: "Data de Nascimento",
      type: "date",
      required: true,
      order: -2,
      source: "system",
      isDefault: true
    },
    {
      id: "sala_preview",
      name: "sala",
      label: "Seleção de Sala",
      type: "select",
      required: true,
      order: -1,
      source: "system",
      isDefault: true,
      options: []
    },
    {
      id: "status_preview",
      name: "status",
      label: "Status do Aluno",
      type: "select",
      required: true,
      order: 0,
      source: "system",
      isDefault: true,
      options: ["Ativo", "Inativo"]
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove([...fields], oldIndex, newIndex);
        const reorderedFields = newFields.map((field, index) => ({
          ...field,
          order: index
        }));
        onReorderFields(reorderedFields);
      }
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

  // Renderiza os campos do sistema (apenas visualização)
  const renderSystemFields = () => (
    <div className="mb-4 space-y-2">
      {systemFields.map((field) => (
        <Card key={field.id} className="p-4 bg-gray-50 border-dashed">
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
      ))}
    </div>
  );

  return (
    <>
      <div className="relative space-y-4">
        {renderSystemFields()}
        
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
              <EnrollmentFieldCard
                key={field.id}
                field={field}
                onDelete={handleDeleteClick}
                onEdit={onEditField}
                isSystemField={field.isDefault}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este campo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
