import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Pencil, Trash2, Folder, Building2, Users2, DoorOpen } from "lucide-react"
import { CompanyDataUsage } from "./CompanyDataUsage"
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
} from "@/components/ui/alert-dialog"
import { Company } from "./CompanyList"
import { useToast } from "@/components/ui/use-toast"

// Extraindo os componentes de indicadores para arquivos separados
import { UsersIndicator } from "./indicators/UsersIndicator"
import { RoomsIndicator } from "./indicators/RoomsIndicator"
import { CompanyInfo } from "./CompanyInfo"

interface CompanyTableRowProps {
  company: Company;
  onDelete: (id: string) => void;
  onEdit: (company: Company) => void;
  onUpdateStatus: (company: Company) => void;
}

export function CompanyTableRow({
  company,
  onDelete,
  onEdit,
  onUpdateStatus,
}: CompanyTableRowProps) {
  const { toast } = useToast();

  const handleStatusChange = () => {
    const updatedCompany: Company = {
      ...company,
      status: company.status === "Ativa" ? "Inativa" : "Ativa"
    };
    
    onUpdateStatus(updatedCompany);
    
    toast({
      title: "Status atualizado",
      description: `A empresa ${company.name} foi ${updatedCompany.status === "Ativa" ? "ativada" : "desativada"}.`,
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne o comportamento padrão
    
    if (company.status === "Inativa") {
      toast({
        title: "Operação não permitida",
        description: "Não é possível editar uma empresa inativa.",
        variant: "destructive",
      });
      return;
    }
    onEdit(company);
  };

  return (
    <tr className={cn(
      "hover:bg-gray-50 transition-colors",
      company.status === "Inativa" && "bg-gray-50 opacity-75"
    )}>
      <td className="p-4">
        <CompanyInfo company={company} />
      </td>

      <td className="p-4">
        <UsersIndicator 
          currentUsers={company.currentUsers} 
          usersLimit={company.usersLimit} 
        />
      </td>

      <td className="p-4">
        <RoomsIndicator 
          currentRooms={company.currentRooms} 
          roomsLimit={company.roomsLimit} 
        />
      </td>

      <td className="p-4">
        <Switch
          checked={company.status === "Ativa"}
          onCheckedChange={handleStatusChange}
          className={cn(
            "data-[state=checked]:bg-green-500",
            "data-[state=unchecked]:bg-red-500"
          )}
        />
      </td>
      <td className="p-4 text-gray-500">{company.createdAt}</td>
      <td className="p-4">
        <div className="flex justify-end space-x-2">
          <CompanyDataUsage company={company} />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="hover:bg-blue-50 hover:text-blue-600"
            disabled={company.status === "Inativa"}
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-50 hover:text-red-600"
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
                  onClick={() => onDelete(company.id)}
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
  );
}