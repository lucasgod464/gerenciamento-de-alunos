import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/components/companies/CompanyList";
import { toast } from "@/components/ui/use-toast";

export async function updateCompany(updatedCompany: Company) {
  console.log("Updating company:", updatedCompany);
  
  // Primeiro busca os dados atuais da empresa
  const { data: currentData, error: countError } = await supabase
    .from("companies")
    .select(`
      *,
      emails:emails(count),
      rooms:rooms(count)
    `)
    .eq("id", updatedCompany.id)
    .single();

  if (countError) {
    console.error("Error getting company counts:", countError);
    throw countError;
  }

  const { data, error } = await supabase
    .from("companies")
    .update({
      name: updatedCompany.name,
      users_limit: updatedCompany.usersLimit,
      rooms_limit: updatedCompany.roomsLimit,
      status: updatedCompany.status,
    })
    .eq("id", updatedCompany.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating company:", error);
    toast({
      title: "Erro ao atualizar empresa",
      description: "Verifique se você tem permissão para atualizar empresas.",
      variant: "destructive",
    });
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    document: data.document,
    usersLimit: data.users_limit,
    currentUsers: currentData.emails?.count || 0,
    roomsLimit: data.rooms_limit,
    currentRooms: currentData.rooms?.count || 0,
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
    toast({
      title: "Erro ao deletar empresa",
      description: "Verifique se você tem permissão para deletar empresas.",
      variant: "destructive",
    });
    throw error;
  }

  return id;
}

export async function createCompany(newCompany: Omit<Company, "id" | "createdAt">) {
  console.log("Creating new company:", newCompany);
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
    }])
    .select(`
      *,
      emails:emails(count),
      rooms:rooms(count)
    `)
    .single();

  if (error) {
    console.error("Error creating company:", error);
    toast({
      title: "Erro ao criar empresa",
      description: "Verifique se você tem permissão para criar empresas.",
      variant: "destructive",
    });
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    document: data.document,
    usersLimit: data.users_limit,
    currentUsers: data.emails?.count || 0,
    roomsLimit: data.rooms_limit,
    currentRooms: data.rooms?.count || 0,
    status: data.status,
    createdAt: new Date(data.created_at).toLocaleDateString(),
    publicFolderPath: data.public_folder_path,
    storageUsed: data.storage_used,
  };
}