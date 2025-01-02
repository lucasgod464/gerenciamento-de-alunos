export type UserStatus = 'active' | 'inactive';
export type DatabaseAccessLevel = 'Admin' | 'Usuário Comum' | 'Inativo';
export type AccessLevel = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export const mapDatabaseAccessLevelToAccessLevel = (dbLevel: DatabaseAccessLevel): AccessLevel => {
  switch (dbLevel) {
    case 'Admin':
      return 'ADMIN';
    case 'Usuário Comum':
      return 'USER';
    case 'Inativo':
      return 'USER'; // or handle differently if needed
    default:
      return 'USER';
  }
};

export const mapAccessLevelToDatabaseLevel = (level: AccessLevel): DatabaseAccessLevel => {
  switch (level) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return 'Admin';
    case 'USER':
      return 'Usuário Comum';
    default:
      return 'Usuário Comum';
  }
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AccessLevel;
  company_id: string | null;
  created_at: string | null;
  last_access: string | null;
  status: UserStatus;
  access_level: DatabaseAccessLevel;
  location?: string | null;
  specialization?: string | null;
  authorizedRooms?: string[];
  tags?: { id: string; name: string; color: string; }[];
  responsibleCategory?: string;
}