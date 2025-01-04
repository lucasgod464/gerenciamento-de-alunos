import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Link } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const EnrollmentFormHeader = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const formUrl = `${window.location.origin}/enrollment/${user?.companyId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formUrl);
    toast({
      title: "Link copiado",
      description: "O link do formulário foi copiado para a área de transferência.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link do Formulário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input value={formUrl} readOnly />
          </div>
          <Button onClick={handleCopyLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};