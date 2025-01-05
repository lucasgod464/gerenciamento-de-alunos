import { useState } from "react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./EnrollmentAddFieldDialog";
import { EnrollmentFormHeader } from "./EnrollmentFormHeader";
import { EnrollmentFormConfig } from "./EnrollmentFormConfig";
import { useEnrollmentFields } from "@/hooks/useEnrollmentFields";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const EnrollmentFormBuilder = () => {
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const { fields, addField, deleteField, updateField, reorderFields } = useEnrollmentFields();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddField = async (field: Omit<FormField, "id" | "order">) => {
    if (!user?.companyId) {
      toast({
        title: "Erro",
        description: "Você precisa estar vinculado a uma empresa para adicionar campos.",
        variant: "destructive",
      });
      return;
    }

    if (editingField) {
      await updateField({ ...editingField, ...field });
      setEditingField(undefined);
    } else {
      await addField(field);
    }
    setIsAddingField(false);
  };

  return (
    <div className="space-y-6">
      <EnrollmentFormHeader />
      <EnrollmentFormConfig 
        fields={fields}
        onAddField={() => {
          if (!user?.companyId) {
            toast({
              title: "Erro",
              description: "Você precisa estar vinculado a uma empresa para adicionar campos.",
              variant: "destructive",
            });
            return;
          }
          setEditingField(undefined);
          setIsAddingField(true);
        }}
        onDeleteField={deleteField}
        onEditField={(field) => {
          setEditingField(field);
          setIsAddingField(true);
        }}
        onReorderFields={reorderFields}
      />

      <AddFieldDialog
        open={isAddingField}
        onClose={() => {
          setIsAddingField(false);
          setEditingField(undefined);
        }}
        onAddField={handleAddField}
        editingField={editingField}
      />
    </div>
  );
};