import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Desconectado",
      description: "Sessão encerrada com sucesso",
    });
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </CardContent>
    </Card>
  );
};
