import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";

interface UserTagsProps {
  user: User;
}

export function UserTags({ user }: UserTagsProps) {
  if (!user.tags || user.tags.length === 0) {
    return <span className="text-sm text-muted-foreground">Sem etiquetas</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {user.tags.map((tag) => (
        <Badge
          key={tag.id}
          style={{
            backgroundColor: tag.color,
            color: '#fff'
          }}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}