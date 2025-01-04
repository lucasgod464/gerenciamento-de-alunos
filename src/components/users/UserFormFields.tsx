import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { CategoryFields } from "./fields/CategoryFields";
import { StatusField } from "./fields/StatusField";
import { TagSelectionFields } from "./fields/TagSelectionFields";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface UserFormFieldsProps {
  defaultValues?: {
    name?: string;
    email?: string;
    password?: string;
    specialization?: string;
    status?: string;
    location?: string;
    tags?: { id: string; name: string; color: string; }[];
    accessLevel?: "Admin" | "Usuário Comum";
  };
  onTagsChange?: (tags: { id: string; name: string; color: string; }[]) => void;
  isEditing?: boolean;
  generateStrongPassword?: () => string;
}

export const UserFormFields = ({
  defaultValues,
  onTagsChange,
  isEditing,
  generateStrongPassword,
}: UserFormFieldsProps) => {
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string; color: string; }[]>(
    defaultValues?.tags || []
  );
  const { user: currentUser } = useAuth();
  const [specializations, setSpecializations] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (!currentUser?.companyId) return;

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

  const handleTagToggle = (tag: { id: string; name: string; color: string; }) => {
    const updatedTags = selectedTags.some(t => t.id === tag.id)
      ? selectedTags.filter((t) => t.id !== tag.id)
      : [...selectedTags, tag];

    setSelectedTags(updatedTags);
    onTagsChange?.(updatedTags);
  };

  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-4">
        <BasicInfoFields 
          defaultValues={{
            name: defaultValues?.name,
            email: defaultValues?.email,
            accessLevel: defaultValues?.accessLevel
          }} 
          isEditing={isEditing}
          generateStrongPassword={generateStrongPassword}
        />
        
        <CategoryFields 
          defaultValues={{
            specialization: defaultValues?.specialization,
            location: defaultValues?.location
          }} 
          specializations={specializations}
        />
        
        <TagSelectionFields
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
        
        <StatusField defaultValue={defaultValues?.status} />
      </div>
    </ScrollArea>
  );
};