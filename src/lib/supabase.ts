/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fwuxmeifaycjvrvludjr.supabase.co';
const supabaseUrl = rawUrl.trim().replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3dXhtZWlmYXljanZydmx1ZGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzk5NDYsImV4cCI6MjA5MzgxNTk0Nn0.NhWY67oOMpNAvUS9tqhPH4EYvZHY86WnIQIKgqfeF00').trim();

console.log('--- SUPABASE CONFIG CHECK ---');
console.log('URL:', supabaseUrl);
console.log('Key defined:', !!supabaseAnonKey);
if (supabaseUrl.includes('run.app')) {
  console.error('CRITICAL: VITE_SUPABASE_URL is pointing to a Cloud Run URL instead of Supabase.');
}
console.log('----------------------------');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co') {
  console.warn('Supabase credentials are missing or default. Check your .env file or Settings.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
