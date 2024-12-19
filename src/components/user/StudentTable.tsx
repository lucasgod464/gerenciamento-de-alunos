import { useState } from "react";
import { Input } from "@/components/ui/input";
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
  Search,
  Trash2,
  FileSpreadsheet
} from "lucide-react";
import { Label } from "@/components/ui/label";

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

export const StudentTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const { toast } = useToast();

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Importação iniciada",
        description: "Processando arquivo CSV..."
      });
    }
  };

  const handleExportCSV = () => {
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
    <div className="space-y-4">
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
            <SelectItem value="all">Todas as salas</SelectItem>
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
  );
};