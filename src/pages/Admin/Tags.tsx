import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TagForm } from "@/components/tags/TagForm";
import { TagList } from "@/components/tags/TagList";
import { useToast } from "@/hooks/use-toast";

interface TagType {
  id: number;
  name: string;
  description: string;
  color: string;
  status: boolean;
}

const Tags = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedColor, setSelectedColor] = useState("");
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedTags = localStorage.getItem("tags");
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  const handleSubmit = (tagData: Omit<TagType, "id">) => {
    if (editingTag) {
      setTags(tags.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, ...tagData }
          : tag
      ));
      setEditingTag(null);
      toast({
        title: "Etiqueta atualizada",
        description: "A etiqueta foi atualizada com sucesso!",
      });
    } else {
      const newTag: TagType = {
        id: Date.now(),
        ...tagData,
      };
      setTags([...tags, newTag]);
      toast({
        title: "Etiqueta criada",
        description: "A nova etiqueta foi criada com sucesso!",
      });
    }
  };

  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
  };

  const handleDelete = (id: number) => {
    setTags(tags.filter(tag => tag.id !== id));
    toast({
      title: "Etiqueta excluída",
      description: "A etiqueta foi excluída com sucesso!",
    });
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "active" ? tag.status : !tag.status;
    const matchesColor = !selectedColor || tag.color === selectedColor;
    
    return matchesSearch && matchesStatus && matchesColor;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Etiquetas</h1>
          <p className="text-muted-foreground">
            Gerencie as etiquetas do sistema
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editingTag ? "Editar Etiqueta" : "Criar Etiqueta"}
          </h2>
          <TagForm
            editingTag={editingTag}
            onSubmit={handleSubmit}
            onCancel={() => setEditingTag(null)}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gerenciar Etiquetas</h2>
          <TagList
            tags={filteredTags}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tags;