import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StudyStats } from "@/components/studies/StudyStats";
import { StudiesTable } from "@/components/studies/StudiesTable";
import { Study } from "@/types/study";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Studies() {
  const { user: currentUser } = useAuth();
  const [studies, setStudies] = useState<Study[]>([]);

  const fetchStudies = async () => {
    if (!currentUser?.companyId) return;

    const { data: studiesData, error } = await supabase
      .from('studies')
      .select('*')
      .eq('company_id', currentUser.companyId);

    if (error) {
      console.error('Error fetching studies:', error);
      return;
    }

    if (studiesData) {
      const mappedStudies: Study[] = studiesData.map(study => ({
        id: study.id,
        name: study.name,
        status: study.status as Study['status'],
        startDate: study.start_date,
        endDate: study.end_date,
        companyId: study.company_id,
        createdAt: study.created_at
      }));
      setStudies(mappedStudies);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, [currentUser]);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Estudos</h1>
          <p className="text-muted-foreground">
            Gerencie os estudos do sistema
          </p>
        </div>

        <StudyStats
          totalStudies={studies.length}
          activeStudies={studies.filter(s => s.status === 'active').length}
        />

        <StudiesTable
          studies={studies}
          onEdit={(id) => console.log('Edit study:', id)}
        />
      </div>
    </DashboardLayout>
  );
}