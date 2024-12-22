import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { CategoryFields } from "./fields/CategoryFields";
import { RoomSelectionFields } from "./fields/RoomSelectionFields";
import { StatusField } from "./fields/StatusField";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

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
        <CategoryFields defaultValues={defaultValues} />
        <RoomSelectionFields
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