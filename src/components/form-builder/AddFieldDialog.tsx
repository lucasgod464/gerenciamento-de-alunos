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
import { Plus } from "lucide-react";
import { FormField, FieldType } from "@/types/form-builder";

interface AddFieldDialogProps {
  onAddField: (field: Omit<FormField, "id" | "order">) => void;
}

export const AddFieldDialog = ({ onAddField }: AddFieldDialogProps) => {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [required, setRequired] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a name from the label (lowercase, no spaces)
    const name = label.toLowerCase().replace(/\s+/g, '_');
    onAddField({ label, type, required, name });
    setOpen(false);
    setLabel("");
    setType("text");
    setRequired(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Campo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Campo</DialogTitle>
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
            <Select value={type} onValueChange={(value) => setType(value as FieldType)}>
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
            />
            <Label htmlFor="required">Campo Obrigatório</Label>
          </div>
          <Button type="submit" className="w-full">
            Adicionar Campo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};