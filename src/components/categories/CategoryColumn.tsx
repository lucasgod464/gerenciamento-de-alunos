import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, Edit2, Trash2, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  const getTotalStudents = () => {
    return rooms.reduce((total, room) => total + (room.students?.length || 0), 0);
  };

  const getStudentsCount = (room: Room) => {
    return room.students?.length || 0;
  };

  return (
    <div className="flex-none w-[350px]">
      <div 
        className="p-4 rounded-lg mb-4 shadow-lg transition-all duration-200 hover:shadow-xl"
        style={{ 
          backgroundColor: category.color || '#f3f4f6',
          opacity: 0.95
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
        
        <div className="flex items-center gap-4 mb-4 p-3 bg-white/30 rounded-lg">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4" />
            <span className="text-sm font-medium">
              {rooms.length} {rooms.length === 1 ? 'sala' : 'salas'}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm font-medium">
              {getTotalStudents()} {getTotalStudents() === 1 ? 'aluno' : 'alunos'}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          {rooms.map((room) => (
            <Card key={room.id} className="bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-colors">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    {room.name}
                  </div>
                  <span className="text-xs bg-white/60 px-2 py-1 rounded-full">
                    {getStudentsCount(room)} alunos
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-medium text-xs text-foreground/70">Horário</p>
                    <p>{room.schedule}</p>
                  </div>
                  <div>
                    <p className="font-medium text-xs text-foreground/70">Local</p>
                    <p>{room.location}</p>
                  </div>
                </div>
                <Separator className="my-2" />
                <div>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Users className="h-4 w-4" />
                    <span className="font-medium text-xs text-foreground/70">Usuários Vinculados</span>
                  </div>
                  <p className="pl-6 text-sm">{getAuthorizedUserNames(room)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};