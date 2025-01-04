import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StudentForm } from "../../StudentForm";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedStudent: Student) => void;
}

export function EditStudentDialog({ student, open, onOpenChange, onSuccess }: EditStudentDialogProps) {
  const { toast } = useToast();

  const handleSubmit = async (updatedStudent: Student) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update({
          name: updatedStudent.name,
          birth_date: updatedStudent.birth_date,
          status: updatedStudent.status,
          email: updatedStudent.email,
          document: updatedStudent.document,
          address: updatedStudent.address,
          custom_fields: updatedStudent.custom_fields
        })
        .eq('id', updatedStudent.id)
        .select()
        .single();

      if (error) throw error;

      if (updatedStudent.room) {
        // Primeiro remove qualquer vinculação existente
        await supabase
          .from('room_students')
          .delete()
          .eq('student_id', updatedStudent.id);

        // Depois adiciona a nova vinculação
        const { error: roomError } = await supabase
          .from('room_students')
          .insert({
            student_id: updatedStudent.id,
            room_id: updatedStudent.room
          });

        if (roomError) throw roomError;
      }

      onSuccess(updatedStudent);
      onOpenChange(false);
      toast({
        title: "Sucesso",
        description: "Dados do aluno atualizados com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados do aluno",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Aluno</DialogTitle>
          <DialogDescription>
            Atualize as informações do aluno no formulário abaixo.
          </DialogDescription>
        </DialogHeader>
        {student && (
          <StudentForm
            initialData={student}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}