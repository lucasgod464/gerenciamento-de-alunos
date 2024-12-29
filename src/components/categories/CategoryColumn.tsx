import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";

interface CategoryColumnProps {
  category: Category;
  rooms: Room[];
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryColumn = ({ category, rooms, onEdit, onDelete }: CategoryColumnProps) => {
  const { user: currentUser } = useAuth();

  const getAuthorizedUserNames = (room: Room) => {
    if (!currentUser?.companyId) return "Nenhum usuário vinculado";

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const authorizedUsers = allUsers.filter((user: any) => 
      user.companyId === currentUser.companyId && 
      user.authorizedRooms?.includes(room.id)
    );

    if (authorizedUsers.length === 0) return "Nenhum usuário vinculado";
    return authorizedUsers.map(user => user.name).join(", ");
  };

  const getStudentsCount = (room: Room) => {
    return room.students?.length || 0;
  };

  return (
    <div 
      className="flex-none w-[350px]"
    >
      <div 
        className="p-4 rounded-lg mb-4"
        style={{ 
          backgroundColor: category.color || '#f3f4f6',
          opacity: 0.9
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="hover:bg-white/20"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="hover:bg-white/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4">
          {rooms.length} {rooms.length === 1 ? 'sala' : 'salas'}
        </div>
        
        <div className="space-y-3">
          {rooms.map((room) => (
            <Card key={room.id} className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <School className="h-4 w-4" />
                  {room.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
                <p>Horário: {room.schedule}</p>
                <p>Local: {room.location}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>Usuários Vinculados:</span>
                </div>
                <p className="pl-6 text-sm">{getAuthorizedUserNames(room)}</p>
                <p className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  <span>Total de Alunos: {getStudentsCount(room)}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};