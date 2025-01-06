import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "@/types/form";
import { AddFieldDialog } from "./AddFieldDialog";
import { FormPreview } from "./FormPreview";
import { useFormFields } from "@/hooks/useFormFields";

export const FormBuilder = () => {
  const {
    fields,
    isAddingField,
    editingField,
    setIsAddingField,
    setEditingField,
    handleAddField,
    handleEditField,
    handleUpdateField,
    handleDeleteField,
    handleReorderFields,
  } = useFormFields();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Campos do Formulário</h2>
          <Button onClick={() => {
            setEditingField(null);
            setIsAddingField(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Campo
          </Button>
        </div>
        <FormPreview 
          fields={fields} 
          onDeleteField={handleDeleteField}
          onEditField={handleEditField}
          onReorderFields={handleReorderFields}
        />
      </Card>

      <AddFieldDialog
        open={isAddingField}
        onClose={() => {
          setIsAddingField(false);
          setEditingField(null);
        }}
        onAddField={editingField ? handleUpdateField : handleAddField}
        editingField={editingField}
      />
    </div>
  );
};