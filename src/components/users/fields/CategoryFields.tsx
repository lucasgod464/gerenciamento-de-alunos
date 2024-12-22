import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CategorySelect } from "../CategorySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { UserFormData } from "@/schemas/userSchema";

interface CategoryFieldsProps {
  form: UseFormReturn<UserFormData>;
  defaultValues?: {
    specialization?: string;
  };
  specializations: Array<{ id: string; name: string }>;
}

export function CategoryFields({ form, defaultValues, specializations }: CategoryFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="responsibleCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria Responsável</FormLabel>
            <FormControl>
              <CategorySelect value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Especialização</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialização" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec.id} value={spec.id}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}