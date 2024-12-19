import { Button } from "@/components/ui/button";
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
import { FormField, FieldType } from "@/types/form-builder";

interface EditFieldFormProps {
  field: FormField;
  label: string;
  type: FieldType;
  required: boolean;
  onLabelChange: (value: string) => void;
  onTypeChange: (value: FieldType) => void;
  onRequiredChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditFieldForm = ({
  field,
  label,
  type,
  required,
  onLabelChange,
  onTypeChange,
  onRequiredChange,
  onSubmit,
}: EditFieldFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Nome do Campo</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Tipo do Campo</Label>
        <Select
          value={type}
          onValueChange={(value) => onTypeChange(value as FieldType)}
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
          onCheckedChange={onRequiredChange}
          disabled={field.isDefault}
        />
        <Label htmlFor="required">Campo Obrigatório</Label>
      </div>
      <Button type="submit" className="w-full">
        Salvar Alterações
      </Button>
    </form>
  );
};