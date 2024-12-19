import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface StudentFormProps {
  onSubmit: (student: any) => void;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    email: "",
    document: "",
    address: "",
    room: "sala1", // Default value to prevent empty selection
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStudent = {
      id: crypto.randomUUID(),
      ...formData,
      status,
      companyId: user?.companyId,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newStudent);
    toast({
      title: "Sucesso!",
      description: "Aluno cadastrado com sucesso.",
    });

    // Reset form
    setFormData({
      name: "",
      birthDate: "",
      email: "",
      document: "",
      address: "",
      room: "sala1", // Reset to default value
    });
    setStatus("active");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const rooms = [
    { id: "sala1", name: "Sala 1" },
    { id: "sala2", name: "Sala 2" },
    { id: "sala3", name: "Sala 3" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input 
              id="name" 
              placeholder="Nome do aluno" 
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input 
              id="birthDate" 
              type="date" 
              value={formData.birthDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="email@exemplo.com" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">CPF/RG</Label>
            <Input 
              id="document" 
              placeholder="000.000.000-00" 
              value={formData.document}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input 
              id="address" 
              placeholder="Rua, número, bairro, cidade, estado" 
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Sala</Label>
            <Select 
              value={formData.room}
              onValueChange={(value) => setFormData(prev => ({ ...prev, room: value }))}
            >
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

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <Switch 
                id="status" 
                checked={status === "active"}
                onCheckedChange={(checked) => setStatus(checked ? "active" : "inactive")}
              />
              <Label htmlFor="status">Ativo</Label>
            </div>
          </div>

          <Button type="submit" className="md:col-span-2">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Aluno
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};