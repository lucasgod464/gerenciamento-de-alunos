import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TagFormProps {
  editingTag: TagType | null;
  onSubmit: (tag: Omit<TagType, "id">) => void;
  onCancel: () => void;
}

interface TagType {
  id: number;
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
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name);
      setDescription(editingTag.description);
      setColor(editingTag.color);
      setStatus(editingTag.status);
    }
  }, [editingTag]);

  const colors = [
    "#8E9196", "#9b87f5", "#7E69AB", "#6E59A5", "#1A1F2C",
    "#D6BCFA", "#F2FCE2", "#FEF7CD", "#FEC6A1", "#E5DEFF",
    "#FFDEE2", "#FDE1D3", "#D3E4FD", "#F1F0FB", "#8B5CF6"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, color, status });
    setName("");
    setDescription("");
    setColor("#8E9196");
    setStatus(true);
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
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Cor</Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
            <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  +
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker color={color} onChange={setColor} />
              </PopoverContent>
            </Popover>
          </div>
          <Input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-2"
            placeholder="Digite um código hex (#000000)"
          />
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