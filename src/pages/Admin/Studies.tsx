import { DashboardLayout } from "@/components/DashboardLayout";
import { StudiesTable } from "@/components/studies/StudiesTable";
import { StudyStats } from "@/components/studies/StudyStats";
import { Study, StudyStatus } from "@/types/study";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Studies = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadStudies();
  }, []);

  const loadStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedStudies: Study[] = (data || []).map(study => ({
        id: study.id,
        name: study.name,
        status: study.status as StudyStatus,
        startDate: study.start_date,
        endDate: study.end_date,
        companyId: study.company_id,
        createdAt: study.created_at,
      }));

      setStudies(mappedStudies);
    } catch (error) {
      console.error('Error loading studies:', error);
      toast({
        title: "Erro ao carregar estudos",
        description: "Não foi possível carregar a lista de estudos.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Estudos</h2>
        </div>
        <StudyStats studies={studies} />
        <StudiesTable studies={studies} onStudiesChange={loadStudies} />
      </div>
    </DashboardLayout>
  );
};

export default Studies;