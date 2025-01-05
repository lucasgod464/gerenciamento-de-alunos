import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date): string => {
  // Cria uma cópia da data e ajusta para o início do dia
  const localDate = startOfDay(new Date(date));
  
  // Ajusta para o fuso horário local
  const offset = localDate.getTimezoneOffset();
  localDate.setMinutes(localDate.getMinutes() - offset);
  
  console.log('Data original:', date);
  console.log('Offset do fuso horário (minutos):', offset);
  console.log('Data local ajustada:', localDate);
  console.log('Data formatada para o banco:', format(localDate, 'yyyy-MM-dd', { locale: ptBR }));
  
  return format(localDate, 'yyyy-MM-dd', { locale: ptBR });
};