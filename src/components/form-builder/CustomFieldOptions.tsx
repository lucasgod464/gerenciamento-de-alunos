import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomFieldOptionsProps {
  type: string;
  options: string[];
  optionInput: string;
  setOptionInput: (value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}

export const CustomFieldOptions = ({
  type,
  options,
  optionInput,
  setOptionInput,
  onAddOption,
  onRemoveOption,
}: CustomFieldOptionsProps) => {
  return (
    <div className="space-y-2">
      <Label>Opções</Label>
      <div className="flex gap-2">
        <Input
          value={optionInput}
          onChange={(e) => setOptionInput(e.target.value)}
          placeholder="Digite uma opção"
        />
        <Button type="button" onClick={onAddOption}>
          Adicionar
        </Button>
      </div>
      <div className="space-y-2">
        {options?.map((option, index) => (
          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
            <div className="flex items-center gap-2">
              {type === "multiple" ? (
                <Checkbox checked disabled />
              ) : null}
              <span>{option}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveOption(index)}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};