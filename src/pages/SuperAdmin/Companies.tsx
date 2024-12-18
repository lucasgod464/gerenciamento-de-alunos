import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Empresas</h1>
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