import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date) => {
  // Ajusta a data para meia-noite no fuso horário local
  const localDate = startOfDay(date);
  // Formata mantendo o fuso horário local
  return format(localDate, 'yyyy-MM-dd');
};

export const normalizeDate = (date: Date) => {
  return startOfDay(date);
};

export const areDatesEqual = (date1: Date, date2: Date) => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  return d1.getTime() === d2.getTime();
};