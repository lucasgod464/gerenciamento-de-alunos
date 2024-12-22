import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { CategoryFields } from "./fields/CategoryFields";
import { RoomSelectionFields } from "./fields/RoomSelectionFields";
import { StatusField } from "./fields/StatusField";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormData } from "@/schemas/userSchema";
import { Form } from "@/components/ui/form";

interface UserFormFieldsProps {
  defaultValues?: {
    name?: string;
    email?: string;
    password?: string;
    location?: string;
    specialization?: string;
    status?: string;
    authorizedRooms?: string[];
  };
  onAuthorizedRoomsChange?: (roomIds: string[]) => void;
  isEditing?: boolean;
}

export const UserFormFields = ({
  defaultValues,
  onAuthorizedRoomsChange,
  isEditing,
}: UserFormFieldsProps) => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    defaultValues?.authorizedRooms || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuth();
  const [rooms, setRooms] = useState<Array<{ id: string; name: string; status: boolean }>>([]);
  const [specializations, setSpecializations] = useState<Array<{ id: string; name: string }>>([]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      password: defaultValues?.password || "",
      location: defaultValues?.location || "",
      specialization: defaultValues?.specialization || "",
      status: (defaultValues?.status as "active" | "inactive") || "active",
      authorizedRooms: defaultValues?.authorizedRooms || [],
      responsibleCategory: "",
    },
  });

  useEffect(() => {
    if (defaultValues?.authorizedRooms) {
      setSelectedRooms(defaultValues.authorizedRooms);
      form.setValue("authorizedRooms", defaultValues.authorizedRooms);
    }
  }, [defaultValues?.authorizedRooms, form]);

  useEffect(() => {
    if (!currentUser?.companyId) return;

    // Load rooms from localStorage
    const savedRooms = localStorage.getItem("rooms");
    if (savedRooms) {
      const allRooms = JSON.parse(savedRooms);
      const companyRooms = allRooms.filter(
        (room: any) => room.companyId === currentUser.companyId && room.status === true
      );
      setRooms(companyRooms);
    }

    // Load specializations from localStorage
    const savedSpecializations = localStorage.getItem("specializations");
    if (savedSpecializations) {
      const allSpecializations = JSON.parse(savedSpecializations);
      const companySpecializations = allSpecializations.filter(
        (spec: any) => spec.companyId === currentUser.companyId && spec.status === true
      );
      setSpecializations(companySpecializations);
    }
  }, [currentUser]);

  const handleRoomToggle = (roomId: string) => {
    const updatedRooms = selectedRooms.includes(roomId)
      ? selectedRooms.filter((id) => id !== roomId)
      : [...selectedRooms, roomId];

    setSelectedRooms(updatedRooms);
    form.setValue("authorizedRooms", updatedRooms);
    onAuthorizedRoomsChange?.(updatedRooms);
  };

  return (
    <Form {...form}>
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-4">
          <BasicInfoFields 
            form={form}
            defaultValues={defaultValues} 
            isEditing={isEditing} 
          />
          <CategoryFields 
            form={form}
            defaultValues={defaultValues} 
            specializations={specializations}
          />
          <RoomSelectionFields
            form={form}
            rooms={rooms}
            selectedRooms={selectedRooms}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRoomToggle={handleRoomToggle}
          />
          <StatusField 
            form={form}
            defaultValue={defaultValues?.status} 
          />
        </div>
        <input type="hidden" name="authorizedRooms" value={JSON.stringify(selectedRooms)} />
      </ScrollArea>
    </Form>
  );
};