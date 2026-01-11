
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

const SUPABASE_URL = "https://fsowenkhfqoypvbjgibi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzb3dlbmtoZnFveXB2YmpnaWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNzQwNjgsImV4cCI6MjA2ODY1MDA2OH0.tUYKrVDpOlR2gy39hfZ4u8g-LCUstKsO-6Gf2zWfI2Q";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
