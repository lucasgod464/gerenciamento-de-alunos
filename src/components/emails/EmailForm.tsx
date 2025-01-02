import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatabaseAccessLevel } from "@/types/email"

interface Company {
  id: string;
  name: string;
}

interface EmailFormProps {
  onSubmit: (formData: FormData) => void;
  companies: Company[];
  generateStrongPassword: () => string;
}

export function EmailForm({ onSubmit, companies, generateStrongPassword }: EmailFormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(new FormData(e.currentTarget));
    }} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          placeholder="Digite o nome completo"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Digite o email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="flex gap-2">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Digite a senha"
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              const input = document.getElementById("password") as HTMLInputElement
              input.value = generateStrongPassword()
            }}
          >
            Gerar
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="accessLevel">Nível de Acesso</Label>
        <Select name="accessLevel" required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o nível de acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Administrador</SelectItem>
            <SelectItem value="Usuário Comum">Usuário Comum</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Empresa</Label>
        <Select name="company" required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a empresa" />
          </SelectTrigger>
          <SelectContent>
            {companies.length > 0 ? (
              companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-companies" disabled>
                Nenhuma empresa cadastrada
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Criar Email
      </Button>
    </form>
  );
}