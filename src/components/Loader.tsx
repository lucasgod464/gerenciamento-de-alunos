import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );
}