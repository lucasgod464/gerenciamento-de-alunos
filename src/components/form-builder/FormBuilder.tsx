import { useState } from "react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./AddFieldDialog";
import { FormBuilderHeader } from "./FormBuilderHeader";
import { FormFieldsList } from "./FormFieldsList";
import { useFormFields } from "@/hooks/useFormFields";

export const FormBuilder = () => {
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const { fields, isLoading, addField, updateField, deleteField, reorderFields } = useFormFields();

  const handleAddField = async (field: Omit<FormField, "id" | "order">) => {
    if (editingField) {
      const success = await updateField(editingField.id, field);
      if (success) {
        setEditingField(null);
        setIsAddingField(false);
      }
    } else {
      const success = await addField(field);
      if (success) {
        setIsAddingField(false);
      }
    }
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setIsAddingField(true);
  };

  return (
    <div className="space-y-6">
      <FormBuilderHeader onAddField={() => {
        setEditingField(null);
        setIsAddingField(true);
      }} />

      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Carregando campos...</p>
      ) : (
        <FormFieldsList
          fields={fields}
          onEditField={handleEditField}
          onDeleteField={deleteField}
          onReorderFields={reorderFields}
        />
      )}

      <AddFieldDialog
        open={isAddingField}
        onClose={() => {
          setIsAddingField(false);
          setEditingField(null);
        }}
        onAddField={handleAddField}
        editingField={editingField}
      />
    </div>
  );
};