import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileForm } from "@/hooks/useProfileForm";
import { ProfileFormFields } from "../shared/ProfileFormFields";

export const SuperAdminProfile = () => {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleUpdateProfile,
    handleLogout,
  } = useProfileForm();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileFormFields
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