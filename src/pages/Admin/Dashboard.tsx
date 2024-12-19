import { DashboardLayout } from "@/components/DashboardLayout"
import { CompanyStats } from "@/components/companies/CompanyStats"
import { UserStats } from "@/components/users/UserStats"
import { RoomStats } from "@/components/rooms/RoomStats"
import { StudyStats } from "@/components/studies/StudyStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockData = {
  users: {
    total: 150,
    active: 120,
    inactive: 30,
    bySpecialization: [
      { name: "Cardiologia", value: 30 },
      { name: "Neurologia", value: 25 },
      { name: "Pediatria", value: 45 },
      { name: "Ortopedia", value: 20 },
      { name: "Outros", value: 30 },
    ],
  },
  rooms: {
    total: 50,
    active: 45,
    inactive: 5,
  },
  studies: {
    total: 300,
    active: 250,
    inactive: 50,
  },
  students: {
    total: 500,
    active: 450,
    inactive: 50,
  },
}

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Relatório</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema e estatísticas
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="rooms">Salas</TabsTrigger>
            <TabsTrigger value="studies">Estudos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.users.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockData.users.active} ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Salas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.rooms.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockData.rooms.active} ativas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Estudos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.studies.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockData.studies.active} ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Alunos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.students.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockData.students.active} ativos
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Especialização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData.users.bySpecialization}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ativos</span>
                    <span className="font-bold">{mockData.users.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inativos</span>
                    <span className="font-bold">{mockData.users.inactive}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status das Salas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ativas</span>
                    <span className="font-bold">{mockData.rooms.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inativas</span>
                    <span className="font-bold">{mockData.rooms.inactive}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="studies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Estudos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ativos</span>
                    <span className="font-bold">{mockData.studies.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inativos</span>
                    <span className="font-bold">{mockData.studies.inactive}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard