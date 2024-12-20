import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
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
      companyId: currentUser?.companyId
    };
    
    const updatedCategories = [...categories, newCategory];
    localStorage.setItem("categories", JSON.stringify([...otherCategories, ...updatedCategories]));
    setCategories(updatedCategories);
    
    toast({
      title: "Categoria criada",
      description: "A categoria foi criada com sucesso.",
    });

    setNewCategoryName("");
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const otherCategories = allCategories.filter(
      (cat: Category) => cat.companyId !== currentUser?.companyId || cat.id !== id
    );
    
    const updatedCategories = categories.filter(cat => cat.id !== id);
    localStorage.setItem("categories", JSON.stringify([...otherCategories, ...updatedCategories]));
    setCategories(updatedCategories);
    
    toast({
      title: "Categoria excluída",
      description: "A categoria foi excluída com sucesso.",
    });
  };

  const handleToggleStatus = (id: string) => {
    const allCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const otherCategories = allCategories.filter(
      (cat: Category) => cat.companyId !== currentUser?.companyId || cat.id !== id
    );
    
    const updatedCategories = categories.map(cat =>
      cat.id === id ? { ...cat, status: !cat.status } : cat
    );
    
    localStorage.setItem("categories", JSON.stringify([...otherCategories, ...updatedCategories]));
    setCategories(updatedCategories);
  };

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "active" ? cat.status : !cat.status;
    return matchesSearch && matchesStatus;
  });

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
            <select
              className="border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={category.status}
                      onCheckedChange={() => handleToggleStatus(category.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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