import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Building2, Users, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Company {
  id: string;
  name: string;
  users: string;
  rooms: string;
  status: "Ativa" | "Inativa";
  createdAt: string;
}

const initialCompanies: Company[] = [
  {
    id: "460.027.488-14",
    name: "lucas",
    users: "0/100",
    rooms: "0/50",
    status: "Ativa",
    createdAt: "17/12/2024",
  },
];

const Companies = () => {
  const [companies] = useState<Company[]>(initialCompanies);
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gerenciamento de Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as instituições de ensino cadastradas no sistema
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de Empresas
                  </p>
                  <h2 className="text-2xl font-bold">3</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Usuários Ativos
                  </p>
                  <h2 className="text-2xl font-bold">410</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DoorOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de Salas
                  </p>
                  <h2 className="text-2xl font-bold">27</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de Empresas</h2>
          <Button>
            Nova Empresa
          </Button>
        </div>

        <div className="max-w-xl">
          <Input
            placeholder="Buscar empresas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">EMPRESA</th>
                <th className="text-left p-4">USUÁRIOS</th>
                <th className="text-left p-4">SALAS</th>
                <th className="text-left p-4">STATUS</th>
                <th className="text-left p-4">CRIADO EM</th>
                <th className="text-right p-4">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{company.name}</div>
                      <div className="text-sm text-gray-500">ID: {company.id}</div>
                    </div>
                  </td>
                  <td className="p-4">{company.users}</td>
                  <td className="p-4">{company.rooms}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-sm",
                      company.status === "Ativa" 
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {company.status}
                    </span>
                  </td>
                  <td className="p-4">{company.createdAt}</td>
                  <td className="p-4">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Companies;