import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

interface EnrollmentFormBuilderProps {
  initialData?: {
    sections: FormSection[];
  };
  onSave?: (formData: { sections: FormSection[] }) => void;
}

export const EnrollmentFormBuilder = ({ initialData, onSave }: EnrollmentFormBuilderProps) => {
  const [sections, setSections] = useState<FormSection[]>(initialData?.sections || []);

  useEffect(() => {
    if (initialData?.sections) {
      setSections(initialData.sections);
    }
  }, [initialData]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: crypto.randomUUID(),
        title: "Nova Seção",
        fields: [],
      },
    ]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) return;

    const newSections = [...sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setSections(newSections);
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      )
    );
  };

  const addField = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: [
                ...section.fields,
                {
                  id: crypto.randomUUID(),
                  type: "text",
                  label: "Novo Campo",
                  required: false,
                },
              ],
            }
          : section
      )
    );
  };

  const removeField = (sectionId: string, fieldId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter((field) => field.id !== fieldId),
            }
          : section
      )
    );
  };

  const moveField = (sectionId: string, fieldIndex: number, direction: 'up' | 'down') => {
    setSections(sections.map(section => {
      if (section.id !== sectionId) return section;

      const newFields = [...section.fields];
      if (
        (direction === 'up' && fieldIndex === 0) || 
        (direction === 'down' && fieldIndex === newFields.length - 1)
      ) return section;

      const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
      [newFields[fieldIndex], newFields[newIndex]] = [newFields[newIndex], newFields[fieldIndex]];
      
      return { ...section, fields: newFields };
    }));
  };

  const updateField = (
    sectionId: string,
    fieldId: string,
    updates: Partial<FormField>
  ) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
            }
          : section
      )
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ sections });
      toast.success("Formulário salvo com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <Card key={section.id} className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Input
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveSection(sectionIndex, 'up')}
                disabled={sectionIndex === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveSection(sectionIndex, 'down')}
                disabled={sectionIndex === sections.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSection(section.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {section.fields.map((field, fieldIndex) => (
              <div
                key={field.id}
                className="flex items-start gap-4 p-4 bg-muted rounded-lg"
              >
                <div className="flex-1 space-y-4">
                  <div className="grid gap-2">
                    <Label>Rótulo do Campo</Label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        updateField(section.id, field.id, {
                          label: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Tipo do Campo</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) =>
                        updateField(section.id, field.id, {
                          type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Telefone</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="date">Data</SelectItem>
                        <SelectItem value="select">Seleção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {field.type === "select" && (
                    <div className="grid gap-2">
                      <Label>Opções (uma por linha)</Label>
                      <textarea
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={field.options?.join("\n") || ""}
                        onChange={(e) =>
                          updateField(section.id, field.id, {
                            options: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) =>
                        updateField(section.id, field.id, {
                          required: checked,
                        })
                      }
                      id={`required-${field.id}`}
                    />
                    <Label htmlFor={`required-${field.id}`}>
                      Campo Obrigatório
                    </Label>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveField(section.id, fieldIndex, 'up')}
                    disabled={fieldIndex === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveField(section.id, fieldIndex, 'down')}
                    disabled={fieldIndex === section.fields.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(section.id, field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => addField(section.id)}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Campo
          </Button>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button onClick={addSection}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Seção
        </Button>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground">
          <Save className="h-4 w-4 mr-2" />
          Salvar Formulário
        </Button>
      </div>
    </div>
  );
};
