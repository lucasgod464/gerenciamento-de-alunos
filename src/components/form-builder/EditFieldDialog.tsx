import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { FormField, FieldType } from "@/types/form-builder";
import { EditFieldForm } from "./EditFieldForm";

interface EditFieldDialogProps {
  field: FormField;
  onUpdateField: (field: FormField) => void;
}

export const EditFieldDialog = ({ field, onUpdateField }: EditFieldDialogProps) => {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(field.label);
  const [type, setType] = useState<FieldType>(field.type);
  const [required, setRequired] = useState(field.required);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateField({
      ...field,
      label,
      type,
      required,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Campo</DialogTitle>
        </DialogHeader>
        <EditFieldForm
          field={field}
          label={label}
          type={type}
          required={required}
          onLabelChange={setLabel}
          onTypeChange={setType}
          onRequiredChange={setRequired}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};