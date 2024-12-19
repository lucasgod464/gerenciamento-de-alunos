import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TagForm } from "@/components/tags/TagForm";
import { TagList } from "@/components/tags/TagList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface TagType {
  id: string; // Changed to string for better uniqueness
  name: string;
  description: string;
  color: string;
  status: boolean;
  companyId: string;
}

const Tags = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper function to get company-specific storage key
  const getCompanyStorageKey = (companyId: string) => `company_${companyId}_tags`;

  // Load tags from company-specific storage
  useEffect(() => {
    if (!user?.companyId && user?.role !== "SUPER_ADMIN") return;

    if (user.role === "SUPER_ADMIN") {
      // Super admin sees all tags from all companies
      const allTags: TagType[] = [];
      const companies = JSON.parse(localStorage.getItem("companies") || "[]");
      
      companies.forEach((company: { id: string }) => {
        const companyTags = JSON.parse(
          localStorage.getItem(getCompanyStorageKey(company.id)) || "[]"
        );
        allTags.push(...companyTags);
      });
      
      setTags(allTags);
    } else {
      // Regular admin sees only their company's tags
      const companyTags = JSON.parse(
        localStorage.getItem(getCompanyStorageKey(user.companyId)) || "[]"
      );
      setTags(companyTags);
    }
  }, [user]);

  const handleSubmit = (tagData: Omit<TagType, "id" | "companyId">) => {
    if (!user?.companyId && user?.role !== "SUPER_ADMIN") return;

    const companyId = user.companyId;
    const storageKey = getCompanyStorageKey(companyId);
    const companyTags = JSON.parse(localStorage.getItem(storageKey) || "[]");

    const newTag: TagType = {
      id: editingTag?.id || `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...tagData,
      companyId,
    };

    let updatedCompanyTags: TagType[];

    if (editingTag) {
      // Update existing tag
      updatedCompanyTags = companyTags.map((tag: TagType) =>
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
      // Create new tag
      updatedCompanyTags = [...companyTags, newTag];
      
      setTags(prev => [...prev, newTag]);
      
      toast({
        title: "Etiqueta criada",
        description: "A nova etiqueta foi criada com sucesso!",
      });
    }

    // Save tags to company-specific storage
    localStorage.setItem(storageKey, JSON.stringify(updatedCompanyTags));
  };

  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
  };

  const handleDelete = (id: string) => {
    if (!user?.companyId && user?.role !== "SUPER_ADMIN") return;

    const storageKey = getCompanyStorageKey(user.companyId);
    const companyTags = JSON.parse(localStorage.getItem(storageKey) || "[]");
    
    // Remove the specific tag
    const updatedCompanyTags = companyTags.filter((tag: TagType) => tag.id !== id);
    
    // Update company-specific storage
    localStorage.setItem(storageKey, JSON.stringify(updatedCompanyTags));
    
    // Update local state
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