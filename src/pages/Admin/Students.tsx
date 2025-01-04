import { DashboardLayout } from "@/components/DashboardLayout";
import { StudentRegistration } from "@/components/user/StudentRegistration";

const AdminStudents = () => {
  return (
    <DashboardLayout role="admin">
      <StudentRegistration />
    </DashboardLayout>
  );
};

export default AdminStudents;