import { Student } from "@/types/student";

export interface StudentTableProps {
  students: Student[];
  rooms: { id: string; name: string; }[];
  onDeleteStudent: (id: string) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export function StudentTable({ students, rooms, onDeleteStudent, onUpdateStudent }: StudentTableProps) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Salas Autorizadas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.authorizedRooms.join(", ")}</td>
              <td>
                <button onClick={() => onUpdateStudent(student)}>Editar</button>
                <button onClick={() => onDeleteStudent(student.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
