// This file should be generated from your Supabase schema
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts
// For now, this is a placeholder with common types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          display_name: string | null
          booking_email: string | null
          credits_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          booking_email?: string | null
          credits_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          display_name?: string | null
          booking_email?: string | null
          credits_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      venues: {
        Row: {
          id: string
          name: string
          email: string | null
          city: string | null
          state: string | null
          description: string | null
          music_focus: string[] | null
          venue_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          city?: string | null
          state?: string | null
          description?: string | null
          music_focus?: string[] | null
          venue_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          city?: string | null
          state?: string | null
          description?: string | null
          music_focus?: string[] | null
          venue_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
