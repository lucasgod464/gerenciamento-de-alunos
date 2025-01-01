import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const RoomTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nome da Sala</TableHead>
        <TableHead>Horário</TableHead>
        <TableHead>Endereço</TableHead>
        <TableHead>Categoria</TableHead>
        <TableHead>Alunos</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};