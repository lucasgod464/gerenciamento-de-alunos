import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormBuilder } from "@/components/form-builder/FormBuilder";

// Componente FormBuilder específico para a aba de Inscrição Online
const EnrollmentFormBuilder = () => {
  return (
    <FormBuilder 
      storageKey="enrollmentFormFields"
      defaultFields={[
        {
          id: "name",
          name: "fullName",
          label: "Nome Completo",
          type: "text",
          required: true,
          order: 0,
        },
        {
          id: "email",
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          order: 1,
        },
        {
          id: "phone",
          name: "phone",
          label: "Telefone",
          type: "tel",
          required: true,
          order: 2,
        }
      ]}
    />
  );
};

export function DashboardTabs() {
  return (
    <Tabs defaultValue="inscricao" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="inscricao" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Inscrição Online
        </TabsTrigger>
        <TabsTrigger value="alunos" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Alunos Total
        </TabsTrigger>
        <TabsTrigger value="avisos" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Avisos
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="inscricao">
        <Card>
          <CardHeader>
            <CardTitle>Inscrição Online</CardTitle>
          </CardHeader>
          <CardContent>
            <EnrollmentFormBuilder />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="alunos">
        <Card>
          <CardHeader>
            <CardTitle>Alunos Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Conteúdo da aba Alunos Total será implementado aqui.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="avisos">
        <Card>
          <CardHeader>
            <CardTitle>Avisos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Conteúdo da aba Avisos será implementado aqui.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}