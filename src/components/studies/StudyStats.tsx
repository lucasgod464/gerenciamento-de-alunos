import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

interface StudyStatsProps {
  totalStudies: number
  activeStudies: number
}

export function StudyStats({ totalStudies, activeStudies }: StudyStatsProps) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total de Estudos
            </p>
            <h2 className="text-2xl font-bold">{totalStudies}</h2>
            <p className="text-sm text-muted-foreground">
              {activeStudies} estudos ativos
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
