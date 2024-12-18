import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Building2, Users, DoorOpen, RotateCcw, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Company {
  id: string;
  name: string;
  document: string;
  usersLimit: number;
  currentUsers: number;
  roomsLimit: number;
  currentRooms: number;
  status: "Ativa" | "Inativa";
  createdAt: string;
  publicFolderPath: string;
}

const initialCompanies: Company[] = [
  {
    id: "460027488",
    name: "Empresa Exemplo",
    document: "46.002.748/0001-14",
    usersLimit: 100,
    currentUsers: 45,
    roomsLimit: 50,
    currentRooms: 27,
    status: "Ativa",
    createdAt: "17/12/2024",
    publicFolderPath: "/storage/460027488",
  },
];

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const { toast } = useToast();

  const handleCreateCompany = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCompany: Company = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get("name") as string,
      document: formData.get("document") as string,
      usersLimit: Number(formData.get("usersLimit")),
      currentUsers: 0,
      roomsLimit: Number(formData.get("roomsLimit")),
      currentRooms: 0,
      status: "Ativa",
      createdAt: new Date().toLocaleDateString(),
      publicFolderPath: `/storage/${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setCompanies([...companies, newCompany]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Empresa criada",
      description: "A empresa foi criada com sucesso.",
    });
  };

  const handleUpdateCompany = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCompany) return;

    const formData = new FormData(event.currentTarget);
    const updatedCompanies = companies.map((company) =>
      company.id === editingCompany.id
        ? {
            ...company,
            name: formData.get("name") as string,
            usersLimit: Number(formData.get("usersLimit")),
            roomsLimit: Number(formData.get("roomsLimit")),
          }
        : company
    );

    setCompanies(updatedCompanies);
    setEditingCompany(null);
    toast({
      title: "Empresa atualizada",
      description: "As informações da empresa foram atualizadas com sucesso.",
    });
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter((company) => company.id !== id));
    toast({
      title: "Empresa excluída",
      description: "A empresa foi excluída permanentemente.",
      variant: "destructive",
    });
  };

  const handleResetCompany = (id: string) => {
    const updatedCompanies = companies.map((company) =>
      company.id === id
        ? {
            ...company,
            currentUsers: 0,
            currentRooms: 0,
            status: "Ativa" as const,
          }
        : company
    );
    setCompanies(updatedCompanies);
    toast({
      title: "Empresa resetada",
      description: "A empresa foi restaurada para as configurações padrão.",
    });
  };

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
                  <h2 className="text-2xl font-bold">{companies.length}</h2>
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
                  <h2 className="text-2xl font-bold">
                    {companies.reduce((acc, company) => acc + company.currentUsers, 0)}
                  </h2>
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
                  <h2 className="text-2xl font-bold">
                    {companies.reduce((acc, company) => acc + company.currentRooms, 0)}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de Empresas</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Nova Empresa</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Empresa</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar uma nova empresa no sistema.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCompany} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="document">Documento (CPF/CNPJ)</Label>
                  <Input id="document" name="document" required />
                </div>
                <div>
                  <Label htmlFor="usersLimit">Limite de Usuários</Label>
                  <Input
                    id="usersLimit"
                    name="usersLimit"
                    type="number"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="roomsLimit">Limite de Salas</Label>
                  <Input
                    id="roomsLimit"
                    name="roomsLimit"
                    type="number"
                    min="1"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Criar Empresa</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xl">
          <Input
            placeholder="Buscar empresas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      <div className="text-sm text-gray-500">
                        ID: {company.id}
                        <br />
                        <span className="flex items-center gap-1">
                          <Folder className="w-4 h-4" />
                          {company.publicFolderPath}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {company.currentUsers}/{company.usersLimit}
                  </td>
                  <td className="p-4">
                    {company.currentRooms}/{company.roomsLimit}
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-sm",
                        company.status === "Ativa"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="p-4">{company.createdAt}</td>
                  <td className="p-4">
                    <div className="flex justify-end space-x-2">
                      <Dialog
                        open={editingCompany?.id === company.id}
                        onOpenChange={(open) =>
                          setEditingCompany(open ? company : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Empresa</DialogTitle>
                            <DialogDescription>
                              Modifique os dados da empresa.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleUpdateCompany} className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name">Nome da Empresa</Label>
                              <Input
                                id="edit-name"
                                name="name"
                                defaultValue={company.name}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-usersLimit">
                                Limite de Usuários
                              </Label>
                              <Input
                                id="edit-usersLimit"
                                name="usersLimit"
                                type="number"
                                min="1"
                                defaultValue={company.usersLimit}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-roomsLimit">
                                Limite de Salas
                              </Label>
                              <Input
                                id="edit-roomsLimit"
                                name="roomsLimit"
                                type="number"
                                min="1"
                                defaultValue={company.roomsLimit}
                                required
                              />
                            </div>
                            <DialogFooter>
                              <Button type="submit">Salvar Alterações</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-yellow-100 hover:text-yellow-600"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Resetar Empresa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Isso irá restaurar a empresa para as configurações
                              padrão. Todos os dados serão mantidos, mas os
                              contadores serão zerados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleResetCompany(company.id)}
                            >
                              Resetar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Empresa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Isso excluirá
                              permanentemente a empresa e todos os dados
                              associados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCompany(company.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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