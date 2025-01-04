import { format, startOfDay } from "date-fns";

export const formatDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

export const normalizeDate = (date: Date) => {
  return startOfDay(date);
};

export const areDatesEqual = (date1: Date, date2: Date) => {
  return normalizeDate(date1).getTime() === normalizeDate(date2).getTime();
};