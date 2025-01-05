import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date): string => {
  // Cria uma cópia da data e ajusta para o início do dia no fuso horário local
  const localDate = startOfDay(new Date(date));
  
  // Ajusta o fuso horário para considerar UTC
  localDate.setUTCHours(0, 0, 0, 0);
  
  console.log('Data original:', date);
  console.log('Data local ajustada:', localDate);
  console.log('Data formatada para o banco:', format(localDate, 'yyyy-MM-dd', { locale: ptBR }));
  
  return format(localDate, 'yyyy-MM-dd', { locale: ptBR });
};