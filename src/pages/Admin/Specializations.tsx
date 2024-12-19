import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, X, Check } from "lucide-react";

interface Specialization {
  id: number;
  name: string;
  status: "active" | "inactive";
}

const Specializations = () => {
  const [newSpecializationName, setNewSpecializationName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [specializations, setSpecializations] = useState<Specialization[]>([
    { id: 1, name: "Cardiologia", status: "active" },
    { id: 2, name: "Neurologia", status: "inactive" },
  ]);

  const handleCreateSpecialization = () => {
    if (!newSpecializationName.trim()) return;
    
    const newSpecialization: Specialization = {
      id: specializations.length + 1,
      name: newSpecializationName.trim(),
      status: "active",
    };
    
    setSpecializations([...specializations, newSpecialization]);
    setNewSpecializationName("");
  };

  const handleDeleteSpecialization = (id: number) => {
    setSpecializations(specializations.filter(spec => spec.id !== id));
  };

  const startEditing = (specialization: Specialization) => {
    setEditingId(specialization.id);
    setEditingName(specialization.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEditing = (id: number) => {
    if (!editingName.trim()) return;
    
    setSpecializations(specializations.map(spec =>
      spec.id === id ? { ...spec, name: editingName.trim() } : spec
    ));
    setEditingId(null);
    setEditingName("");
  };

  const toggleStatus = (id: number) => {
    setSpecializations(specializations.map(spec =>
      spec.id === id
        ? { ...spec, status: spec.status === "active" ? "inactive" : "active" }
        : spec
    ));
  };

  const filteredSpecializations = specializations.filter(spec =>
    spec.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Especializações</h1>
          <p className="text-muted-foreground">
            Gerencie as especializações do sistema
          </p>
        </div>

        {/* Create Specialization Form */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Criar Nova Especialização</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Nome da especialização"
              value={newSpecializationName}
              onChange={(e) => setNewSpecializationName(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleCreateSpecialization}>Salvar</Button>
          </div>
        </div>

        {/* Manage Specializations */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gerenciar Especializações</h2>
          
          {/* Search Bar */}
          <div className="mb-4">
            <Input
              placeholder="Buscar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Specializations Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpecializations.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell>
                    {editingId === spec.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="max-w-[200px]"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => saveEditing(spec.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      spec.name
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={spec.status === "active"}
                      onCheckedChange={() => toggleStatus(spec.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingId !== spec.id && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(spec)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSpecialization(spec.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Specializations;