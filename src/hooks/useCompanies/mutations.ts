import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/components/companies/CompanyList";
import { toast } from "@/components/ui/use-toast";

export async function updateCompany(company: Company) {
  console.log("Updating company:", company);

  // Verificar contagens atuais
  const { data: currentData } = await supabase
    .from("companies")
    .select(`
      *,
      emails:emails(count),
      rooms:rooms(count)
    `)
    .eq("id", company.id)
    .single();

  if (!currentData) {
    throw new Error("Empresa não encontrada");
  }

  const { data, error } = await supabase
    .from("companies")
    .update({
      name: company.name,
      users_limit: company.usersLimit,
      rooms_limit: company.roomsLimit,
      status: company.status,
      current_users: currentData.emails[0]?.count || 0,
      current_rooms: currentData.rooms[0]?.count || 0
    })
    .eq("id", company.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating company:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    document: data.document,
    usersLimit: data.users_limit,
    currentUsers: currentData.emails[0]?.count || 0,
    roomsLimit: data.rooms_limit,
    currentRooms: currentData.rooms[0]?.count || 0,
    status: data.status,
    createdAt: new Date(data.created_at).toLocaleDateString(),
    publicFolderPath: data.public_folder_path,
    storageUsed: data.storage_used,
  };
}

export async function deleteCompany(id: string) {
  console.log("Deleting company:", id);
  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting company:", error);
    throw error;
  }

  return id;
}

export async function createCompany(newCompany: Omit<Company, "id" | "createdAt">) {
  // Verificar se a empresa já existe pelo documento
  const { data: existingCompany } = await supabase
    .from("companies")
    .select()
    .eq("document", newCompany.document)
    .single();

  if (existingCompany) {
    toast({
      title: "Erro ao criar empresa",
      description: "Já existe uma empresa com este documento.",
      variant: "destructive",
    });
    throw new Error("Empresa já existe");
  }

  const { data, error } = await supabase
    .from("companies")
    .insert([{
      name: newCompany.name,
      document: newCompany.document,
      users_limit: newCompany.usersLimit,
      rooms_limit: newCompany.roomsLimit,
      status: newCompany.status,
      public_folder_path: newCompany.publicFolderPath,
      storage_used: 0,
      current_users: 0,
      current_rooms: 0
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating company:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    document: data.document,
    usersLimit: data.users_limit,
    currentUsers: 0,
    roomsLimit: data.rooms_limit,
    currentRooms: 0,
    status: data.status,
    createdAt: new Date(data.created_at).toLocaleDateString(),
    publicFolderPath: data.public_folder_path,
    storageUsed: data.storage_used,
  };
}