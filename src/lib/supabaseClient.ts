import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

// Singleton Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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