import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  // Criar uma nova data no fuso horário local
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // Ajustar para o início do dia
  const adjustedDate = new Date(Date.UTC(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate()
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

export const formatDisplayDate = (date: Date): string => {
  // Adiciona um dia para compensar o fuso horário na exibição
  const displayDate = addDays(date, 1);
  return format(displayDate, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateForDatabase = (date: Date): string => {
  // Mantém a lógica original para salvar no banco
  return formatDate(date);
};