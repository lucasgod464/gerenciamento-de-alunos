import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const EnrollmentFormHeader = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const enrollmentUrl = `${baseUrl}/enrollment/${user?.companyId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(enrollmentUrl);
    toast({
      title: "Link copiado!",
      description: "O link do formulário foi copiado para sua área de transferência.",
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Input 
          value={enrollmentUrl}
          readOnly
          className="flex-1"
        />
        <Button onClick={handleCopyLink}>
          Copiar Link
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Compartilhe este link com os interessados para que eles possam preencher o formulário de inscrição.
      </p>
    </div>
  );
};