/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const url = (import.meta.env.VITE_SUPABASE_URL || 'https://fwuxmeifaycjvrvludjr.supabase.co').trim().replace(/\/$/, '');
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3dXhtZWlmYXljanZydmx1ZGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzk5NDYsImV4cCI6MjA5MzgxNTk0Nn0.NhWY67oOMpNAvUS9tqhPH4EYvZHY86WnIQIKgqfeF00').trim();

  // Basic validation to prevent immediate crashes
  const isValidUrl = url.startsWith('http') && url.includes('.');
  const isValidKey = key.length > 20;

  if (!isValidUrl || !isValidKey) {
    console.error('Supabase configuration is invalid. App may crash.');
  }

  return { url, key, isValid: isValidUrl && isValidKey };
};

const config = getSupabaseConfig();
export const supabase = createClient(config.url, config.key);
