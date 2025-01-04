import { AddStudentDialog } from "./AddStudentDialog";
import { StudentTable } from "./StudentTable";
import { StudentFilters } from "./student/StudentFilters";
import { useStudentManagement } from "./student/useStudentManagement";

export const StudentRegistration = () => {
  const {
    students,
    rooms,
    searchTerm,
    setSearchTerm,
    selectedRoom,
    setSelectedRoom,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateStudent,
  } = useStudentManagement();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <StudentFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRoom={selectedRoom}
          onRoomChange={setSelectedRoom}
          rooms={rooms}
        />
        <AddStudentDialog onStudentAdded={handleAddStudent} />
      </div>
      <StudentTable 
        students={students}
        rooms={rooms}
        onDeleteStudent={handleDeleteStudent}
        onUpdateStudent={handleUpdateStudent}
      />
    </div>
  );
};