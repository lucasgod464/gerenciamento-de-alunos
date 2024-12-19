import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StudiesTable } from "@/components/studies/StudiesTable";
import { Study } from "@/types/study";
import { useQuery } from "@tanstack/react-query";

const Studies = () => {
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: studies = [] } = useQuery({
    queryKey: ["studies"],
    queryFn: () => {
      const storedStudies = localStorage.getItem("studies");
      return storedStudies ? JSON.parse(storedStudies) : [];
    },
  });

  const handleEdit = (id: string) => {
    const studyToEdit = studies.find(study => study.id === id);
    if (studyToEdit) {
      setEditingStudy(studyToEdit);
      setIsEditDialogOpen(true);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold mb-2">Gerenciamento de Estudos</h1>
        <p className="text-muted-foreground">
          Gerencie todos os estudos cadastrados no sistema
        </p>
        <StudiesTable
          studies={studies}
          onEdit={handleEdit}
        />
      </div>
    </DashboardLayout>
  );
};

export default Studies;
