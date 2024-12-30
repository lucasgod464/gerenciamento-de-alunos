import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FieldType } from "@/types/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AddFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onAddField: (field: Omit<FormField, "id" | "order">) => void;
  editingField?: FormField;
}

export const AddFieldDialog = ({ open, onClose, onAddField, editingField }: AddFieldDialogProps) => {
  const [label, setLabel] = useState(editingField?.label || "");
  const [description, setDescription] = useState(editingField?.description || "");
  const [type, setType] = useState<FieldType>(editingField?.type || "text");
  const [required, setRequired] = useState(editingField?.required || false);
  const [options, setOptions] = useState<string[]>(editingField?.options || []);
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    if (editingField) {
      setLabel(editingField.label);
      setDescription(editingField.description || "");
      setType(editingField.type);
      setRequired(editingField.required);
      setOptions(editingField.options || []);
    }
  }, [editingField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddField({
      label,
      description,
      type,
      required,
      name: label.toLowerCase().replace(/\s+/g, "_"),
      options: type === "select" ? options : undefined,
    });
    setLabel("");
    setDescription("");
    setType("text");
    setRequired(false);
    setOptions([]);
    setNewOption("");
  };

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeOption = (indexToRemove: number) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingField ? "Editar Campo" : "Adicionar Novo Campo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nome do Campo</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição para este campo..."
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo do Campo</Label>
            <Select value={type} onValueChange={(value: FieldType) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="tel">Telefone</SelectItem>
                <SelectItem value="textarea">Área de Texto</SelectItem>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="select">Lista de Opções</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "select" && (
            <div className="space-y-2">
              <Label>Opções da Lista</Label>
              <div className="flex gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Digite uma opção"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                    <span className="flex-1">{option}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {options.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Adicione pelo menos uma opção para a lista de seleção
                </p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={required}
              onCheckedChange={setRequired}
            />
            <Label htmlFor="required">Campo Obrigatório</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={type === "select" && options.length === 0}
            >
              {editingField ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};