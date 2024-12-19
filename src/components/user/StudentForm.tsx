import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Student } from "@/types/student";
import { FormField } from "@/types/form";

interface StudentFormProps {
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;
    
    // Carrega as salas
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      const allRooms = JSON.parse(storedRooms);
      const companyRooms = allRooms.filter(
        (room: any) => room.companyId === currentUser.companyId
      );
      setRooms(companyRooms);
      if (companyRooms.length > 0) {
        setSelectedRoom(companyRooms[0].id);
      }
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      room: selectedRoom,
      status: status,
      createdAt: new Date().toISOString(),
      companyId: currentUser?.companyId || null,
    };

    onSubmit(newStudent);
    e.currentTarget.reset();
    setStatus("active");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" name="fullName" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input id="birthDate" name="birthDate" type="date" required />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value: "active" | "inactive") => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Sala</Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sala" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Aluno
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};