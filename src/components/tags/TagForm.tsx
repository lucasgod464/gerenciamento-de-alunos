import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "./ColorPicker";

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

  const presetColors = [
    "#8E9196",
    "#9b87f5",
    "#7E69AB",
    "#D6BCFA",
    "#FFDEE2",
    "#FDE1D3",
    "#D3E4FD",
    "#F1F0FB"
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
          />
        </div>

        <div className="space-y-2">
          <Label>Cor</Label>
          <ColorPicker
            value={color}
            onChange={setColor}
            presetColors={presetColors}
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