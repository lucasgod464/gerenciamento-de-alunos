import { Card, CardContent } from "@/components/ui/card"
import { Building2, CheckCircle2, XCircle } from "lucide-react"

interface CompanyStatsProps {
  totalCompanies: number
  activeCompanies: number
  inactiveCompanies: number
}

export function CompanyStats({
  totalCompanies,
  activeCompanies,
  inactiveCompanies,
}: CompanyStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Empresas
              </p>
              <h2 className="text-2xl font-bold">{totalCompanies}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Empresas Ativas
              </p>
              <h2 className="text-2xl font-bold">{activeCompanies}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Empresas Inativas
              </p>
              <h2 className="text-2xl font-bold">{inactiveCompanies}</h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
