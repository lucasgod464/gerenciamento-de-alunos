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
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
      <div className="relative group">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage src={avatarUrl} className="object-cover" />
          <AvatarFallback className="text-lg">{name?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="avatar-upload"
          onChange={onImageUpload}
        />
        <Label 
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg cursor-pointer
                   transition-transform transform group-hover:scale-110"
        >
          <Camera className="h-4 w-4 text-gray-600" />
        </Label>
      </div>
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
        <p className="text-sm text-gray-500 mt-1">Administrador</p>
      </div>
    </div>
  );
};