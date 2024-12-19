import { useState, useEffect } from "react";
import { StudentForm } from "./StudentForm";
import { StudentTable } from "./StudentTable";
import { Student } from "@/types/student";
import { useAuth } from "@/hooks/useAuth";

export const StudentRegistration = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      const allStudents = JSON.parse(savedStudents);
      const companyStudents = allStudents.filter(
        (student: Student) => student.companyId === currentUser.companyId
      );
      setStudents(companyStudents);
    }
  }, [currentUser]);

  const handleAddStudent = (newStudent: Student) => {
    const updatedStudent = {
      ...newStudent,
      companyId: currentUser?.companyId || null,
    };
    
    const updatedStudents = [...students, updatedStudent];
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
  };

  return (
    <div className="space-y-6">
      <StudentForm onSubmit={handleAddStudent} />
      <StudentTable students={students} />
    </div>
  );
};