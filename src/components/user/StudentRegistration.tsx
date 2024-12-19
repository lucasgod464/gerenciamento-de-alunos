import { useState, useEffect } from "react";
import { StudentForm } from "./StudentForm";
import { StudentTable } from "./StudentTable";
import { Student } from "@/types/student";
import { useAuth } from "@/hooks/useAuth";

export const StudentRegistration = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      const parsedStudents = JSON.parse(savedStudents);
      if (user?.companyId) {
        const companyStudents = parsedStudents.filter(
          (student: Student) => student.companyId === user.companyId
        );
        setStudents(companyStudents);
      }
    }
  }, [user]);

  const handleAddStudent = (newStudent: Student) => {
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    
    // Save to localStorage including students from other companies
    const savedStudents = localStorage.getItem("students");
    const allStudents = savedStudents ? JSON.parse(savedStudents) : [];
    const otherCompaniesStudents = allStudents.filter(
      (student: Student) => student.companyId !== user?.companyId
    );
    
    localStorage.setItem(
      "students",
      JSON.stringify([...otherCompaniesStudents, ...updatedStudents])
    );
  };

  return (
    <div className="space-y-6">
      <StudentForm onSubmit={handleAddStudent} />
      <StudentTable students={students} />
    </div>
  );
};