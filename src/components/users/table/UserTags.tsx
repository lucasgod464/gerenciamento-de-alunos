import { Tag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserTagsProps {
  tags?: { id: string; name: string; color: string; }[];
}

export const UserTags = ({ tags = [] }: UserTagsProps) => {
  return (
    <div className="flex flex-wrap gap-1 max-w-[150px]">
      {tags.map((tag) => (
        <TooltipProvider key={tag.id}>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center">
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
      {tags.length === 0 && (
        <span className="text-muted-foreground text-xs">
          Sem etiquetas
        </span>
      )}
    </div>
  );
};