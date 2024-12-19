import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Trash2, Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  // Obtém apenas as cores que estão sendo usadas nas tags
  const usedColors = Array.from(new Set(tags.map(tag => tag.color)));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="inactive">Inativas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select
            value={selectedColor}
            onValueChange={setSelectedColor}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por cor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cores</SelectItem>
              {usedColors.map((color) => (
                <SelectItem key={color} value={color}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <span>{color}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                  className="w-6 h-6 rounded"
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