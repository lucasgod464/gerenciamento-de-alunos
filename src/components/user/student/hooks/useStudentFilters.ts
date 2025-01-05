import { useState } from "react";
import { Student } from "@/types/student";

export const useStudentFilters = (students: Student[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      ? student.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesRoom = selectedRoom === "all" || student.room === selectedRoom;
    return matchesSearch && matchesRoom;
  });

  return {
    searchTerm,
    setSearchTerm,
    selectedRoom,
    setSelectedRoom,
    filteredStudents,
  };
};