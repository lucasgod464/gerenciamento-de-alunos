import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/components/companies/CompanyList";
import { toast } from "@/components/ui/use-toast";

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

  const { data: emailsCount } = await supabase
    .from("emails")
    .select("count")
    .eq("company_id", newCompany.id);

  const { data: roomsCount } = await supabase
    .from("rooms")
    .select("count")
    .eq("company_id", newCompany.id);

  const { data, error } = await supabase
    .from("companies")
    .insert([{
      name: newCompany.name,
      document: newCompany.document,
      users_limit: newCompany.usersLimit,
      current_users: emailsCount?.count || 0,
      rooms_limit: newCompany.roomsLimit,
      current_rooms: roomsCount?.count || 0,
      status: newCompany.status,
      public_folder_path: newCompany.publicFolderPath,
      storage_used: 0,
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
    currentUsers: emailsCount?.count || 0,
    roomsLimit: data.rooms_limit,
    currentRooms: roomsCount?.count || 0,
    status: data.status,
    createdAt: new Date(data.created_at).toLocaleDateString(),
    publicFolderPath: data.public_folder_path,
    storageUsed: data.storage_used,
  };
}

export async function updateCompany(company: Company) {
  const { data: emailsCount } = await supabase
    .from("emails")
    .select("count")
    .eq("company_id", company.id);

  const { data: roomsCount } = await supabase
    .from("rooms")
    .select("count")
    .eq("company_id", company.id);

  const { data, error } = await supabase
    .from("companies")
    .update({
      name: company.name,
      users_limit: company.usersLimit,
      current_users: emailsCount?.count || 0,
      rooms_limit: company.roomsLimit,
      current_rooms: roomsCount?.count || 0,
      status: company.status,
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
    currentUsers: emailsCount?.count || 0,
    roomsLimit: data.rooms_limit,
    currentRooms: roomsCount?.count || 0,
    status: data.status,
    createdAt: new Date(data.created_at).toLocaleDateString(),
    publicFolderPath: data.public_folder_path,
    storageUsed: data.storage_used,
  };
}

export async function deleteCompany(id: string) {
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