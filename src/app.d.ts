// app.d.ts
import type { SupabaseClient, Session, User } from '@supabase/supabase-js'
import type { Database } from './database.types.ts' // import generated types

declare global {
  namespace App {
    interface Error {
      message: string
      code?: string
    }
    interface Locals {
      supabase: SupabaseClient<Database>
      safeGetSession: () => Promise<{
        session: Session | null;
        user: User | null;
      }>
      session: Session | null
      user: User | null
    }
    interface PageData {
      session: Session | null
      user: User | null
      theme: "coffee" | "caramellatte"
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
