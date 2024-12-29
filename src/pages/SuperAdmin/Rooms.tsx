import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Building2, Users, School2, Activity, GraduationCap } from "lucide-react";
import { Room } from "@/types/room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SuperAdminRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    activeRooms: 0,
    totalCompanies: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    // Get all rooms from localStorage
    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    setRooms(allRooms);

    // Calculate stats
    const activeRooms = allRooms.filter((room: Room) => room.status).length;
    const uniqueCompanies = new Set(allRooms.map((room: Room) => room.companyId)).size;
    const totalStudents = allRooms.reduce((acc: number, room: Room) => {
      return acc + (room.students?.length || 0);
    }, 0);

    setStats({
      totalRooms: allRooms.length,
      activeRooms,
      totalCompanies: uniqueCompanies,
      totalStudents,
    });
  }, []);

  // Filter rooms based on search term and type
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.companyId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "active" && room.status) ||
                         (filterType === "inactive" && !room.status);
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout role="super-admin">
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Salas</h1>
            <p className="text-muted-foreground">
              Gerencie e monitore todas as salas do sistema
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-white shadow-md border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Salas</CardTitle>
                <School2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRooms}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Distribuídas em {stats.totalCompanies} empresas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-green-500/10 hover:border-green-500/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salas Ativas</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeRooms}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.activeRooms / stats.totalRooms) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-orange-500/10 hover:border-orange-500/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salas Inativas</CardTitle>
                <Building2 className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRooms - stats.activeRooms}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.totalRooms - stats.activeRooms) / stats.totalRooms * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-blue-500/10 hover:border-blue-500/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                <GraduationCap className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Média de {(stats.totalStudents / stats.totalRooms || 0).toFixed(1)} por sala
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome da sala ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={setFilterType}
          >
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as salas</SelectItem>
              <SelectItem value="active">Salas ativas</SelectItem>
              <SelectItem value="inactive">Salas inativas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rooms Table */}
        <Card className="border border-gray-100 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-[200px] py-4 text-sm font-semibold text-gray-700">Nome da Sala</TableHead>
                  <TableHead className="py-4 text-sm font-semibold text-gray-700">Empresa</TableHead>
                  <TableHead className="py-4 text-sm font-semibold text-gray-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow 
                    key={room.id} 
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="py-4 font-medium text-gray-900">{room.name}</TableCell>
                    <TableCell className="py-4 text-gray-600">{room.companyId || "Sem empresa"}</TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          room.status
                            ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                            : "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20"
                        }`}
                      >
                        {room.status ? "Ativa" : "Inativa"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRooms.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={3} 
                      className="h-32 text-center text-gray-500"
                    >
                      Nenhuma sala encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
