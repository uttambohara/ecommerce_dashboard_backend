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
      category: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      color: {
        Row: {
          created_at: string
          hex: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          hex: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          hex?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      customer: {
        Row: {
          address: string | null
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice: {
        Row: {
          amount: number | null
          created_at: string
          customer_id: number | null
          dueDate: string | null
          id: number
          invoice_id: string | null
          order_id: number | null
          vendor_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          customer_id?: number | null
          dueDate?: string | null
          id?: number
          invoice_id?: string | null
          order_id?: number | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          customer_id?: number | null
          dueDate?: string | null
          id?: number
          invoice_id?: string | null
          order_id?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order: {
        Row: {
          created_at: string
          customer_id: number | null
          id: number
          order_date: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: number | null
          id?: number
          order_date?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: number | null
          id?: number
          order_date?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_product: {
        Row: {
          created_at: string
          order_id: number
          product_id: number
          quantity: number | null
        }
        Insert: {
          created_at?: string
          order_id: number
          product_id: number
          quantity?: number | null
        }
        Update: {
          created_at?: string
          order_id?: number
          product_id?: number
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_product_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      payment: {
        Row: {
          amount: number | null
          created_at: string
          customer_id: number | null
          id: number
          invoice_id: number | null
          method: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          invoice_id?: number | null
          method?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          invoice_id?: number | null
          method?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          category_id: number
          created_at: string
          description: string
          discount: number
          id: number
          name: string
          productImgs: Json
          publishDate: string
          quantity: number
          salesPrice: number
          sku: string
          sub_category_id: number
          user_id: string
        }
        Insert: {
          category_id: number
          created_at?: string
          description: string
          discount: number
          id?: number
          name: string
          productImgs: Json
          publishDate: string
          quantity: number
          salesPrice: number
          sku: string
          sub_category_id: number
          user_id: string
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string
          discount?: number
          id?: number
          name?: string
          productImgs?: Json
          publishDate?: string
          quantity?: number
          salesPrice?: number
          sku?: string
          sub_category_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub-category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      product_color: {
        Row: {
          color_id: number
          created_at: string
          product_id: number
        }
        Insert: {
          color_id: number
          created_at?: string
          product_id: number
        }
        Update: {
          color_id?: number
          created_at?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_color_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "color"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_color_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product_size: {
        Row: {
          created_at: string
          product_id: number
          size_id: number
        }
        Insert: {
          created_at?: string
          product_id: number
          size_id: number
        }
        Update: {
          created_at?: string
          product_id?: number
          size_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_size_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_size_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      sizes: {
        Row: {
          code: string | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      "sub-category": {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub-category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar_url: string | null
          email: string
          full_name: string | null
          id: string
          phone_number: number | null
          role: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          email: string
          full_name?: string | null
          id: string
          phone_number?: number | null
          role?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: number | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: "PENDING" | "REJECTED" | "CANCELED" | "COMPLETED"
      payment_status: "PAID" | "CANCELED"
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
