import { Student } from "@/types/student";
import { ViewStudentButton } from "./student/actions/ViewStudentButton";
import { EditStudentButton } from "./student/actions/EditStudentButton";
import { TransferStudentButton } from "./student/actions/TransferStudentButton";
import { DeleteStudentButton } from "./student/actions/DeleteStudentButton";

interface StudentTableActionsProps {
  student: Student;
  showTransferOption: boolean;
  onInfoClick: (student: Student) => void;
  onEditClick: (student: Student) => void;
  onDeleteClick: (studentId: string) => void;
  onTransferStudent?: (studentId: string, newRoomId: string) => void;
  rooms: { id: string; name: string }[];
}

export function StudentTableActions({
  student,
  showTransferOption,
  onInfoClick,
  onEditClick,
  onDeleteClick,
  onTransferStudent,
  rooms,
}: StudentTableActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <ViewStudentButton student={student} onView={onInfoClick} />
      <EditStudentButton student={student} onEdit={onEditClick} />
      {showTransferOption && (
        <TransferStudentButton
          student={student}
          rooms={rooms}
          onTransfer={onTransferStudent}
        />
      )}
      <DeleteStudentButton student={student} onDelete={onDeleteClick} />
    </div>
  );
}