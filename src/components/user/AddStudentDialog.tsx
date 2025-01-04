import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { StudentForm } from "./StudentForm";
import { Student } from "@/types/student";

interface AddStudentDialogProps {
  onStudentAdded: (student: Student) => void;
}

export const AddStudentDialog = ({ onStudentAdded }: AddStudentDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Aluno</DialogTitle>
        </DialogHeader>
        <StudentForm
          onSubmit={(student) => {
            onStudentAdded(student);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};