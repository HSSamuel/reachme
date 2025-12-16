const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Temporary Debugging
console.log("DEBUG URL:", supabaseUrl); // Should print your URL
console.log("DEBUG KEY Length:", supabaseKey?.length); // Should print a number (e.g., 200+)

export const supabase = createClient(supabaseUrl, supabaseKey);
