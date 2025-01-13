import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TagForm } from "./TagForm";
import { TagType } from "@/pages/Admin/Tags";

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTag: TagType | null;
  onSubmit: (tag: Omit<TagType, "id" | "company_id">) => void;
}

export const TagDialog = ({
  open,
  onOpenChange,
  editingTag,
  onSubmit,
}: TagDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingTag ? "Editar Etiqueta" : "Criar Etiqueta"}
          </DialogTitle>
        </DialogHeader>
        <TagForm
          editingTag={editingTag}
          onSubmit={(tagData) => {
            onSubmit(tagData);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
