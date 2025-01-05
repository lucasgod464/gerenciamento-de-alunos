import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date): string => {
  // Cria uma nova data no fuso horário local
  const localDate = new Date(date);
  
  // Ajusta para o início do dia no fuso horário local
  localDate.setHours(0, 0, 0, 0);
  
  // Converte para UTC mantendo o mesmo dia
  const utcDate = new Date(Date.UTC(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate()
  ));
  
  console.log('Data original:', date);
  console.log('Data local ajustada:', localDate);
  console.log('Data UTC:', utcDate);
  console.log('Data formatada para o banco:', format(utcDate, 'yyyy-MM-dd', { locale: ptBR }));
  
  return format(utcDate, 'yyyy-MM-dd', { locale: ptBR });
};