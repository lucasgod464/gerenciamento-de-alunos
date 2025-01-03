import { DashboardLayout } from "@/components/DashboardLayout";
import { StudyStats } from "@/components/studies/StudyStats";
import { StudiesTable } from "@/components/studies/StudiesTable";
import { useEffect, useState } from "react";
import { Study } from "@/types/study";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Studies() {
  const [studies, setStudies] = useState<Study[]>([]);
  const { user: currentUser } = useAuth();

  const fetchStudies = async () => {
    if (!currentUser?.companyId) return;

    const { data, error } = await supabase
      .from('studies')
      .select('*')
      .eq('company_id', currentUser.companyId);

    if (error) {
      console.error('Error fetching studies:', error);
      return;
    }

    if (data) {
      setStudies(data as Study[]);
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

        <StudyStats studies={studies} />
        <StudiesTable 
          studies={studies} 
          onStudiesChange={fetchStudies}
        />
      </div>
    </DashboardLayout>
  );
}