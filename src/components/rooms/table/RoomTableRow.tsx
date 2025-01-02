import { Room } from "@/types/room";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoomTableRowProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
  onShowStudents: (room: Room) => void;
}

export const RoomTableRow = ({
  room,
  onEdit,
  onDelete,
  onShowStudents,
}: RoomTableRowProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [teacherName, setTeacherName] = useState("Não atribuído");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategoryAndTeacher = async () => {
      try {
        // Fetch category name
        if (room.category) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('name')
            .eq('id', room.category)
            .single();

          if (categoryError) throw categoryError;
          if (categoryData) setCategoryName(categoryData.name);
        }

        // Fetch teacher from user_authorized_rooms and emails tables
        const { data: authorizedUsers, error: authError } = await supabase
          .from('user_authorized_rooms')
          .select(`
            user_id,
            emails!inner (
              name,
              access_level
            )
          `)
          .eq('room_id', room.id);

        if (authError) throw authError;
        
        const teacher = authorizedUsers?.find(user => 
          user.emails?.access_level === 'Usuário Comum' || 
          user.emails?.access_level === 'Admin'
        );

        if (teacher && teacher.emails) {
          setTeacherName(teacher.emails.name);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar informações da sala",
          variant: "destructive",
        });
      }
    };

    fetchCategoryAndTeacher();
  }, [room, toast]);

  return (
    <TableRow key={room.id}>
      <TableCell>{room.name}</TableCell>
      <TableCell>{room.schedule}</TableCell>
      <TableCell>{room.location}</TableCell>
      <TableCell>{categoryName}</TableCell>
      <TableCell>{teacherName}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShowStudents(room)}
        >
          <Users className="h-4 w-4 mr-2" />
          Ver Alunos
        </Button>
      </TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            room.status
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {room.status ? "Ativa" : "Inativa"}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(room)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(room.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};