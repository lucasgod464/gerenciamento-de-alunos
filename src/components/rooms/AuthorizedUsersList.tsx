import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
}

interface AuthorizedUsersListProps {
  users: User[];
  authorizedUsers: string[];
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function AuthorizedUsersList({
  users,
  authorizedUsers,
  onAddUser,
  onRemoveUser,
}: AuthorizedUsersListProps) {
  return (
    <div className="space-y-2">
      <Label>Usuários Autorizados</Label>
      <Select
        value=""
        onValueChange={onAddUser}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione os usuários" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-2 space-y-2">
        {authorizedUsers.map((userId) => {
          const user = users.find((u) => u.id === userId);
          return user ? (
            <div key={userId} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveUser(userId)}
              >
                Remover
              </Button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
