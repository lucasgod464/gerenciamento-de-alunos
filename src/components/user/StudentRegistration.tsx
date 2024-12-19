import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload,
  Download,
  Search,
  Plus,
  Trash2,
  FileSpreadsheet
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  birthDate: string;
  email: string;
  document: string;
  address: string;
  room: string;
  status: "active" | "inactive";
}

export const StudentRegistration = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const { toast } = useToast();

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would implement the CSV parsing logic
      toast({
        title: "Importação iniciada",
        description: "Processando arquivo CSV..."
      });
    }
  };

  const handleExportCSV = () => {
    // Here you would implement the CSV export logic
    toast({
      title: "Exportação iniciada",
      description: "Gerando arquivo CSV..."
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      setStudents(students.filter(student => student.id !== studentId));
      toast({
        title: "Aluno excluído",
        description: "O aluno foi removido com sucesso"
      });
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = roomFilter === "" || student.room === roomFilter;
    return matchesSearch && matchesRoom;
  });

  return (
    <div className="space-y-6">
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
              <Select>
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
                <Switch id="status" />
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar alunos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={roomFilter} onValueChange={setRoomFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por sala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as salas</SelectItem>
                  <SelectItem value="sala1">Sala 1</SelectItem>
                  <SelectItem value="sala2">Sala 2</SelectItem>
                  <SelectItem value="sala3">Sala 3</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="csv-upload"
                  onChange={handleImportCSV}
                />
                <Label htmlFor="csv-upload">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Importar CSV
                    </span>
                  </Button>
                </Label>
                <Button variant="outline" onClick={handleExportCSV}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exportar CSV
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.room}</TableCell>
                    <TableCell>
                      <Switch
                        checked={student.status === "active"}
                        onCheckedChange={(checked) => {
                          const newStatus = checked ? "active" : "inactive";
                          setStudents(students.map(s => 
                            s.id === student.id ? {...s, status: newStatus} : s
                          ));
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};