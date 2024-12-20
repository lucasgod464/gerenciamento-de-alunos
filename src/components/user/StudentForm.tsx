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
        setCustomFields(parsedFields);
      } catch (error) {
        console.error("Erro ao carregar campos personalizados:", error);
      }
    }
  };

  // Carregar campos personalizados quando o formulário for aberto
  useEffect(() => {
    loadCustomFields();
  }, [currentUser?.companyId]);

  // Monitorar mudanças nos campos do formulário
  useEffect(() => {
    const handleFormFieldsUpdate = (e: CustomEvent) => {
      if (e.detail.companyId === currentUser?.companyId) {
        loadCustomFields();
      }
    };

    window.addEventListener('formFieldsUpdated', handleFormFieldsUpdate as EventListener);
    return () => {
      window.removeEventListener('formFieldsUpdated', handleFormFieldsUpdate as EventListener);
    };
  }, [currentUser?.companyId]);

  // Carregar salas disponíveis
  useEffect(() => {
    if (!currentUser?.companyId) return;

    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      try {
        const allRooms = JSON.parse(storedRooms);
        const companyRooms = allRooms.filter(
          (room: any) => room.companyId === currentUser.companyId
        );
        setRooms(companyRooms);
      } catch (error) {
        console.error("Erro ao carregar salas:", error);
      }
    }
  }, [currentUser?.companyId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: any = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get("fullName"),
      birthDate: formData.get("birthDate"),
      status: formData.get("status"),
      room: formData.get("room"),
      companyId: currentUser?.companyId,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      customFields: {},
    };

    // Processar campos personalizados
    customFields.forEach((field) => {
      if (!["name", "birthDate", "status", "room"].includes(field.id)) {
        data.customFields[field.name] = formData.get(field.name);
      }
    });

    try {
      await onSubmit(data);
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
          defaultValue={initialData?.name}
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
        <Label htmlFor="room">Sala</Label>
        <RoomSelect
          rooms={rooms}
          defaultValue={initialData?.room}
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