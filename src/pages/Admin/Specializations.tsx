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
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Specialization {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

const Specializations = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    const allSpecializations = JSON.parse(localStorage.getItem("specializations") || "[]");
    const companySpecializations = allSpecializations.filter(
      (spec: Specialization) => spec.companyId === currentUser.companyId
    );
    setSpecializations(companySpecializations);
  }, [currentUser]);

  const handleCreateSpecialization = (name: string) => {
    const allSpecializations = JSON.parse(localStorage.getItem("specializations") || "[]");
    const otherSpecializations = allSpecializations.filter(
      (spec: Specialization) => spec.companyId !== currentUser?.companyId
    );

    const newSpecialization: Specialization = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      status: true,
      companyId: currentUser?.companyId
    };
    
    const updatedSpecializations = [...specializations, newSpecialization];
    localStorage.setItem("specializations", JSON.stringify([...otherSpecializations, ...updatedSpecializations]));
    setSpecializations(updatedSpecializations);
    
    toast({
      title: "Especialização criada",
      description: "A especialização foi criada com sucesso.",
    });
  };

  const handleDeleteSpecialization = (id: string) => {
    const allSpecializations = JSON.parse(localStorage.getItem("specializations") || "[]");
    const otherSpecializations = allSpecializations.filter(
      (spec: Specialization) => spec.companyId !== currentUser?.companyId || spec.id !== id
    );
    
    const updatedSpecializations = specializations.filter(spec => spec.id !== id);
    localStorage.setItem("specializations", JSON.stringify([...otherSpecializations, ...updatedSpecializations]));
    setSpecializations(updatedSpecializations);
    
    toast({
      title: "Especialização excluída",
      description: "A especialização foi excluída com sucesso.",
    });
  };

  const handleToggleStatus = (id: string) => {
    const allSpecializations = JSON.parse(localStorage.getItem("specializations") || "[]");
    const otherSpecializations = allSpecializations.filter(
      (spec: Specialization) => spec.companyId !== currentUser?.companyId || spec.id !== id
    );
    
    const updatedSpecializations = specializations.map(spec =>
      spec.id === id ? { ...spec, status: !spec.status } : spec
    );
    
    localStorage.setItem("specializations", JSON.stringify([...otherSpecializations, ...updatedSpecializations]));
    setSpecializations(updatedSpecializations);
  };

  const filteredSpecializations = specializations.filter(spec => {
    const matchesSearch = spec.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "active" ? spec.status : !spec.status;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Especializações</h1>
          <p className="text-muted-foreground">
            Gerencie as especializações do sistema
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar especializações..."
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
            <Button onClick={() => {
              const name = window.prompt("Digite o nome da especialização:");
              if (name) handleCreateSpecialization(name);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Especialização
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
              {filteredSpecializations.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell>{spec.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={spec.status}
                      onCheckedChange={() => handleToggleStatus(spec.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSpecialization(spec.id)}
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

export default Specializations;