import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Category {
  id: string;
  name: string;
  status: boolean;
  companyId: string | null;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.companyId) return;

    const savedCategories = localStorage.getItem("categories");
    if (savedCategories) {
      const allCategories = JSON.parse(savedCategories);
      const companyCategories = allCategories.filter(
        (cat: Category) => 
          cat.companyId === currentUser.companyId && 
          cat.status === true
      );
      setCategories(companyCategories);
    }
  }, [currentUser]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione a categoria" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};