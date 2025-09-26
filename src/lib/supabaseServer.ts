import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fnvktkjzfpxgimlmxbci.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudmt0a2p6ZnB4Z2ltbG14YmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODk4NzMsImV4cCI6MjA3NDM2NTg3M30.p1dRGJ_kWsGowvNTzwvCjk3dgprqaFzgeRc4rf7xhi8';

// lightweight server client
export const supabaseServerClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
