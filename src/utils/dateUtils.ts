import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date): string => {
  // Cria uma cópia da data para não modificar a original
  const localDate = new Date(date);
  
  // Ajusta para meia-noite no fuso horário local
  localDate.setHours(0, 0, 0, 0);
  
  console.log('Data original:', date);
  console.log('Data local ajustada:', localDate);
  console.log('Data formatada para o banco:', format(localDate, 'yyyy-MM-dd', { locale: ptBR }));
  
  return format(localDate, 'yyyy-MM-dd', { locale: ptBR });
};