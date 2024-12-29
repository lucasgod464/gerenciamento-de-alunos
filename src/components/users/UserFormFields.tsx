import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySelect } from "./CategorySelect";
import { RoomSelectionFields } from "./fields/RoomSelectionFields";
import { TagSelectionFields } from "./fields/TagSelectionFields";
import { StatusField } from "./fields/StatusField";
import { useAuth } from "@/hooks/useAuth";

interface UserFormFieldsProps {
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

export function UserFormFields({
  defaultValues = {},
  onAuthorizedRoomsChange,
  onTagsChange,
  isEditing = false,
}: UserFormFieldsProps) {
  const { user: currentUser } = useAuth();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues.name}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues.email}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha {isEditing && "(deixe em branco para manter a atual)"}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          defaultValue={defaultValues.password}
          required={!isEditing}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibleCategory">Categoria Responsável</Label>
        <CategorySelect
          value={defaultValues.responsibleCategory || ""}
          onChange={(value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'responsibleCategory';
            input.value = value;
            document.querySelector('form')?.appendChild(input);
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            name="location"
            defaultValue={defaultValues.location}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialization">Especialização</Label>
          <Input
            id="specialization"
            name="specialization"
            defaultValue={defaultValues.specialization}
          />
        </div>
      </div>

      <StatusField defaultValue={defaultValues.status} />

      <RoomSelectionFields
        selectedRooms={defaultValues.authorizedRooms || []}
        onRoomToggle={(roomIds) => onAuthorizedRoomsChange?.(roomIds)}
      />

      <TagSelectionFields
        selectedTags={defaultValues.tags || []}
        onTagToggle={(tagId) => {
          const currentTags = defaultValues.tags || [];
          const newTags = currentTags.includes(tagId)
            ? currentTags.filter((id) => id !== tagId)
            : [...currentTags, tagId];
          onTagsChange?.(newTags);
        }}
      />
    </div>
  );
}