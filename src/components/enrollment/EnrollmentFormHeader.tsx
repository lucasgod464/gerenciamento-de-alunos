import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Copy } from "lucide-react";

export const EnrollmentFormHeader = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const enrollmentUrl = `${baseUrl}/enrollment?company=${user?.companyId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(enrollmentUrl);
    toast({
      title: "Link copiado!",
      description: "O link do formulário foi copiado para a área de transferência.",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Link do Formulário</h2>
        <p className="text-muted-foreground">
          Compartilhe este link para que os alunos possam se inscrever
        </p>
      </div>
      
      <div className="flex gap-2">
        <Input 
          value={enrollmentUrl}
          readOnly
          className="flex-1"
        />
        <Button onClick={copyLink} variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Copiar Link
        </Button>
      </div>
    </div>
  );
};