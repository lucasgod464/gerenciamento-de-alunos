import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TagForm } from "@/components/tags/TagForm";
import { TagList } from "@/components/tags/TagList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface TagType {
  id: number;
  name: string;
  description: string;
  color: string;
  status: boolean;
  companyId: string; // Add companyId to tag type
}

const Tags = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const savedTags = localStorage.getItem("tags");
    if (savedTags) {
      const allTags = JSON.parse(savedTags);
      // Filter tags by company
      const companyTags = allTags.filter((tag: TagType) => 
        user?.role === "SUPER_ADMIN" || tag.companyId === user?.companyId
      );
      setTags(companyTags);
    }
  }, [user]);

  const handleSubmit = (tagData: Omit<TagType, "id">) => {
    const newTag: TagType = {
      id: editingTag?.id || Date.now(),
      ...tagData,
      companyId: user?.companyId || "", // Ensure companyId is set
    };

    if (editingTag) {
      // Update existing tag
      const updatedTags = tags.map((tag) =>
        tag.id === editingTag.id ? newTag : tag
      );
      
      // Update in localStorage while preserving other companies' data
      const savedTags = JSON.parse(localStorage.getItem("tags") || "[]");
      const otherCompaniesTags = savedTags.filter((tag: TagType) => 
        tag.companyId !== user?.companyId
      );
      
      localStorage.setItem("tags", JSON.stringify([...otherCompaniesTags, ...updatedTags]));
      setTags(updatedTags);
      setEditingTag(null);
      
      toast({
        title: "Etiqueta atualizada",
        description: "A etiqueta foi atualizada com sucesso!",
      });
    } else {
      // Create new tag
      const updatedTags = [...tags, newTag];
      
      // Update in localStorage while preserving other companies' data
      const savedTags = JSON.parse(localStorage.getItem("tags") || "[]");
      const otherCompaniesTags = savedTags.filter((tag: TagType) => 
        tag.companyId !== user?.companyId
      );
      
      localStorage.setItem("tags", JSON.stringify([...otherCompaniesTags, ...updatedTags]));
      setTags(updatedTags);
      
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
    const updatedTags = tags.filter((tag) => tag.id !== id);
    
    // Update in localStorage while preserving other companies' data
    const savedTags = JSON.parse(localStorage.getItem("tags") || "[]");
    const otherCompaniesTags = savedTags.filter((tag: TagType) => 
      tag.companyId !== user?.companyId
    );
    
    localStorage.setItem("tags", JSON.stringify([...otherCompaniesTags, ...updatedTags]));
    setTags(updatedTags);
    
    toast({
      title: "Etiqueta excluída",
      description: "A etiqueta foi excluída com sucesso!",
    });
  };

  const filteredTags = tags.filter((tag) => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? tag.status
        : !tag.status;

    return matchesSearch && matchesStatus;
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
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tags;