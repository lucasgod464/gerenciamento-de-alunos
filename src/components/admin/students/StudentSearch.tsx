import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StudentSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const StudentSearch = ({ value, onChange, placeholder = "Buscar alunos..." }: StudentSearchProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};