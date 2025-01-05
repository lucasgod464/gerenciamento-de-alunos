import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date): string => {
  // Cria uma nova data no fuso horário local (já configurado como America/Sao_Paulo no banco)
  const localDate = new Date(date);
  
  // Formata a data usando date-fns para garantir consistência
  return format(localDate, 'yyyy-MM-dd', { locale: ptBR });
};