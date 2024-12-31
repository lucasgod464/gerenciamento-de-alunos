import { FormField } from "@/types/form";
import { EnrollmentFieldCard } from "./EnrollmentFieldCard";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface FormPreviewProps {
  fields: FormField[];
  onDeleteField: (id: string) => void;
  onEditField: (field: FormField) => void;
  onReorderFields: (fields: FormField[]) => void;
}

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
      <div className="relative space-y-4">
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
                isSystemField={systemFields.includes(field.name)}
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