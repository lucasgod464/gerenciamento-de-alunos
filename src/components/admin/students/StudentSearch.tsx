import { Input } from "@/components/ui/input";

interface StudentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const StudentSearch = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar alunos..."
}: StudentSearchProps) => {
  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};