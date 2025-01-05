export const formatDate = (date: Date): string => {
  // Ajusta a data para meia-noite no fuso horário local
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  
  // Formata a data no padrão YYYY-MM-DD
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};