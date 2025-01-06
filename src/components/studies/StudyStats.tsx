import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

interface StudyStatsProps {
  totalStudies: number
  activeStudies: number
}

export function StudyStats({ totalStudies, activeStudies }: StudyStatsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 mb-6">
      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total de Estudos
              </h3>
              <p className="text-2xl font-bold text-blue-600">{totalStudies}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground">
                Estudos Ativos
              </h3>
              <p className="text-2xl font-bold text-green-600">{activeStudies}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}