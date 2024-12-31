import { useState, useEffect } from "react";
import { CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface DailyObservationsProps {
  date: Date;
  observation?: string;
  onObservationChange?: (text: string) => void;
}

export const DailyObservations = ({
  date,
  observation = "",
  onObservationChange = () => {}
}: DailyObservationsProps) => {
  const [localObservation, setLocalObservation] = useState(observation);

  useEffect(() => {
    setLocalObservation(observation);
  }, [observation]);

  const handleChange = (text: string) => {
    setLocalObservation(text);
    onObservationChange(text);
  };

  return (
    <div className="space-y-2">
      <CardTitle className="text-lg font-semibold">
        Observações do dia {format(date, "dd/MM/yyyy")}
      </CardTitle>
      <Textarea
        value={localObservation}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Digite suas observações para este dia (máximo 100 caracteres)"
        maxLength={100}
        className="min-h-[100px] resize-none"
      />
      <p className="text-sm text-muted-foreground text-right">
        {localObservation.length}/100 caracteres
      </p>
    </div>
  );
};