import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Trash2, Edit2 } from "lucide-react";

interface TagType {
  id: number;
  name: string;
  description: string;
  color: string;
  status: boolean;
}

interface TagListProps {
  tags: TagType[];
  onEdit: (tag: TagType) => void;
  onDelete: (id: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: "all" | "active" | "inactive";
  setStatusFilter: (status: "all" | "active" | "inactive") => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export const TagList = ({
  tags,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  selectedColor,
  setSelectedColor
}: TagListProps) => {
  const colors = [
    "#8E9196", "#9b87f5", "#7E69AB", "#6E59A5", "#1A1F2C",
    "#D6BCFA", "#F2FCE2", "#FEF7CD", "#FEC6A1", "#E5DEFF",
    "#FFDEE2", "#FDE1D3", "#D3E4FD", "#F1F0FB", "#8B5CF6"
  ];

  return (
    <div className="space-y-4">
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
          {tags.map((tag) => (
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
                    onClick={() => onEdit(tag)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(tag.id)}
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
  );
};