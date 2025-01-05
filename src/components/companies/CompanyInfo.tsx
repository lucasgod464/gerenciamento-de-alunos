import { Building2, Folder } from "lucide-react"
import { Company } from "./CompanyList"

interface CompanyInfoProps {
  company: Company;
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 p-2 rounded-lg">
        <Building2 className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="font-medium text-gray-900">{company.name}</div>
        <div className="text-sm text-gray-500">
          ID: {company.id}
          <br />
          <span className="flex items-center gap-1 text-gray-400">
            <Folder className="w-4 h-4" />
            {company.publicFolderPath}
          </span>
        </div>
      </div>
    </div>
  );
}