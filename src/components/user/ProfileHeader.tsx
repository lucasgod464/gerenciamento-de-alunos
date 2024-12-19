import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  name: string;
  avatarUrl: string;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({ name, avatarUrl, onImageUpload }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{name?.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="avatar-upload"
          onChange={onImageUpload}
        />
        <Label htmlFor="avatar-upload">
          <Button variant="outline" size="sm" asChild>
            <span>
              <Camera className="mr-2 h-4 w-4" />
              Alterar Foto
            </span>
          </Button>
        </Label>
      </div>
    </div>
  );
};