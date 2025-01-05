import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StudentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const StudentSearch = ({ searchTerm, onSearchChange, placeholder = "Buscar alunos..." }: StudentSearchProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};