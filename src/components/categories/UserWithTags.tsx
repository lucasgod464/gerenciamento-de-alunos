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
    const allTags = JSON.parse(localStorage.getItem("tags") || "[]");
    
    // Busca case insensitive do usuário
    const user = allUsers.find((u: any) => 
      u.name.toLowerCase() === userName.toLowerCase() && 
      u.companyId === companyId
    );

    console.log(`Buscando usuário: ${userName}`);
    console.log(`CompanyId: ${companyId}`);
    console.log(`Usuário encontrado:`, user);
    
    if (!user?.tags?.length) {
      console.log(`Nenhuma tag encontrada para ${userName}`);
      return [];
    }

    const userTags = user.tags
      .map((tagId: string) => allTags.find((tag: any) => tag.id === tagId))
      .filter(Boolean);

    console.log(`Tags encontradas para ${userName}:`, userTags);
    return userTags;
  };

  const userTags = getUserTags(userName);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{userName}</span>
      <div className="flex gap-1">
        {userTags.map((tag: any) => (
          <TooltipProvider key={tag.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
                  <Tag 
                    className="h-4 w-4" 
                    style={{ 
                      color: tag.color,
                      fill: tag.color,
                      fillOpacity: 0.2,
                    }} 
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
    </div>
  );
};