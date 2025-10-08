import { createClient } from "@supabase/supabase-js";

console.log("ENV URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("ENV KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 10) + "...");

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
