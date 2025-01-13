import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccessLevel } from "@/types/user";

interface UserAccessLevelProps {
  accessLevel: AccessLevel;
  onAccessLevelChange: (value: AccessLevel) => void;
}

export const UserAccessLevel = ({ accessLevel, onAccessLevelChange }: UserAccessLevelProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="access_level">Nível de Acesso</Label>
      <Select
        value={accessLevel}
        onValueChange={(value: AccessLevel) => onAccessLevelChange(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Admin">Administrador</SelectItem>
          <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
          <SelectItem value="Inativo">Inativo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
