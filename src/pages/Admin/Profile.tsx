import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { Shield } from "lucide-react";

const Profile = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 p-4 md:p-6">
        <AdminProfile />
      </div>
    </DashboardLayout>
  );
};

export default Profile;