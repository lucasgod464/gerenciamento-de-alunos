import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Página não encontrada
      </p>
      <Button onClick={() => navigate("/")}>Voltar para o início</Button>
    </div>
  );
};

export default NotFound;