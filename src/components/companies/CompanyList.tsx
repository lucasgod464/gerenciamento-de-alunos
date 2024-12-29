import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CompanyTableRow } from "./CompanyTableRow"
import { CompanyFilters } from "./CompanyFilters"

export interface Company {
  id: string
  name: string
  document: string
  usersLimit: number
  currentUsers: number
  roomsLimit: number
  currentRooms: number
  status: "Ativa" | "Inativa"
  createdAt: string
  publicFolderPath: string
  storageUsed: number
}

interface CompanyListProps {
  companies: Company[]
  onUpdateCompany: (company: Company) => void
  onDeleteCompany: (id: string) => void
}

export function CompanyList({
  companies,
  onUpdateCompany,
  onDeleteCompany,
}: CompanyListProps) {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")

  const handleUpdateCompany = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingCompany) return

    const formData = new FormData(event.currentTarget)
    const updatedCompany = {
      ...editingCompany,
      name: formData.get("name") as string,
      usersLimit: Number(formData.get("usersLimit")),
      roomsLimit: Number(formData.get("roomsLimit")),
    }

    onUpdateCompany(updatedCompany)
    setEditingCompany(null)
  }

  const handleUpdateStatus = (updatedCompany: Company) => {
    onUpdateCompany(updatedCompany)
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && company.status === "Ativa") ||
      (statusFilter === "inactive" && company.status === "Inativa")

    const matchesSearch = 
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.document.toLowerCase().includes(search.toLowerCase())

    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-4">
      <CompanyFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">EMPRESA</th>
                <th className="text-left p-4 font-medium text-gray-600">USUÁRIOS</th>
                <th className="text-left p-4 font-medium text-gray-600">SALAS</th>
                <th className="text-left p-4 font-medium text-gray-600">STATUS</th>
                <th className="text-left p-4 font-medium text-gray-600">CRIADO EM</th>
                <th className="text-right p-4 font-medium text-gray-600">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <CompanyTableRow
                  key={company.id}
                  company={company}
                  onDelete={onDeleteCompany}
                  onEdit={(company) => setEditingCompany(company)}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={editingCompany !== null}
        onOpenChange={(open) => !open && setEditingCompany(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Modifique os dados da empresa.
            </DialogDescription>
          </DialogHeader>
          {editingCompany && (
            <form onSubmit={handleUpdateCompany} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome da Empresa</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingCompany.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-usersLimit">
                  Limite de Usuários
                </Label>
                <Input
                  id="edit-usersLimit"
                  name="usersLimit"
                  type="number"
                  min="1"
                  defaultValue={editingCompany.usersLimit}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-roomsLimit">
                  Limite de Salas
                </Label>
                <Input
                  id="edit-roomsLimit"
                  name="roomsLimit"
                  type="number"
                  min="1"
                  defaultValue={editingCompany.roomsLimit}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}