import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const isPlaceholder = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id');

if (isPlaceholder && typeof window !== 'undefined') {
  console.warn(
    '⚠️ Supabase credentials missing or set to placeholders. ' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const hasSupabaseConfig = !isPlaceholder;
