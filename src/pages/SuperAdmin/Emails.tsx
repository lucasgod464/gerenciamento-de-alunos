import { DashboardLayout } from "@/components/DashboardLayout";
import { EmailList, Email } from "@/components/emails/EmailList";
import { EmailStats } from "@/components/emails/EmailStats";
import { CreateEmailDialog } from "@/components/emails/CreateEmailDialog";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Emails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmails = async () => {
    try {
      const { data: emailsData, error } = await supabase
        .from("emails")
        .select(`
          *,
          companies (
            name,
            status
          )
        `);

      if (error) throw error;

      const formattedEmails: Email[] = emailsData.map((email: any) => ({
        id: email.id,
        name: email.name,
        email: email.email,
        accessLevel: email.access_level,
        companyId: email.company_id,
        companyName: email.companies?.name,
        companyStatus: email.companies?.status,
        createdAt: email.created_at,
        updatedAt: email.updated_at
      }));

      setEmails(formattedEmails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os emails.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleUpdateEmail = async (updatedEmail: Email) => {
    try {
      const { error } = await supabase
        .from("emails")
        .update({
          name: updatedEmail.name,
          email: updatedEmail.email,
          access_level: updatedEmail.accessLevel,
          company_id: updatedEmail.companyId,
        })
        .eq("id", updatedEmail.id);

      if (error) throw error;

      toast({
        title: "Email atualizado",
        description: "O email foi atualizado com sucesso.",
      });
      
      fetchEmails();
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o email.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmail = async (id: string) => {
    try {
      const { error } = await supabase
        .from("emails")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Email excluído",
        description: "O email foi excluído com sucesso.",
      });
      
      fetchEmails();
    } catch (error) {
      console.error("Error deleting email:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o email.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Gerenciamento de Emails</h1>
          <p className="text-muted-foreground">
            Gerencie todos os emails cadastrados no sistema
          </p>
        </div>

        <EmailStats emails={emails} />

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de Emails</h2>
          <CreateEmailDialog onEmailCreated={fetchEmails} />
        </div>

        <EmailList
          data={emails}
          onUpdateEmail={handleUpdateEmail}
          onDeleteEmail={handleDeleteEmail}
        />
      </div>
    </DashboardLayout>
  );
};

export default Emails;