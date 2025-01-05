import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date) => {
  // Ajusta a data para meia-noite no fuso horário local (Brasil)
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  
  // Adiciona o offset do fuso horário brasileiro (UTC-3)
  const brasiliaOffset = -3 * 60 * 60 * 1000; // 3 horas em milissegundos
  const adjustedDate = new Date(localDate.getTime() - brasiliaOffset);
  
  // Formata a data mantendo o fuso horário
  return format(adjustedDate, 'yyyy-MM-dd');
};

export const normalizeDate = (date: Date) => {
  return startOfDay(date);
};

export const areDatesEqual = (date1: Date, date2: Date) => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  return d1.getTime() === d2.getTime();
};