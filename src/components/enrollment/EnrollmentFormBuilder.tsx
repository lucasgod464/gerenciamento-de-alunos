import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "section") {
      const newSections = Array.from(sections);
      const [removed] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, removed);
      setSections(newSections);
      return;
    }

    const sourceSection = sections.find(
      (section) => section.id === source.droppableId
    );
    const destSection = sections.find(
      (section) => section.id === destination.droppableId
    );

    if (!sourceSection || !destSection) return;

    if (source.droppableId === destination.droppableId) {
      const newFields = Array.from(sourceSection.fields);
      const [removed] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, removed);

      setSections(
        sections.map((section) =>
          section.id === source.droppableId
            ? { ...section, fields: newFields }
            : section
        )
      );
    } else {
      const sourceFields = Array.from(sourceSection.fields);
      const destFields = Array.from(destSection.fields);
      const [removed] = sourceFields.splice(source.index, 1);
      destFields.splice(destination.index, 0, removed);

      setSections(
        sections.map((section) => {
          if (section.id === source.droppableId) {
            return { ...section, fields: sourceFields };
          }
          if (section.id === destination.droppableId) {
            return { ...section, fields: destFields };
          }
          return section;
        })
      );
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ sections });
    }
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      className="p-4 mb-4"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab"
                        >
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          value={section.title}
                          onChange={(e) =>
                            updateSectionTitle(section.id, e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Droppable droppableId={section.id} type="field">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {section.fields.map((field, fieldIndex) => (
                              <Draggable
                                key={field.id}
                                draggableId={field.id}
                                index={fieldIndex}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                                  >
                                    <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
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
                                            <SelectItem value="text">
                                              Texto
                                            </SelectItem>
                                            <SelectItem value="email">
                                              Email
                                            </SelectItem>
                                            <SelectItem value="tel">
                                              Telefone
                                            </SelectItem>
                                            <SelectItem value="number">
                                              Número
                                            </SelectItem>
                                            <SelectItem value="date">
                                              Data
                                            </SelectItem>
                                            <SelectItem value="select">
                                              Seleção
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {field.type === "select" && (
                                        <div className="grid gap-2">
                                          <Label>
                                            Opções (uma por linha)
                                          </Label>
                                          <textarea
                                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={field.options?.join("\n") || ""}
                                            onChange={(e) =>
                                              updateField(section.id, field.id, {
                                                options: e.target.value
                                                  .split("\n")
                                                  .filter(Boolean),
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
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        removeField(section.id, field.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <Button
                        variant="outline"
                        onClick={() => addField(section.id)}
                        className="mt-4"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Campo
                      </Button>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
