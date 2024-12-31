import { CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface DailyObservationsProps {
  observation: string;
  onObservationChange: (text: string) => void;
}

export const DailyObservations = ({
  observation,
  onObservationChange,
}: DailyObservationsProps) => {
  return (
    <div className="space-y-2">
      <CardTitle className="text-lg">Observações do dia</CardTitle>
      <Textarea
        value={observation}
        onChange={(e) => onObservationChange(e.target.value)}
        placeholder="Digite suas observações para este dia (máximo 100 caracteres)"
        maxLength={100}
        className="min-h-[100px]"
      />
      <p className="text-sm text-muted-foreground text-right">
        {observation.length}/100 caracteres
      </p>
    </div>
  );
};