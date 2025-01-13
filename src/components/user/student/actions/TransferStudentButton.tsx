import { useState } from "react";
import { ArrowRightFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";

interface TransferStudentButtonProps {
  student: Student;
  rooms: { id: string; name: string }[];
  onTransfer?: (studentId: string, newRoomId: string) => void;
}

export function TransferStudentButton({
  student,
  rooms,
  onTransfer,
}: TransferStudentButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (selectedRoom && onTransfer) {
      try {
        await onTransfer(student.id, selectedRoom);
        setShowDialog(false);
        setSelectedRoom("");
        toast({
          title: "Sucesso",
          description: "Aluno transferido com sucesso!",
        });
      } catch (error) {
        console.error('Erro ao transferir aluno:', error);
        toast({
          title: "Erro",
          description: "Não foi possível transferir o aluno.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setShowDialog(true)}
            >
              <ArrowRightFromLine className="mr-2 h-4 w-4" />
              Transferir
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Transferir aluno para uma sala</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transferir Aluno</DialogTitle>
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
    </>
  );
}
