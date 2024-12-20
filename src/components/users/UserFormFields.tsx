import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySelect } from "./CategorySelect";

interface UserFormFieldsProps {
  generateStrongPassword?: () => void;
}

export const UserFormFields = ({ generateStrongPassword }: UserFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          placeholder="Digite o nome completo"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Digite o email"
          required
        />
      </div>
      {generateStrongPassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="flex gap-2">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Digite a senha"
              required
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateStrongPassword}
            >
              Gerar
            </Button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="responsibleCategory">Categoria Responsável</Label>
        <CategorySelect
          value=""
          onChange={() => {}}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          name="location"
          placeholder="Digite o local"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialization">Especialização</Label>
        <Select name="specialization">
          <SelectTrigger>
            <SelectValue placeholder="Selecione a especialização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="esp1">Especialização 1</SelectItem>
            <SelectItem value="esp2">Especialização 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue="active">
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};