import { Tag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserWithTagsProps {
  userName: string;
  companyId: string;
}

interface TagType {
  id: string;
  name: string;
  color: string;
}

export const UserWithTags = ({ userName, companyId }: UserWithTagsProps) => {
  const [userTags, setUserTags] = useState<TagType[]>([]);

  useEffect(() => {
    const fetchUserTags = async () => {
      try {
        // Primeiro, buscar o usuário pelo nome
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('name', userName)
          .eq('company_id', companyId);

        if (userError) throw userError;
        if (!users || users.length === 0) return;

        const userId = users[0].id;

        // Depois, buscar as tags do usuário
        const { data: tags, error: tagsError } = await supabase
          .from('user_tags')
          .select(`
            tag:tag_id (
              id,
              name,
              color
            )
          `)
          .eq('user_id', userId);

        if (tagsError) throw tagsError;
        
        setUserTags(tags?.map(t => t.tag) || []);
      } catch (error) {
        console.error('Erro ao buscar tags do usuário:', error);
      }
    };

    if (userName && companyId) {
      fetchUserTags();
    }
  }, [userName, companyId]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{userName}</span>
      {userTags.length > 0 && (
        <div className="flex gap-1">
          {userTags.map((tag) => (
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
      )}
    </div>
  );
};