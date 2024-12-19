interface CompanyHeaderProps {
  title: string
  description: string
}

export function CompanyHeader({ title, description }: CompanyHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}