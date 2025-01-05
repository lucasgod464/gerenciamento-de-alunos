import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDown, ChevronUp, CircleCheck, CircleX, Clock, FileQuestion } from "lucide-react";
import { useState } from "react";

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "present":
      return <CircleCheck className="h-4 w-4 text-green-500" />;
    case "absent":
      return <CircleX className="h-4 w-4 text-red-500" />;
    case "late":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "justified":
      return <FileQuestion className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "present":
      return "Presente";
    case "absent":
      return "Ausente";
    case "late":
      return "Atrasado";
    case "justified":
      return "Justificado";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "present":
      return "text-green-600";
    case "absent":
      return "text-red-600";
    case "late":
      return "text-yellow-600";
    case "justified":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

interface AttendanceHistoryProps {
  attendance: AttendanceRecord[];
}

export function AttendanceHistory({ attendance }: AttendanceHistoryProps) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Histórico de Presenças</h4>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          className="text-gray-600 hover:text-gray-900"
        >
          {showHistory ? (
            <ChevronUp className="h-4 w-4 mr-1" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-1" />
          )}
          {showHistory ? "Ocultar" : "Mostrar"}
        </Button>
      </div>
      
      {showHistory && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {attendance.map((record) => (
            <div
              key={record.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span>{format(addDays(new Date(record.date), 1), "dd/MM/yyyy", { locale: ptBR })}</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(record.status)}
                <span className={`font-medium ${getStatusColor(record.status)}`}>
                  {getStatusText(record.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}