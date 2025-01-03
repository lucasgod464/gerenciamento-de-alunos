import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { Tag as TagIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface Tag {
  id: string;
  name: string;
  color: string;
  status: boolean;
}

interface TagSelectionFieldsProps {
  selectedTags: { id: string; name: string; color: string; }[];
  onTagToggle: (tag: { id: string; name: string; color: string; }) => void;
  defaultValues?: any;
}

export function TagSelectionFields({ selectedTags, onTagToggle, defaultValues }: TagSelectionFieldsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchTags = async () => {
      if (!currentUser?.companyId) return;

      const { data: tagsData, error } = await supabase
        .from('tags')
        .select('*')
        .eq('company_id', currentUser.companyId)
        .eq('status', true)
        .order('name');

      if (error) {
        console.error('Error fetching tags:', error);
        return;
      }

      setTags(tagsData);
    };

    fetchTags();
  }, [currentUser?.companyId]);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label>Etiquetas</Label>
      <Input
        placeholder="Buscar etiquetas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {filteredTags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={selectedTags.some(t => t.id === tag.id)}
                onCheckedChange={() => onTagToggle(tag)}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <TagIcon className="h-4 w-4" style={{ color: tag.color }} />
              <label
                htmlFor={`tag-${tag.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag.name}
              </label>
            </div>
          ))}
          {filteredTags.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "Nenhuma etiqueta encontrada" : "Nenhuma etiqueta disponível"}
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}