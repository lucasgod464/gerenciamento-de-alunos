interface AttendanceListProps {
  attendance: Array<{
    id: string;
    date: string;
    status: string;
  }>;
}

export function AttendanceList({ attendance }: AttendanceListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'justified':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'absent':
        return 'Ausente';
      case 'late':
        return 'Atrasado';
      case 'justified':
        return 'Justificado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
      {attendance.map((record) => (
        <div
          key={record.id}
          className={`px-3 py-2 rounded-md ${getStatusColor(record.status)}`}
        >
          {new Date(record.date).toLocaleDateString('pt-BR')}: {getStatusText(record.status)}
        </div>
      ))}
    </div>
  );
}