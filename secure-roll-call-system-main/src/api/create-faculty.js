import { createClient } from "@supabase/supabase-js";

// ⚠️ Replace with your own Supabase project values
const SUPABASE_URL = "https://ojhquzvtkdpgcokezirb.supabase.co";
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaHF1enZ0a2RwZ2Nva2V6aXJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4MzU3NiwiZXhwIjoyMDY3OTU5NTc2fQ.scynzOgdepqbanOqfIDHz9HEDJ8BxNI5LGE1AvEZzOs"; // not anon key!

// Create admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function createFaculty(email, password, name, employee_id) {
  try {
    // 1) Create Supabase Auth user
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, employee_id },
      email_confirm: true
    });
    if (userError) throw userError;

    // 2) Insert into faculty table
    const { data: faculty, error: facError } = await supabaseAdmin
      .from("faculty")
      .insert([{ user_id: user.user.id, name, employee_id, authorized: true }])
      .select()
      .single();
    if (facError) throw facError;

    console.log("✅ Faculty created:", faculty);
  } catch (err) {
    console.error("❌ Error creating faculty:", err.message);
  }
}

// Example usage (replace with real teacher details)
createFaculty("teacher1@college.edu", "StrongPassword123", "Dr. John Smith", "EMP001");
