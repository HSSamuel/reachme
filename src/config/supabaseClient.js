// 1. THIS IMPORT MUST BE HERE
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Console logs for debugging (optional)
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey);

// 2. Initialize
export const supabase = createClient(supabaseUrl, supabaseKey);
