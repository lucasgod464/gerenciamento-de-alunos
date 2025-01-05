import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date): string => {
  // Ajusta a data para o fuso horário local (America/Sao_Paulo)
  const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  console.log('Data original:', date);
  console.log('Data local ajustada:', localDate);
  console.log('Data formatada para o banco:', format(localDate, 'yyyy-MM-dd', { locale: ptBR }));
  
  return format(localDate, 'yyyy-MM-dd', { locale: ptBR });
};