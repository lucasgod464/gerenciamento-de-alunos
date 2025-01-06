import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  show?: boolean;
}

export const FormSection = ({ title, children, show = true }: FormSectionProps) => {
  if (!show) return null;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      {children}
    </div>
  );
};