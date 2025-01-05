import { useState, useMemo } from "react";
import { Student } from "@/types/student";

export const useStudentFilters = (students: Student[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRoom = !selectedRoom || student.room === selectedRoom;
      return matchesSearch && matchesRoom;
    });
  }, [students, searchTerm, selectedRoom]);

  return {
    searchTerm,
    setSearchTerm,
    selectedRoom,
    setSelectedRoom,
    filteredStudents,
  };
};