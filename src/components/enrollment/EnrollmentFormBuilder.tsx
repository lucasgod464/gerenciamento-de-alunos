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

    try {
      if (editingField) {
        await updateField({ ...editingField, ...field });
        setEditingField(undefined);
      } else {
        await addField(field);
      }
      setIsAddingField(false);
      
      toast({
        title: editingField ? "Campo atualizado" : "Campo adicionado",
        description: editingField 
          ? "O campo foi atualizado com sucesso."
          : "O novo campo foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao manipular campo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o campo. Tente novamente.",
        variant: "destructive",
      });
    }
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