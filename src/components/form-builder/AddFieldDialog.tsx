import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { FormField, FieldType } from "@/types/form";
import { CustomFieldOptions } from "./CustomFieldOptions";

interface AddFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onAddField: (field: Omit<FormField, "id" | "order">) => void;
  editingField?: FormField | null;
}

export const AddFieldDialog = ({
  open,
  onClose,
  onAddField,
  editingField,
}: AddFieldDialogProps) => {
  const [fieldData, setFieldData] = useState<{
    name: string;
    label: string;
    description: string;
    type: FieldType;
    required: boolean;
    options: string[];
  }>({
    name: "",
    label: "",
    description: "",
    type: "text",
    required: true,
    options: [],
  });
  const [optionInput, setOptionInput] = useState("");

  useEffect(() => {
    if (editingField) {
      setFieldData({
        name: editingField.name,
        label: editingField.label,
        description: editingField.description || "",
        type: editingField.type,
        required: editingField.required,
        options: editingField.options || [],
      });
    } else {
      setFieldData({
        name: "",
        label: "",
        description: "",
        type: "text",
        required: true,
        options: [],
      });
    }
    setOptionInput("");
  }, [editingField, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const field = {
      ...fieldData,
      name: fieldData.name.toLowerCase().replace(/\s+/g, "_"),
    };
    onAddField(field);
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setFieldData(prev => ({
        ...prev,
        options: [...(prev.options || []), optionInput.trim()],
      }));
      setOptionInput("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setFieldData(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingField ? "Editar Campo" : "Adicionar Novo Campo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nome do Campo</Label>
            <Input
              id="label"
              value={fieldData.label}
              onChange={(e) =>
                setFieldData({ ...fieldData, label: e.target.value })
              }
              placeholder="Ex: Telefone"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={fieldData.description}
              onChange={(e) =>
                setFieldData({ ...fieldData, description: e.target.value })
              }
              placeholder="Adicione uma descrição para este campo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo do Campo</Label>
            <Select
              value={fieldData.type}
              onValueChange={(value: FieldType) =>
                setFieldData({ ...fieldData, type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="tel">Telefone</SelectItem>
                <SelectItem value="textarea">Área de Texto</SelectItem>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="select">Lista de Opções</SelectItem>
                <SelectItem value="multiple">Múltipla Escolha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(fieldData.type === "select" || fieldData.type === "multiple") && (
            <CustomFieldOptions
              type={fieldData.type}
              options={fieldData.options}
              optionInput={optionInput}
              setOptionInput={setOptionInput}
              onAddOption={handleAddOption}
              onRemoveOption={handleRemoveOption}
            />
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="required">Campo Obrigatório</Label>
            <Switch
              id="required"
              checked={fieldData.required}
              onCheckedChange={(checked) =>
                setFieldData({ ...fieldData, required: checked })
              }
            />
          </div>

          <Button type="submit" className="w-full">
            {editingField ? "Salvar Alterações" : "Adicionar Campo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};