import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  show?: boolean;
}

export const FormSection = ({ title, children, show = true }: FormSectionProps) => {
  if (!show) return null;
  
  // Mapeamento dos títulos para versões mais amigáveis
  const getDisplayTitle = (title: string) => {
    switch (title) {
      case "Campos Administrativos":
        return "Campos Formulário";
      case "Campos do Formulário Público":
        return "Campos Formulário Online";
      default:
        return title;
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{getDisplayTitle(title)}</h3>
      {children}
    </div>
  );
};