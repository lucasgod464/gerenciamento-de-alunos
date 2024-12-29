import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CategoriesKanban } from "@/components/categories/CategoriesKanban";
import { Category } from "@/types/category";

const PRESET_COLORS = [
  "#9b87f5", // Primary Purple
  "#D6BCFA", // Light Purple
  "#F2FCE2", // Soft Green
  "#FEF7CD", // Soft Yellow
  "#FEC6A1", // Soft Orange
  "#E5DEFF", // Soft Purple
  "#FFDEE2", // Soft Pink
  "#FDE1D3", // Soft Peach
  "#D3E4FD", // Soft Blue
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
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

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const otherCategories = allCategories.filter(
      (cat: Category) => cat.companyId !== currentUser?.companyId
    );

    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategoryName,
      status: true,
      companyId: currentUser?.companyId,
      color: selectedColor,
    };
    
    const updatedCategories = [...categories, newCategory];
    localStorage.setItem("categories", JSON.stringify([...otherCategories, ...updatedCategories]));
    setCategories(updatedCategories);
    
    toast({
      title: "Categoria criada",
      description: "A categoria foi criada com sucesso.",
    });

    setNewCategoryName("");
    setSelectedColor(PRESET_COLORS[0]);
    setIsDialogOpen(false);
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
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </div>

          <CategoriesKanban 
            categories={filteredCategories}
            companyId={currentUser?.companyId || null}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Digite o nome da categoria"
              />
            </div>
            <div className="space-y-2">
              <Label>Cor da Categoria</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-primary scale-110' : 'border-transparent scale-100'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCategory}>
              Criar Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Categories;