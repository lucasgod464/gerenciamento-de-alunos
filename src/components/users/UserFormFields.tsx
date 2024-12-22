import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { CategoryFields } from "./fields/CategoryFields";
import { RoomSelectionFields } from "./fields/RoomSelectionFields";
import { StatusField } from "./fields/StatusField";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserFormFieldsProps {
  generateStrongPassword?: () => void;
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

interface Room {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

interface Specialization {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

export const UserFormFields = ({
  generateStrongPassword,
  defaultValues,
  onAuthorizedRoomsChange,
  isEditing,
}: UserFormFieldsProps) => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    defaultValues?.authorizedRooms || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const allSpecializations = JSON.parse(
      localStorage.getItem("specializations") || "[]"
    );
    const companySpecializations = allSpecializations.filter(
      (spec: Specialization) =>
        spec.companyId === currentUser.companyId && spec.status
    );
    setSpecializations(companySpecializations);

    const allRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    const companyRooms = allRooms.filter(
      (room: Room) => room.companyId === currentUser.companyId && room.status
    );
    setRooms(companyRooms);
  }, [currentUser]);

  useEffect(() => {
    if (defaultValues?.authorizedRooms) {
      setSelectedRooms(defaultValues.authorizedRooms);
    }
  }, [defaultValues?.authorizedRooms]);

  const handleRoomToggle = (roomId: string) => {
    const updatedRooms = selectedRooms.includes(roomId)
      ? selectedRooms.filter((id) => id !== roomId)
      : [...selectedRooms, roomId];

    setSelectedRooms(updatedRooms);
    onAuthorizedRoomsChange?.(updatedRooms);
  };

  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-4">
        <BasicInfoFields defaultValues={defaultValues} isEditing={isEditing} />
        <CategoryFields
          defaultValues={defaultValues}
          specializations={specializations}
        />
        <RoomSelectionFields
          rooms={rooms}
          selectedRooms={selectedRooms}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRoomToggle={handleRoomToggle}
        />
        <StatusField defaultValue={defaultValues?.status} />
      </div>
      <input type="hidden" name="authorizedRooms" value={JSON.stringify(selectedRooms)} />
    </ScrollArea>
  );
};
