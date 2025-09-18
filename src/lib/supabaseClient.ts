import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Singleton Supabase client
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// Types pour TypeScript
export interface Note {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  embedding: number[];
}

export interface SearchResult {
  id: number;
  content: string;
  similarity: number;
}