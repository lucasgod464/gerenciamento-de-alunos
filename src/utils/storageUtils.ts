interface StorageRoom {
  id: string;
  name: string;
  students: string[];
  // ... outros campos da sala
}

export const saveStudentToRoom = (studentId: string, roomId: string, companyId: string | null) => {
  const rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
  const updatedRooms = rooms.map((room: StorageRoom) => {
    if (room.id === roomId && room.companyId === companyId) {
      // Adiciona o ID do estudante à sala se ainda não existir
      if (!room.students) {
        room.students = [];
      }
      if (!room.students.includes(studentId)) {
        room.students = [...room.students, studentId];
      }
    }
    return room;
  });
  
  localStorage.setItem("rooms", JSON.stringify(updatedRooms));
};

export const removeStudentFromRoom = (studentId: string, roomId: string) => {
  const rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
  const updatedRooms = rooms.map((room: StorageRoom) => {
    if (room.id === roomId && room.students) {
      room.students = room.students.filter(id => id !== studentId);
    }
    return room;
  });
  
  localStorage.setItem("rooms", JSON.stringify(updatedRooms));
};