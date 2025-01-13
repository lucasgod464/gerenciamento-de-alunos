import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface UserBasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
}

export const UserBasicInfo = ({ 
  formData, 
  setFormData, 
  newPassword, 
  setNewPassword 
}: UserBasicInfoProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializations, setSpecializations] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      const { data, error } = await supabase
        .from('specializations')
        .select('id, name')
        .eq('status', true)
        .order('name');

      if (error) {
        console.error('Error fetching specializations:', error);
        return;
      }

      setSpecializations(data || []);
    };

    fetchSpecializations();
  }, []);

  const handleSpecializationSelect = (specialization: { id: string; name: string }) => {
    const isAlreadySelected = selectedSpecializations.some(s => s.id === specialization.id);
    
    if (!isAlreadySelected) {
      const newSelectedSpecializations = [...selectedSpecializations, specialization];
      setSelectedSpecializations(newSelectedSpecializations);
      setFormData({ 
        ...formData, 
        specializations: newSelectedSpecializations.map(s => s.id)
      });
    }
  };

  const handleRemoveSpecialization = (specializationId: string) => {
    const newSelectedSpecializations = selectedSpecializations.filter(s => s.id !== specializationId);
    setSelectedSpecializations(newSelectedSpecializations);
    setFormData({ 
      ...formData, 
      specializations: newSelectedSpecializations.map(s => s.id)
    });
  };

  const filteredSpecializations = specializations.filter(spec => 
    spec.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSpecializations.some(s => s.id === spec.id)
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Especializações</Label>
        <Input
          placeholder="Buscar especializações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedSpecializations.map((spec) => (
            <Badge key={spec.id} variant="secondary" className="flex items-center gap-1">
              {spec.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveSpecialization(spec.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <ScrollArea className="h-32 border rounded-md">
          <div className="p-2">
            {filteredSpecializations.map((spec) => (
              <div
                key={spec.id}
                className="cursor-pointer p-2 hover:bg-accent rounded-md"
                onClick={() => handleSpecializationSelect(spec)}
              >
                {spec.name}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Nova Senha (opcional)</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Digite a nova senha se desejar alterá-la"
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
