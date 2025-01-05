import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Student } from "@/types/student";
import { StudentSearch } from "./details/StudentSearch";
import { AttendanceDetails } from "./details/AttendanceDetails";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function StudentDetailsDialog({ open, onClose }: StudentDetailsDialogProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handlePresetChange = (value: string) => {
    const today = new Date();
    
    switch (value) {
      case "today":
        setStartDate(today);
        setEndDate(today);
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case "last7days":
        setStartDate(subDays(today, 6));
        setEndDate(today);
        break;
      case "last30days":
        setStartDate(subDays(today, 29));
        setEndDate(today);
        break;
      case "thisMonth":
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        setStartDate(startOfMonth(lastMonth));
        setEndDate(endOfMonth(lastMonth));
        break;
      case "thisWeek":
        setStartDate(startOfWeek(today, { locale: ptBR }));
        setEndDate(endOfWeek(today, { locale: ptBR }));
        break;
      case "lastWeek":
        const lastWeek = subWeeks(today, 1);
        setStartDate(startOfWeek(lastWeek, { locale: ptBR }));
        setEndDate(endOfWeek(lastWeek, { locale: ptBR }));
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Consulta Individual de Aluno</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <StudentSearch onSelectStudent={setSelectedStudent} />

          {selectedStudent && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-lg">{selectedStudent.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedStudent.email || 'Email não cadastrado'}
                </p>
              </div>
              
              <Select onValueChange={handlePresetChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período predefinido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="thisWeek">Esta semana</SelectItem>
                  <SelectItem value="lastWeek">Semana passada</SelectItem>
                  <SelectItem value="thisMonth">Este mês</SelectItem>
                  <SelectItem value="lastMonth">Mês passado</SelectItem>
                </SelectContent>
              </Select>

              <AttendanceDetails
                studentId={selectedStudent.id}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}