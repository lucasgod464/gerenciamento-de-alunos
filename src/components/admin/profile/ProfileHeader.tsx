import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  avatarUrl: string;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({ name, avatarUrl, onImageUpload }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{name?.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold">{name}</h2>
        <div className="mt-2">
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
    </div>
  );
};
