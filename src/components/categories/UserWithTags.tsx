import { Tag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserWithTagsProps {
  userName: string;
  companyId: string;
}

export const UserWithTags = ({ userName, companyId }: UserWithTagsProps) => {
  const getUserTags = (userName: string) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = allUsers.find((u: any) => 
      u.name === userName && u.companyId === companyId
    );
    
    if (!user?.tags?.length) return [];

    const allTags = JSON.parse(localStorage.getItem("tags") || "[]");
    return user.tags
      .map((tagId: string) => allTags.find((tag: any) => tag.id === tagId))
      .filter(Boolean);
  };

  const userTags = getUserTags(userName);

  return (
    <div className="flex flex-col gap-1">
      <span>{userName}</span>
      {userTags.length > 0 && (
        <div className="flex flex-wrap gap-1 ml-2">
          {userTags.map((tag: any) => (
            <TooltipProvider key={tag.id}>
              <Tooltip>
                <TooltipTrigger>
                  <Tag 
                    className="h-4 w-4" 
                    style={{ 
                      color: tag.color,
                      fill: tag.color,
                      fillOpacity: 0.2,
                    }} 
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tag.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
};