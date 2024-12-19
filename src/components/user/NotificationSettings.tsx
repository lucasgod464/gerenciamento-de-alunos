import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  notifications: {
    email: boolean;
    push: boolean;
  };
  setNotifications: React.Dispatch<React.SetStateAction<{
    email: boolean;
    push: boolean;
  }>>;
}

export const NotificationSettings = ({ notifications, setNotifications }: NotificationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notificações por Email</Label>
            <div className="text-sm text-muted-foreground">
              Receba atualizações por email
            </div>
          </div>
          <Switch
            checked={notifications.email}
            onCheckedChange={(checked) =>
              setNotifications((prev) => ({ ...prev, email: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notificações Push</Label>
            <div className="text-sm text-muted-foreground">
              Receba notificações no navegador
            </div>
          </div>
          <Switch
            checked={notifications.push}
            onCheckedChange={(checked) =>
              setNotifications((prev) => ({ ...prev, push: checked }))
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};