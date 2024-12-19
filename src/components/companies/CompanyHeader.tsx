import { CreateCompanyDialog } from "./CreateCompanyDialog";

interface CompanyHeaderProps {
  onCompanyCreated: (company: any) => void;
}

export function CompanyHeader({ onCompanyCreated }: CompanyHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Gerenciamento de Empresas</h1>
      <div className="flex justify-between items-center mt-6">
        <p className="text-muted-foreground">
          Gerencie todas as instituições de ensino cadastradas no sistema
        </p>
        <CreateCompanyDialog onCompanyCreated={onCompanyCreated} />
      </div>
    </div>
  );
}