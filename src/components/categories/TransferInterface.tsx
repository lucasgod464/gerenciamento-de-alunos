import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/category";
import { useToast } from "@/hooks/use-toast";

interface TransferInterfaceProps {
  categories: Category[];
  currentCategoryId: string;
  selectedRooms: string[];
  onCancelTransfer: () => void;
  onToggleAllRooms: () => void;
  onTransferRooms: (targetCategoryId: string) => void;
}

export const TransferInterface = ({
  categories,
  currentCategoryId,
  selectedRooms,
  onCancelTransfer,
  onToggleAllRooms,
  onTransferRooms,
}: TransferInterfaceProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleTransfer = () => {
    if (selectedRooms.length === 0) {
      toast({
        title: "Selecione as salas",
        description: "Selecione pelo menos uma sala para transferir.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Selecione a categoria",
        description: "Selecione uma categoria para transferir as salas.",
        variant: "destructive",
      });
      return;
    }

    onTransferRooms(selectedCategory);
    setSelectedCategory("");
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onCancelTransfer}
        className="w-full bg-white/50 hover:bg-white/70"
      >
        Cancelar Transferência
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onToggleAllRooms}
        className="w-full bg-white/50 hover:bg-white/70"
      >
        {selectedRooms.length === rooms.length 
          ? "Desmarcar Todas" 
          : "Selecionar Todas"}
      </Button>

      <div className="p-3 bg-white/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <MoveRight className="h-4 w-4" />
          <span className="text-sm font-medium">Transferir para:</span>
        </div>
        <Select 
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="bg-white/50">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter(cat => cat.id !== currentCategoryId)
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleTransfer}
        disabled={!selectedCategory || selectedRooms.length === 0}
        className="w-full bg-white/50 hover:bg-white/70"
      >
        Confirmar Transferência
      </Button>
    </div>
  );
};