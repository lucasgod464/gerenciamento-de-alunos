import { Tag as TagIcon } from "lucide-react";
import { User } from "@/types/user";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        <TooltipProvider key={tag.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">
                <TagIcon
                  className="h-4 w-4"
                  style={{ color: tag.color }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tag.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}