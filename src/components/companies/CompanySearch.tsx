import { Input } from "@/components/ui/input";

interface CompanySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CompanySearch({ value, onChange }: CompanySearchProps) {
  return (
    <div className="max-w-xl">
      <Input
        placeholder="Buscar empresas..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}