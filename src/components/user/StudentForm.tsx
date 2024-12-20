import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";
import { CustomFields } from "./form/CustomFields";
import { RoomSelect } from "./form/RoomSelect";

interface StudentFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  open?: boolean;
}

export const StudentForm = ({ onSubmit, initialData, open }: StudentFormProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  const loadCustomFields = () => {
    if (!currentUser?.companyId) return;

    const storageKey = `formFields_${currentUser.companyId}`;
    const savedFields = localStorage.getItem(storageKey);

    if (savedFields) {
      try {
        const parsedFields = JSON.parse(savedFields);
        // Verifica se os campos realmente mudaram antes de atualizar o estado
        if (JSON.stringify(parsedFields) !== JSON.stringify(customFields)) {
          console.log("Atualizando campos personalizados:", parsedFields);
          setCustomFields(parsedFields);
        }
      } catch (error) {
        console.error("Erro ao carregar campos personalizados:", error);
      }
    }
  };

  // Carregar campos personalizados quando o formulário for aberto
  useEffect(() => {
    if (open) {
      loadCustomFields();
    }
  }, [open]);

  // Monitorar mudanças no localStorage
  useEffect(() => {
    if (!currentUser?.companyId) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('formFields_')) {
        console.log("Detectada mudança nos campos personalizados");
        loadCustomFields();
      }
    };

    // Carrega os campos inicialmente
    loadCustomFields();

    // Adiciona o listener para mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser?.companyId]);

  // Carregar salas disponíveis
  useEffect(() => {
    // Carregar lógica de salas disponíveis
    const fetchRooms = async () => {
      if (!currentUser?.companyId) return;

      // Simulação de chamada de API para buscar salas
      const response = await fetch(`/api/rooms?companyId=${currentUser.companyId}`);
      const data = await response.json();
      setRooms(data);
    };

    fetchRooms();
  }, [currentUser?.companyId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: any = {
      fullName: formData.get("fullName"),
      birthDate: formData.get("birthDate"),
      status: formData.get("status"),
      roomId: formData.get("roomId"),
      customFields: {},
    };

    // Processar campos personalizados
    customFields.forEach((field) => {
      if (field.id !== "name" && field.id !== "birthDate" && field.id !== "status" && field.id !== "room") {
        data.customFields[field.name] = formData.get(field.name);
      }
    });

    try {
      await onSubmit(data);
      toast({
        title: initialData ? "Aluno atualizado" : "Aluno cadastrado",
        description: initialData
          ? "As informações do aluno foram atualizadas com sucesso."
          : "O aluno foi cadastrado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o formulário.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          name="fullName"
          required
          defaultValue={initialData?.fullName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de Nascimento</Label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          required
          defaultValue={initialData?.birthDate}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          className="w-full px-3 py-2 border rounded-md"
          required
          defaultValue={initialData?.status || "active"}
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomId">Sala</Label>
        <RoomSelect
          rooms={rooms}
          defaultValue={initialData?.roomId}
          required
        />
      </div>

      <CustomFields
        fields={customFields}
        initialData={initialData?.customFields}
      />

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          {initialData ? "Atualizar" : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};
