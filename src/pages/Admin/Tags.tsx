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
  companyId: string;
}

const Tags = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Carregar tags do localStorage
  useEffect(() => {
    if (!user?.companyId && user?.role !== "SUPER_ADMIN") return;

    const savedTags = localStorage.getItem("tags");
    if (savedTags) {
      const allTags = JSON.parse(savedTags);
      // Filtrar tags por empresa
      const companyTags = allTags.filter((tag: TagType) => 
        user?.role === "SUPER_ADMIN" || tag.companyId === user?.companyId
      );
      setTags(companyTags);
    }
  }, [user]);

  const handleSubmit = (tagData: Omit<TagType, "id" | "companyId">) => {
    if (!user?.companyId && user?.role !== "SUPER_ADMIN") return;

    // Carregar todas as tags existentes primeiro
    const savedTags = JSON.parse(localStorage.getItem("tags") || "[]");
    
    const newTag: TagType = {
      id: editingTag?.id || Date.now(),
      ...tagData,
      companyId: user?.companyId || "",
    };

    let updatedTags: TagType[];

    if (editingTag) {
      // Atualizar tag existente
      updatedTags = savedTags.map((tag: TagType) =>
        tag.id === editingTag.id ? newTag : tag
      );

      setTags(prev => prev.map(tag => 
        tag.id === editingTag.id ? newTag : tag
      ));

      setEditingTag(null);
      toast({
        title: "Etiqueta atualizada",
        description: "A etiqueta foi atualizada com sucesso!",
      });
    } else {
      // Criar nova tag
      updatedTags = [...savedTags, newTag];
      
      setTags(prev => [...prev, newTag]);
      
      toast({
        title: "Etiqueta criada",
        description: "A nova etiqueta foi criada com sucesso!",
      });
    }

    // Salvar todas as tags atualizadas no localStorage
    localStorage.setItem("tags", JSON.stringify(updatedTags));
  };

  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
  };

  const handleDelete = (id: number) => {
    if (!user?.companyId && user?.role !== "SUPER_ADMIN") return;

    // Carregar todas as tags existentes
    const savedTags = JSON.parse(localStorage.getItem("tags") || "[]");
    
    // Remover a tag específica
    const updatedTags = savedTags.filter((tag: TagType) => tag.id !== id);
    
    // Atualizar localStorage
    localStorage.setItem("tags", JSON.stringify(updatedTags));
    
    // Atualizar estado local
    setTags(prev => prev.filter(tag => tag.id !== id));
    
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