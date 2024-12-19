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

export const StudentForm = () => {
  const [status, setStatus] = useState<"active" | "inactive">("active");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" placeholder="Nome do aluno" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input id="birthDate" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@exemplo.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">CPF/RG</Label>
            <Input id="document" placeholder="000.000.000-00" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input id="address" placeholder="Rua, número, bairro, cidade, estado" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Sala</Label>
            <Select defaultValue="sala1">
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sala1">Sala 1</SelectItem>
                <SelectItem value="sala2">Sala 2</SelectItem>
                <SelectItem value="sala3">Sala 3</SelectItem>
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

          <Button className="md:col-span-2">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Aluno
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}