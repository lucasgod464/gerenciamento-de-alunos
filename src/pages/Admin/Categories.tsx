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

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const companyCategories = allCategories.filter(
      (cat: Category) => cat.companyId === currentUser.companyId
    );
    setCategories(companyCategories);
  }, [currentUser]);

  const handleCreateOrUpdateCategory = (categoryData: Partial<Category>) => {
    if (!currentUser?.companyId) {
      toast({
        title: "Erro",
        description: "Usuário não está associado a uma empresa",
        variant: "destructive",
      });
      return;
    }

    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const otherCategories = allCategories.filter(
      (cat: Category) => cat.companyId !== currentUser.companyId
    );

    if (editingCategory) {
      const updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryData }
          : cat
      );
      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify([...otherCategories, ...updatedCategories]));
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      });
    } else {
      const newCategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: categoryData.name || "",
        status: true,
        companyId: currentUser.companyId,
        color: categoryData.color,
      };
      
      const updatedCategories = [...categories, newCategory];
      localStorage.setItem("categories", JSON.stringify([...otherCategories, ...updatedCategories]));
      setCategories(updatedCategories);
      
      toast({
        title: "Categoria criada",
        description: "A categoria foi criada com sucesso.",
      });
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const otherCategories = allCategories.filter(
      (cat: Category) => cat.companyId !== currentUser?.companyId
    );
    
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    localStorage.setItem("categories", JSON.stringify([...otherCategories, ...updatedCategories]));
    setCategories(updatedCategories);
    
    toast({
      title: "Categoria excluída",
      description: "A categoria foi excluída com sucesso.",
    });
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
            categories={filteredCategories}
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