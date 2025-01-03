import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CategoriesKanban } from "@/components/categories/CategoriesKanban";
import { CategoryDialog } from "@/components/categories/CategoryDialog";
import { Category } from "@/types/category";
import { supabase } from "@/integrations/supabase/client";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    fetchCategories();
  }, [currentUser]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('company_id', currentUser?.companyId);

      if (error) throw error;
      
      // Transform the data to match our Category type
      const transformedData: Category[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        status: item.status,
        company_id: item.company_id,
        color: item.color,
        created_at: item.created_at
      }));
      
      setCategories(transformedData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Ocorreu um erro ao carregar as categorias.",
        variant: "destructive",
      });
    }
  };

  const handleCreateOrUpdateCategory = async (categoryData: Partial<Category>) => {
    if (!currentUser?.companyId) {
      toast({
        title: "Erro",
        description: "Usuário não está associado a uma empresa",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: categoryData.name,
            color: categoryData.color,
          })
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: "Categoria atualizada",
          description: "A categoria foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([{
            name: categoryData.name,
            color: categoryData.color,
            company_id: currentUser.companyId,
            status: true,
          }]);

        if (error) throw error;

        toast({
          title: "Categoria criada",
          description: "A categoria foi criada com sucesso.",
        });
      }

      fetchCategories();
      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Erro ao salvar categoria",
        description: "Ocorreu um erro ao salvar a categoria.",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      fetchCategories();
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: "Ocorreu um erro ao excluir a categoria.",
        variant: "destructive",
      });
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias do sistema
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categorias..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              setEditingCategory(null);
              setIsDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </div>

          <CategoriesKanban 
            categories={categories}
            companyId={currentUser?.companyId || null}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSave={handleCreateOrUpdateCategory}
      />
    </DashboardLayout>
  );
};

export default Categories;