import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tag, Trash2, Edit2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface TagType {
  id: number;
  name: string;
  description: string;
  color: string;
  status: boolean;
}

const Tags = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedColor, setSelectedColor] = useState("");
  const [editingTag, setEditingTag] = useState<TagType | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#8E9196");
  const [status, setStatus] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTag) {
      // Update existing tag
      setTags(tags.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, name, description, color, status }
          : tag
      ));
      setEditingTag(null);
    } else {
      // Create new tag
      const newTag: TagType = {
        id: Date.now(),
        name,
        description,
        color,
        status,
      };
      setTags([...tags, newTag]);
    }

    // Reset form
    setName("");
    setDescription("");
    setColor("#8E9196");
    setStatus(true);
  };

  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
    setName(tag.name);
    setDescription(tag.description);
    setColor(tag.color);
    setStatus(tag.status);
  };

  const handleDelete = (id: number) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "active" ? tag.status : !tag.status;
    const matchesColor = !selectedColor || tag.color === selectedColor;
    
    return matchesSearch && matchesStatus && matchesColor;
  });

  const colors = [
    "#8E9196", "#9b87f5", "#7E69AB", "#6E59A5", "#1A1F2C",
    "#D6BCFA", "#F2FCE2", "#FEF7CD", "#FEC6A1", "#E5DEFF",
    "#FFDEE2", "#FDE1D3", "#D3E4FD", "#F1F0FB", "#8B5CF6"
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Etiquetas</h1>
          <p className="text-muted-foreground">
            Gerencie as etiquetas do sistema
          </p>
        </div>

        {/* Create/Edit Tag Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editingTag ? "Editar Etiqueta" : "Criar Etiqueta"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Etiqueta</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        color === c ? "border-black" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={status}
                    onCheckedChange={setStatus}
                  />
                  <span>{status ? "Ativa" : "Inativa"}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              {editingTag && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingTag(null);
                    setName("");
                    setDescription("");
                    setColor("#8E9196");
                    setStatus(true);
                  }}
                >
                  Cancelar
                </Button>
              )}
              <Button type="submit">
                {editingTag ? "Salvar Alterações" : "Criar Etiqueta"}
              </Button>
            </div>
          </form>
        </div>

        {/* Tags Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gerenciar Etiquetas</h2>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>

            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option value="">Todas as cores</option>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Etiqueta</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Tag size={16} style={{ color: tag.color }} />
                      <span>{tag.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tag.description}</TableCell>
                  <TableCell>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tag.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tag.status ? "Ativa" : "Inativa"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tag)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default Tags;