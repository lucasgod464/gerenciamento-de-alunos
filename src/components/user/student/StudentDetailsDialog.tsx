import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Student } from "@/types/student";
import { StudentSearch } from "./details/StudentSearch";
import { AttendanceDetails } from "./details/AttendanceDetails";

interface StudentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function StudentDetailsDialog({ open, onClose }: StudentDetailsDialogProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Consulta Individual de Aluno</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <StudentSearch onSelectStudent={setSelectedStudent} />

          {selectedStudent && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-lg">{selectedStudent.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedStudent.email || 'Email não cadastrado'}
                </p>
              </div>

              <AttendanceDetails studentId={selectedStudent.id} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}