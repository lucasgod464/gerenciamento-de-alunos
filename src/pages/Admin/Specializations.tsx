import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpecializationHeader } from "@/components/specializations/SpecializationHeader";
import { SpecializationFilters } from "@/components/specializations/SpecializationFilters";
import { SpecializationTable } from "@/components/specializations/SpecializationTable";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSpecializationName, setNewSpecializationName] = useState("");
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

  const handleCreateSpecialization = () => {
    if (!newSpecializationName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da especialização é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    const allSpecializations = JSON.parse(localStorage.getItem("specializations") || "[]");
    const otherSpecializations = allSpecializations.filter(
      (spec: Specialization) => spec.companyId !== currentUser?.companyId
    );

    const newSpecialization: Specialization = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSpecializationName,
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

    setNewSpecializationName("");
    setIsDialogOpen(false);
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
        <SpecializationHeader onOpenDialog={() => setIsDialogOpen(true)} />
        
        <SpecializationFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <SpecializationTable
          specializations={filteredSpecializations}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteSpecialization}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Especialização</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Especialização</Label>
              <Input
                id="name"
                value={newSpecializationName}
                onChange={(e) => setNewSpecializationName(e.target.value)}
                placeholder="Digite o nome da especialização"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSpecialization}>
              Criar Especialização
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Specializations;