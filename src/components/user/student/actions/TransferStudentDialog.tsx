import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TransferStudentDialogProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransferStudent?: (studentId: string, newRoomId: string) => void;
  rooms: { id: string; name: string }[];
}

export function TransferStudentDialog({
  student,
  open,
  onOpenChange,
  onTransferStudent,
  rooms,
}: TransferStudentDialogProps) {
  const [selectedRoom, setSelectedRoom] = useState("");
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (selectedRoom && onTransferStudent) {
      try {
        await supabase
          .from('room_students')
          .delete()
          .eq('student_id', student.id);

        const { error } = await supabase
          .from('room_students')
          .insert({
            student_id: student.id,
            room_id: selectedRoom
          });

        if (error) throw error;

        onTransferStudent(student.id, selectedRoom);
        onOpenChange(false);
        setSelectedRoom("");
        toast({
          title: "Sucesso",
          description: "Aluno transferido com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao transferir aluno:", error);
        toast({
          title: "Erro",
          description: "Erro ao transferir aluno",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Aluno</DialogTitle>
          <DialogDescription>
            Selecione a sala para onde deseja transferir o aluno {student.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma sala" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            className="w-full" 
            onClick={handleTransfer}
            disabled={!selectedRoom}
          >
            Confirmar Transferência
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}