// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kpfpofjilwlbmuzlaqwz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZnBvZmppbHdsYm11emxhcXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTU0NTgsImV4cCI6MjA2MzIzMTQ1OH0.tX6pX8MmPLVVymm-myb-1zgHhIOYItEBEWhuuFfQVTI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);