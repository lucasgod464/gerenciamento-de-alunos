import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { CategoryFields } from "./fields/CategoryFields";
import { RoomSelectionFields } from "./fields/RoomSelectionFields";
import { StatusField } from "./fields/StatusField";
import { TagSelectionFields } from "./fields/TagSelectionFields";
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
    tags?: string[];
    responsibleCategory?: string;
  };
  onAuthorizedRoomsChange?: (roomIds: string[]) => void;
  onTagsChange?: (tagIds: string[]) => void;
  isEditing?: boolean;
}

export const UserFormFields = ({
  defaultValues,
  onAuthorizedRoomsChange,
  onTagsChange,
  isEditing,
}: UserFormFieldsProps) => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    defaultValues?.authorizedRooms || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    defaultValues?.tags || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuth();
  const [rooms, setRooms] = useState<Array<{ id: string; name: string; status: boolean }>>([]);
  const [specializations, setSpecializations] = useState<Array<{ id: string; name: string }>>([]);

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
    onAuthorizedRoomsChange?.(updatedRooms);
  };

  const handleTagToggle = (tagId: string) => {
    const updatedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(updatedTags);
    onTagsChange?.(updatedTags);
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
        <TagSelectionFields
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
        <StatusField defaultValue={defaultValues?.status} />
      </div>
      <input type="hidden" name="authorizedRooms" value={JSON.stringify(selectedRooms)} />
      <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
    </ScrollArea>
  );
};