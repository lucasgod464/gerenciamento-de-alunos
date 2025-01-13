import { Tag as TagIcon } from "lucide-react";
import { User } from "@/types/user";

interface UserTagsProps {
  user: User;
}

export function UserTags({ user }: UserTagsProps) {
  if (!user.tags || user.tags.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-1">
      {user.tags.map((tag) => (
        <TagIcon
          key={tag.id}
          className="h-4 w-4"
          style={{ color: tag.color }}
        />
      ))}
    </div>
  );
}
