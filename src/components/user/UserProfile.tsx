import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileForm } from "@/hooks/useProfileForm";
import { ProfileFormFields } from "../shared/ProfileFormFields";

export const UserProfile = () => {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleUpdateProfile,
    handleLogout,
  } = useProfileForm({ name: "" });

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileFormFields
            showNameField={true}
            formData={formData}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onSubmit={handleUpdateProfile}
            onLogout={handleLogout}
          />
        </CardContent>
      </Card>
    </div>
  );
};