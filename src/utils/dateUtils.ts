import { format, startOfDay } from "date-fns";

export const formatDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

export const normalizeDate = (date: Date) => {
  return startOfDay(date);
};

export const areDatesEqual = (date1: Date, date2: Date) => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  return d1.getTime() === d2.getTime();
};
