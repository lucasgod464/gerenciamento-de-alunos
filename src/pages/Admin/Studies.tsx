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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

interface Study {
  id: string;
  name: string;
  status: boolean;
}

const Studies = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [newStudy, setNewStudy] = useState({
    name: "",
    status: true,
  });

  // Carregar estudos do localStorage quando o componente montar
  useEffect(() => {
    const savedStudies = localStorage.getItem("studies");
    if (savedStudies) {
      setStudies(JSON.parse(savedStudies));
    }
  }, []);

  // Salvar estudos no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem("studies", JSON.stringify(studies));
  }, [studies]);

  const handleSave = () => {
    if (editingStudy) {
      setStudies(studies.map(study => 
        study.id === editingStudy.id 
          ? { ...editingStudy, name: newStudy.name, status: newStudy.status }
          : study
      ));
    } else {
      setStudies([...studies, { 
        id: Math.random().toString(36).substr(2, 9),
        name: newStudy.name,
        status: newStudy.status,
      }]);
    }
    setIsDialogOpen(false);
    setNewStudy({ name: "", status: true });
    setEditingStudy(null);
  };

  const handleEdit = (study: Study) => {
    setEditingStudy(study);
    setNewStudy({ name: study.name, status: study.status });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setStudies(studies.filter(study => study.id !== id));
  };

  const filteredStudies = studies.filter(study => {
    const matchesSearch = study.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "active" ? study.status : !study.status;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Estudos</h1>
            <p className="text-muted-foreground">
              Gerencie os estudos do sistema
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Estudo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingStudy ? "Editar Estudo" : "Novo Estudo"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Estudo</Label>
                  <Input
                    id="name"
                    value={newStudy.name}
                    onChange={(e) => setNewStudy({ ...newStudy, name: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="status">Status</Label>
                  <Switch
                    id="status"
                    checked={newStudy.status}
                    onCheckedChange={(checked) => setNewStudy({ ...newStudy, status: checked })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {newStudy.status ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <Button onClick={handleSave} className="w-full">
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estudos..."
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
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Estudo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudies.map((study) => (
                <TableRow key={study.id}>
                  <TableCell>{study.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      study.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {study.status ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(study)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(study.id)}
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
    </DashboardLayout>
  );
};

export default Studies;
