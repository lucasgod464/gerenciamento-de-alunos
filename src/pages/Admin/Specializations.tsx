import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useSpecializations } from "@/hooks/useSpecializations";
import { SpecializationDialog } from "@/components/specializations/SpecializationDialog";
import { DeleteConfirmDialog } from "@/components/specializations/DeleteConfirmDialog";
import { SpecializationList } from "@/components/specializations/SpecializationList";
import { SpecializationHeader } from "@/components/specializations/SpecializationHeader";
import { Specialization } from "@/types/specialization";

const Specializations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);
  
  const { user: currentUser } = useAuth();
  const { 
    specializations,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization,
    toggleStatus
  } = useSpecializations();

  const handleCreateSpecialization = (name: string) => {
    if (!currentUser?.companyId) return;
    createSpecialization({ name, companyId: currentUser.companyId });
    setIsDialogOpen(false);
  };

  const handleEditSpecialization = (name: string) => {
    if (!selectedSpecialization) return;
    updateSpecialization({ id: selectedSpecialization.id, name });
    setIsEditDialogOpen(false);
    setSelectedSpecialization(null);
  };

  const handleDeleteSpecialization = () => {
    if (!selectedSpecialization) return;
    deleteSpecialization(selectedSpecialization.id);
    setIsDeleteDialogOpen(false);
    setSelectedSpecialization(null);
  };

  const handleToggleStatus = (id: string) => {
    const spec = specializations.find(s => s.id === id);
    if (spec) {
      toggleStatus({ id, status: !spec.status });
    }
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
      </div>
    </DashboardLayout>
  );
};

export default Specializations;
