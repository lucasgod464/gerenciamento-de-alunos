import { User } from "@/types/user";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFormFieldsProps {
  user: User;
  onChange: (field: string, value: string) => void;
}

export function UserFormFields({ user, onChange }: UserFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input
          value={user.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          value={user.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>
      <div>
        <Label>Local</Label>
        <Input
          value={user.location || ""}
          onChange={(e) => onChange("location", e.target.value)}
        />
      </div>
      <div>
        <Label>Status</Label>
        <Select
          value={user.status}
          onValueChange={(value) => onChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}