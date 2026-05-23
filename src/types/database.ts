// Types générés manuellement — à remplacer par `supabase gen types typescript` après connexion

export type ProductStatus = 'available' | 'claimed' | 'prize_pending' | 'prize_paid'
export type TransferMethod = 'initial_claim' | 'transfer'

export interface Database {
  public: {
    Tables: {
      drops: {
        Row: {
          id: string
          name: string
          description: string | null
          total_pieces: number
          total_winners: number
          release_date: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['drops']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['drops']['Insert']>
      }
      products: {
        Row: {
          id: string
          drop_id: string
          serial_number: number
          qr_token: string
          qr_token_hash: string
          is_winner: boolean
          prize_amount: number | null
          is_claimed: boolean
          claimed_at: string | null
          current_owner_id: string | null
          status: ProductStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'>
        Update: Partial<Pick<Database['public']['Tables']['users']['Row'], 'full_name'>>
      }
      ownership_history: {
        Row: {
          id: string
          product_id: string
          previous_owner_id: string | null
          new_owner_id: string
          transferred_at: string
          transfer_method: TransferMethod
        }
        Insert: Omit<Database['public']['Tables']['ownership_history']['Row'], 'id' | 'transferred_at'>
        Update: never
      }
      transfer_codes: {
        Row: {
          id: string
          product_id: string
          code: string
          created_by: string
          expires_at: string
          used: boolean
          used_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['transfer_codes']['Row'], 'id' | 'created_at' | 'expires_at' | 'used' | 'used_at'>
        Update: Pick<Database['public']['Tables']['transfer_codes']['Row'], 'used' | 'used_at'>
      }
      scan_logs: {
        Row: {
          id: string
          product_id: string | null
          qr_token_attempted: string
          scanned_at: string
          ip_address: string | null
          user_agent: string | null
          was_valid: boolean
          user_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['scan_logs']['Row'], 'id' | 'scanned_at'>
        Update: never
      }
    }
    Views: {
      products_public: {
        Row: {
          id: string
          drop_id: string
          drop_name: string
          serial_number: number
          qr_token_hash: string
          is_claimed: boolean
          claimed_at: string | null
          status: ProductStatus
          created_at: string
        }
      }
    }
    Enums: {
      product_status: ProductStatus
      transfer_method: TransferMethod
    }
  }
}
