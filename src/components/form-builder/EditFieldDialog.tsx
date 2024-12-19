import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";
import { FormField, FieldType } from "@/types/form-builder";

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
            <Label htmlFor="type">Tipo do Campo</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as FieldType)}
              disabled={field.isDefault}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="number">Número</SelectItem>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="tel">Telefone</SelectItem>
                <SelectItem value="select">Seleção</SelectItem>
                <SelectItem value="checkbox">Caixa de Seleção</SelectItem>
                <SelectItem value="radio">Botão de Rádio</SelectItem>
                <SelectItem value="textarea">Área de Texto</SelectItem>
                <SelectItem value="file">Upload de Arquivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={required}
              onCheckedChange={setRequired}
              disabled={field.isDefault}
            />
            <Label htmlFor="required">Campo Obrigatório</Label>
          </div>
          <Button type="submit" className="w-full">
            Salvar Alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};