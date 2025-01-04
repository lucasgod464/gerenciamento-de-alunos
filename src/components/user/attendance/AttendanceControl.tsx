import { useEffect, useState } from "react";
import { AttendanceHeader } from "./AttendanceHeader";
import { AttendanceList } from "./AttendanceList";
import { Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";

export function AttendanceControl() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (selectedCategory && user?.companyId) {
      const fetchStudents = async () => {
        try {
          const { data: roomStudents, error } = await supabase
            .from('room_students')
            .select(`
              student:students (
                id,
                name,
                birth_date,
                status,
                email,
                document,
                address,
                custom_fields,
                company_id,
                created_at
              )
            `)
            .eq('room_id', selectedCategory);

          if (error) throw error;

          const students = roomStudents
            .map(rs => rs.student)
            .filter((student): student is Student => student !== null);

          setStudents(students);
        } catch (error) {
          console.error('Erro ao buscar alunos:', error);
          toast({
            title: "Erro ao carregar alunos",
            description: "Não foi possível carregar a lista de alunos.",
            variant: "destructive",
          });
        }
      };

      fetchStudents();
    }
  }, [selectedCategory, user?.companyId, toast]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAttendanceSaved = () => {
    // Recarregar dados se necessário
  };

  return (
    <div className="space-y-6">
      <AttendanceHeader
        onDateChange={handleDateChange}
        onCategoryChange={handleCategoryChange}
      />
      
      {selectedCategory && students.length > 0 ? (
        <Card className="p-4">
          <AttendanceList
            students={students}
            date={selectedDate}
            onSave={handleAttendanceSaved}
          />
        </Card>
      ) : (
        <Card className="p-8">
          <p className="text-center text-muted-foreground">
            Selecione uma categoria para ver a lista de alunos
          </p>
        </Card>
      )}
    </div>
  );
}