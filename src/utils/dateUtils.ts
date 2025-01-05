import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date): string => {
  // Cria uma nova data no fuso horário local
  const localDate = new Date(date);
  
  // Ajusta para o início do dia no fuso horário local
  localDate.setHours(0, 0, 0, 0);
  
  // Adiciona um dia para compensar o fuso horário
  const adjustedDate = addDays(localDate, 1);
  
  // Converte para UTC mantendo o mesmo dia
  const utcDate = new Date(Date.UTC(
    adjustedDate.getFullYear(),
    adjustedDate.getMonth(),
    adjustedDate.getDate()
  ));
  
  const formattedDate = format(utcDate, 'yyyy-MM-dd', { locale: ptBR });
  
  console.log('=== Debug formatDate ===');
  console.log('Data original:', date);
  console.log('Data local ajustada:', localDate);
  console.log('Data com ajuste de dia:', adjustedDate);
  console.log('Data UTC:', utcDate);
  console.log('Data formatada para o banco:', formattedDate);
  console.log('=======================');
  
  return formattedDate;
};