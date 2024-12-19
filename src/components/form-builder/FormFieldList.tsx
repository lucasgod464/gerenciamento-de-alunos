import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditFieldDialog } from "./EditFieldDialog";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FormField } from "@/types/form-builder";

interface FormFieldListProps {
  fields: FormField[];
  onDeleteField: (id: string) => void;
  onUpdateField: (field: FormField) => void;
}

export const FormFieldList = ({
  fields,
  onDeleteField,
  onUpdateField,
}: FormFieldListProps) => {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ordem</TableHead>
          <TableHead>Nome do Campo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Obrigatório</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedFields.map((field) => (
          <TableRow key={field.id}>
            <TableCell>{field.order}</TableCell>
            <TableCell>{field.label}</TableCell>
            <TableCell>{field.type}</TableCell>
            <TableCell>{field.required ? "Sim" : "Não"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <EditFieldDialog field={field} onUpdateField={onUpdateField} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={field.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover campo</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover este campo? Esta ação não
                        pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteField(field.id)}
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};