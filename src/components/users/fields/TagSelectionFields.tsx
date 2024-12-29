import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";

interface TagSelectionFieldsProps {
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  status: boolean;
  companyId: string;
}

export function TagSelectionFields({ selectedTags, onTagToggle }: TagSelectionFieldsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const allTags = JSON.parse(localStorage.getItem("tags") || "[]");
    const companyTags = allTags.filter((tag: Tag) => 
      tag.companyId === currentUser.companyId && tag.status
    );
    setTags(companyTags);
  }, [currentUser]);

  return (
    <div className="space-y-2">
      <Label className="text-base font-semibold">Etiquetas</Label>
      <Card className="border-muted">
        <CardContent className="p-3">
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded-md cursor-pointer transition-colors"
                >
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => onTagToggle(tag.id)}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm">{tag.name}</span>
                </label>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma etiqueta disponível
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}