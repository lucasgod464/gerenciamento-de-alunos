import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useSpecializations } from "@/hooks/useSpecializations";
import { SpecializationDialog } from "@/components/specializations/SpecializationDialog";
import { DeleteConfirmDialog } from "@/components/specializations/DeleteConfirmDialog";
import { SpecializationList } from "@/components/specializations/SpecializationList";
import { SpecializationHeader } from "@/components/specializations/SpecializationHeader";
import { Specialization } from "@/types/specialization";
import { supabase } from "@/integrations/supabase/client";

interface Specialization {
  id: string;
  name: string;
  status: boolean;
  company_id: string;
  created_at: string;
}

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

  const fetchSpecializations = async () => {
    if (!currentUser?.companyId) return;

    try {
      const { data, error } = await supabase
        .from('specializations')
        .select('*')
        .eq('company_id', currentUser.companyId);

      if (error) throw error;
      setSpecializations(data || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar especializações",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, [currentUser]);

  const handleCreateSpecialization = async (name: string) => {
    if (!name.trim() || !currentUser?.companyId) {
      toast({
        title: "Erro",
        description: "O nome da especialização é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('specializations')
        .insert([{
          name: name.trim(),
          status: true,
          company_id: currentUser.companyId
        }]);

      if (error) throw error;

      fetchSpecializations();
      toast({
        title: "Especialização criada",
        description: "A especialização foi criada com sucesso.",
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating specialization:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar especialização",
        variant: "destructive",
      });
    }
  };

  const handleEditSpecialization = async (name: string) => {
    if (!selectedSpecialization || !name.trim()) return;

    try {
      const { error } = await supabase
        .from('specializations')
        .update({ name: name.trim() })
        .eq('id', selectedSpecialization.id);

      if (error) throw error;

      fetchSpecializations();
      toast({
        title: "Especialização atualizada",
        description: "A especialização foi atualizada com sucesso.",
      });

      setIsEditDialogOpen(false);
      setSelectedSpecialization(null);
    } catch (error) {
      console.error('Error updating specialization:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar especialização",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSpecialization = async () => {
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

    try {
      const { error } = await supabase
        .from('specializations')
        .delete()
        .eq('id', selectedSpecialization.id);

      if (error) throw error;

      fetchSpecializations();
      toast({
        title: "Especialização excluída",
        description: "A especialização foi excluída com sucesso.",
      });

      setIsDeleteDialogOpen(false);
      setSelectedSpecialization(null);
    } catch (error) {
      console.error('Error deleting specialization:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir especialização",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const specialization = specializations.find(spec => spec.id === id);
      if (!specialization) return;

      const { error } = await supabase
        .from('specializations')
        .update({ status: !specialization.status })
        .eq('id', id);

      if (error) throw error;

      fetchSpecializations();
    } catch (error) {
      console.error('Error toggling specialization status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da especialização",
        variant: "destructive",
      });
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