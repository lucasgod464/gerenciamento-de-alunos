import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { SpecializationDialog } from "@/components/specializations/SpecializationDialog";
import { DeleteConfirmDialog } from "@/components/specializations/DeleteConfirmDialog";
import { SpecializationList } from "@/components/specializations/SpecializationList";
import { SpecializationHeader } from "@/components/specializations/SpecializationHeader";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);
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
    if (!name.trim()) {
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
      name: name,
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

    setIsDialogOpen(false);
  };

  const handleEditSpecialization = (name: string) => {
    if (!selectedSpecialization) return;

    const allSpecializations = JSON.parse(localStorage.getItem("specializations") || "[]");
    const otherSpecializations = allSpecializations.filter(
      (spec: Specialization) => spec.companyId !== currentUser?.companyId || spec.id !== selectedSpecialization.id
    );

    const updatedSpecialization = {
      ...selectedSpecialization,
      name
    };

    const updatedSpecializations = specializations.map(spec =>
      spec.id === selectedSpecialization.id ? updatedSpecialization : spec
    );

    localStorage.setItem("specializations", JSON.stringify([...otherSpecializations, ...updatedSpecializations]));
    setSpecializations(updatedSpecializations);

    toast({
      title: "Especialização atualizada",
      description: "A especialização foi atualizada com sucesso.",
    });

    setIsEditDialogOpen(false);
    setSelectedSpecialization(null);
  };

  const handleDeleteSpecialization = () => {
    if (!selectedSpecialization) return;

    const allSpecializations = JSON.parse(localStorage.getItem("specializations") || "[]");
    const otherSpecializations = allSpecializations.filter(
      (spec: Specialization) => spec.companyId !== currentUser?.companyId || spec.id !== selectedSpecialization.id
    );
    
    const updatedSpecializations = specializations.filter(spec => spec.id !== selectedSpecialization.id);
    localStorage.setItem("specializations", JSON.stringify([...otherSpecializations, ...updatedSpecializations]));
    setSpecializations(updatedSpecializations);
    
    toast({
      title: "Especialização excluída",
      description: "A especialização foi excluída com sucesso.",
    });

    setIsDeleteDialogOpen(false);
    setSelectedSpecialization(null);
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
        <SpecializationHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
          onNewClick={() => setIsDialogOpen(true)}
        />

        <SpecializationList
          specializations={filteredSpecializations}
          onEdit={(spec) => {
            setSelectedSpecialization(spec);
            setIsEditDialogOpen(true);
          }}
          onDelete={(spec) => {
            setSelectedSpecialization(spec);
            setIsDeleteDialogOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <SpecializationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleCreateSpecialization}
        mode="create"
      />

      <SpecializationDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedSpecialization(null);
        }}
        onSave={handleEditSpecialization}
        initialName={selectedSpecialization?.name}
        mode="edit"
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedSpecialization(null);
        }}
        onConfirm={handleDeleteSpecialization}
        specializationName={selectedSpecialization?.name || ""}
      />
    </DashboardLayout>
  );
};

export default Specializations;
