import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";

interface TagFormProps {
  editingTag: TagType | null;
  onSubmit: (tag: Omit<TagType, "id" | "companyId">) => void;
  onCancel: () => void;
}

interface TagType {
  id: string;
  name: string;
  description: string;
  color: string;
  status: boolean;
}

export const TagForm = ({ editingTag, onSubmit, onCancel }: TagFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#8E9196");
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name);
      setDescription(editingTag.description);
      setColor(editingTag.color);
      setStatus(editingTag.status);
    }
  }, [editingTag]);

  // Paleta de cores refinada
  const colors = [
    "#8E9196", // Neutral Gray
    "#9b87f5", // Primary Purple
    "#7E69AB", // Secondary Purple
    "#D6BCFA", // Light Purple
    "#FFDEE2", // Soft Pink
    "#FDE1D3", // Soft Peach
    "#D3E4FD", // Soft Blue
    "#F1F0FB"  // Soft Gray
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, color, status });
    setName("");
    setDescription("");
    setColor("#8E9196");
    setStatus(true);
  };

  const handleColorChange = (newColor: string) => {
    console.log("Nova cor selecionada:", newColor);
    setColor(newColor);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Etiqueta</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Cor</Label>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                  color === c ? "ring-2 ring-offset-2 ring-black scale-110" : ""
                }`}
                style={{ backgroundColor: c }}
                onClick={() => handleColorChange(c)}
              />
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors gap-1 group`}
                  style={{ 
                    backgroundColor: !colors.includes(color) ? color : 'transparent'
                  }}
                >
                  <Palette 
                    size={16} 
                    className={`${!colors.includes(color) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}
                  />
                  <span className={`text-[10px] ${!colors.includes(color) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
                    Custom
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <HexColorPicker color={color} onChange={handleColorChange} />
                    <div className="flex flex-col gap-2">
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-24"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center space-x-2">
            <Switch checked={status} onCheckedChange={setStatus} />
            <span>{status ? "Ativa" : "Inativa"}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {editingTag && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          {editingTag ? "Salvar Alterações" : "Criar Etiqueta"}
        </Button>
      </div>
    </form>
  );
};