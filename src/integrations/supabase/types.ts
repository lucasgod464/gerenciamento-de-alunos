export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          company_id: string | null
          created_at: string
          id: string
          name: string
          status: boolean | null
        }
        Insert: {
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
          status?: boolean | null
        }
        Update: {
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          current_rooms: number
          current_users: number
          document: string
          id: string
          name: string
          public_folder_path: string
          rooms_limit: number
          status: string
          storage_used: number
          users_limit: number
        }
        Insert: {
          created_at?: string
          current_rooms?: number
          current_users?: number
          document: string
          id?: string
          name: string
          public_folder_path: string
          rooms_limit?: number
          status?: string
          storage_used?: number
          users_limit?: number
        }
        Update: {
          created_at?: string
          current_rooms?: number
          current_users?: number
          document?: string
          id?: string
          name?: string
          public_folder_path?: string
          rooms_limit?: number
          status?: string
          storage_used?: number
          users_limit?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          name: string
          status: boolean | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
          status?: boolean | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          access_level: Database["public"]["Enums"]["email_access_level"]
          company_id: string
          created_at: string
          email: string
          id: string
          location: string | null
          name: string
          password: string
          specialization: string | null
          status: string
          updated_at: string
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["email_access_level"]
          company_id: string
          created_at?: string
          email: string
          id?: string
          location?: string | null
          name: string
          password: string
          specialization?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["email_access_level"]
          company_id?: string
          created_at?: string
          email?: string
          id?: string
          location?: string | null
          name?: string
          password?: string
          specialization?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment_form_fields: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          label: string
          name: string
          options: Json | null
          order: number
          required: boolean | null
          type: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          label: string
          name: string
          options?: Json | null
          order: number
          required?: boolean | null
          type: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          name?: string
          options?: Json | null
          order?: number
          required?: boolean | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_form_fields_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      room_authorized_users: {
        Row: {
          created_at: string
          id: string
          is_main_teacher: boolean | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_main_teacher?: boolean | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_main_teacher?: boolean | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_authorized_users_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_authorized_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      room_students: {
        Row: {
          created_at: string
          id: string
          room_id: string | null
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_id?: string | null
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_students_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          category: string
          company_id: string | null
          created_at: string
          id: string
          location: string
          name: string
          schedule: string
          status: boolean
          study_room: string | null
        }
        Insert: {
          category: string
          company_id?: string | null
          created_at?: string
          id?: string
          location: string
          name: string
          schedule: string
          status?: boolean
          study_room?: string | null
        }
        Update: {
          category?: string
          company_id?: string | null
          created_at?: string
          id?: string
          location?: string
          name?: string
          schedule?: string
          status?: boolean
          study_room?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rooms_category"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      specializations: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          status: boolean | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: boolean | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "specializations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          birth_date: string
          company_id: string | null
          created_at: string
          custom_fields: Json | null
          document: string | null
          email: string | null
          id: string
          name: string
          status: boolean | null
        }
        Insert: {
          address?: string | null
          birth_date: string
          company_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          document?: string | null
          email?: string | null
          id?: string
          name: string
          status?: boolean | null
        }
        Update: {
          address?: string | null
          birth_date?: string
          company_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "students_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      studies: {
        Row: {
          company_id: string | null
          created_at: string
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "studies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          status: boolean | null
        }
        Insert: {
          color?: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: boolean | null
        }
        Update: {
          color?: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_authorized_rooms: {
        Row: {
          created_at: string
          id: string
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_authorized_rooms_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_authorized_rooms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      user_specializations: {
        Row: {
          created_at: string
          id: string
          specialization_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          specialization_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          specialization_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_tags: {
        Row: {
          created_at: string
          id: string
          tag_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          tag_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          tag_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          company_id: string | null
          created_at: string | null
          email: string
          id: string
          last_access: string | null
          name: string
          password: string
          role: string
          status: boolean | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_access?: string | null
          name: string
          password: string
          role: string
          status?: boolean | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_access?: string | null
          name?: string
          password?: string
          role?: string
          status?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_login: {
        Args: {
          p_email: string
          p_password: string
        }
        Returns: {
          id: string
          email: string
          name: string
          role: string
          company_id: string
          created_at: string
          last_access: string
        }[]
      }
    }
    Enums: {
      email_access_level: "Admin" | "Usuário Comum"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
