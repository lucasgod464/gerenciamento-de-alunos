import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TagDialog } from "@/components/tags/TagDialog";
import { TagList } from "@/components/tags/TagList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface TagType {
  id: string;
  name: string;
  description: string;
  color: string;
  status: boolean;
  company_id: string;
}

// Componente principal de Tags
const Tags = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTags = async () => {
    if (!user?.companyId) return;

    try {
      setIsLoading(true);
      console.log('Buscando tags para a empresa:', user.companyId);
      
      let query = supabase
        .from('tags')
        .select('*')
        .order('name');

      if (user.role !== 'SUPER_ADMIN') {
        query = query.eq('company_id', user.companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao carregar tags:', error);
        throw error;
      }

      console.log('Tags carregadas:', data);
      setTags(data || []);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tags.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [user]);

  const handleSubmit = async (tagData: Omit<TagType, "id" | "company_id">) => {
    if (!user?.companyId) return;

    try {
      if (editingTag) {
        const { error } = await supabase
          .from('tags')
          .update({
            name: tagData.name,
            description: tagData.description,
            color: tagData.color,
            status: tagData.status,
          })
          .eq('id', editingTag.id);

        if (error) throw error;

        setEditingTag(null);
        toast({
          title: "Sucesso",
          description: "Tag atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('tags')
          .insert([{
            ...tagData,
            company_id: user.companyId,
          }]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Tag criada com sucesso!",
        });
      }

      setDialogOpen(false);
      fetchTags();
    } catch (error) {
      console.error('Erro ao salvar tag:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a tag.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchTags();
      
      toast({
        title: "Sucesso",
        description: "Tag excluída com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir tag:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tag.",
        variant: "destructive",
      });
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Etiquetas</h1>
            <p className="text-muted-foreground">
              Gerencie as etiquetas do sistema
            </p>
          </div>
          <Button onClick={() => {
            setEditingTag(null);
            setDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Etiqueta
          </Button>
        </div>

        <TagDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingTag(null);
          }}
          editingTag={editingTag}
          onSubmit={handleSubmit}
        />

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {isLoading ? "Carregando etiquetas..." : "Gerenciar Etiquetas"}
          </h2>
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