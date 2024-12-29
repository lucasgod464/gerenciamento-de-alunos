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
    // First, get all users to find the specific user
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = allUsers.find((u: any) => 
      u.name.toLowerCase() === userName.toLowerCase() && 
      u.companyId === companyId
    );
    
    // If user not found or has no tags, return empty array
    if (!user?.tags?.length) {
      console.log(`No tags found for user: ${userName}`);
      return [];
    }

    // Get all tags and filter for user's tags
    const allTags = JSON.parse(localStorage.getItem("tags") || "[]");
    const userTags = user.tags
      .map((tagId: string) => allTags.find((tag: any) => tag.id === tagId))
      .filter(Boolean);
    
    console.log(`Found tags for ${userName}:`, userTags);
    return userTags;
  };

  const userTags = getUserTags(userName);

  return (
    <div className="space-y-2">
      <span className="text-sm">{userName}</span>
      {userTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-2">
          {userTags.map((tag: any) => (
            <TooltipProvider key={tag.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    style={{ 
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                      border: `1px solid ${tag.color}40`
                    }}
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tag: {tag.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
};