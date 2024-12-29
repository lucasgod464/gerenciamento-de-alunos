import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";

interface TagSelectionFieldsProps {
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  status: boolean;
}

export function TagSelectionFields({ selectedTags, onTagToggle }: TagSelectionFieldsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const savedTags = localStorage.getItem("tags");
    if (savedTags) {
      const allTags = JSON.parse(savedTags);
      const companyTags = allTags.filter((tag: Tag) => 
        tag.companyId === currentUser.companyId && tag.status
      );
      setTags(companyTags);
    }
  }, [currentUser]);

  return (
    <div className="space-y-2">
      <Label>Etiquetas</Label>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={() => onTagToggle(tag.id)}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <label
                htmlFor={`tag-${tag.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag.name}
              </label>
            </div>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma etiqueta disponível
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}