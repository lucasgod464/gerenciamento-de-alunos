import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { Palette } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PRESET_COLORS = [
  "#9b87f5", // Primary Purple
  "#D6BCFA", // Light Purple
  "#F2FCE2", // Soft Green
  "#FEF7CD", // Soft Yellow
  "#FEC6A1", // Soft Orange
  "#E5DEFF", // Soft Purple
  "#FFDEE2", // Soft Pink
  "#FDE1D3", // Soft Peach
  "#D3E4FD", // Soft Blue
];

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSave: (categoryData: Partial<Category>) => void;
}

export function CategoryDialog({ 
  open, 
  onOpenChange, 
  category, 
  onSave 
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSelectedColor(category.color || PRESET_COLORS[0]);
    } else {
      setName("");
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [category]);

  const handleSave = () => {
    onSave({
      name,
      color: selectedColor,
    });
  };

  const handleColorPickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          <DialogDescription>
            {category 
              ? "Edite os detalhes da categoria existente" 
              : "Preencha os detalhes para criar uma nova categoria"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da categoria"
            />
          </div>
          <div className="space-y-2">
            <Label>Cor da Categoria</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                    selectedColor === color ? "ring-2 ring-offset-2 ring-black scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
              <Popover 
                open={showColorPicker} 
                onOpenChange={setShowColorPicker}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors gap-1 group ${
                      showColorPicker ? "border-primary" : ""
                    }`}
                    style={{ 
                      backgroundColor: selectedColor !== PRESET_COLORS.find(c => c === selectedColor) ? selectedColor : 'transparent'
                    }}
                  >
                    <Palette 
                      size={16} 
                      className={`${selectedColor !== PRESET_COLORS.find(c => c === selectedColor) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-3" 
                  onClick={handleColorPickerClick}
                  onPointerDownOutside={(e) => {
                    if (e.target instanceof Element && 
                        (e.target.closest('.react-colorful') || 
                         e.target.closest('input'))) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="space-y-3">
                    <div className="react-colorful-wrapper">
                      <HexColorPicker 
                        color={selectedColor} 
                        onChange={setSelectedColor}
                      />
                    </div>
                    <Input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="mt-2"
                      placeholder="#000000"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {category ? "Salvar Alterações" : "Criar Categoria"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
