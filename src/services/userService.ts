import { supabase } from "@/integrations/supabase/client";
import { User, mapDatabaseUser } from "@/types/user";

export async function createUser({
  email,
  name,
  password,
  access_level,
  company_id,
  location,
  specialization,
  selectedRooms,
  selectedTags
}: {
  email: string;
  name: string;
  password: string;
  access_level: "Admin" | "Usuário Comum";
  company_id: string;
  location?: string;
  specialization?: string;
  selectedRooms: string[];
  selectedTags: { id: string; name: string; color: string; }[];
}) {
  // Check if email already exists
  const { data: existingEmails, error: checkError } = await supabase
    .from('emails')
    .select('id')
    .eq('email', email);

  if (checkError) {
    console.error('Error checking existing email:', checkError);
    throw checkError;
  }

  if (existingEmails && existingEmails.length > 0) {
    throw new Error("Este email já está cadastrado no sistema.");
  }

  // Create new user in emails table
  const { data: newUser, error: createError } = await supabase
    .from('emails')
    .insert({
      name,
      email,
      password,
      access_level,
      company_id,
      location,
      specialization,
      status: 'active'
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating user:', createError);
    throw createError;
  }

  if (!newUser) {
    throw new Error('No data returned after creating user');
  }

  console.log('User created successfully:', newUser);

  // Insert room authorizations
  if (selectedRooms.length > 0) {
    console.log('Creating room authorizations:', selectedRooms);
    const { error: roomsError } = await supabase
      .from('user_authorized_rooms')
      .insert(
        selectedRooms.map(roomId => ({
          user_id: newUser.id,
          room_id: roomId
        }))
      );

    if (roomsError) {
      console.error('Error creating room authorizations:', roomsError);
      throw roomsError;
    }
  }

  // Insert user tags
  if (selectedTags.length > 0) {
    console.log('Creating user tags:', selectedTags);
    const { error: tagsError } = await supabase
      .from('user_tags')
      .insert(
        selectedTags.map(tag => ({
          user_id: newUser.id,
          tag_id: tag.id
        }))
      );

    if (tagsError) {
      console.error('Error creating user tags:', tagsError);
      throw tagsError;
    }
  }

  const createdUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    role: newUser.access_level === 'Admin' ? 'ADMIN' : 'USER',
    company_id: newUser.company_id,
    created_at: newUser.created_at,
    last_access: null,
    status: 'active',
    access_level: newUser.access_level,
    location: newUser.location || null,
    specialization: newUser.specialization || null,
    authorizedRooms: selectedRooms,
    tags: selectedTags
  };

  return createdUser;
}
