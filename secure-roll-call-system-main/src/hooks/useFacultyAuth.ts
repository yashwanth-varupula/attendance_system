import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function useFacultyAuth() {
  const [loading, setLoading] = useState(true);
  const [isFaculty, setIsFaculty] = useState(false);

  useEffect(() => {
    (async () => {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        setIsFaculty(false);
        return;
      }

      const uid = session.user.id;

      // Check if this user is in faculty table AND authorized
      const { data, error } = await supabase
        .from("faculty")
        .select("authorized")
        .eq("user_id", uid)
        .single();

      if (error || !data?.authorized) {
        setIsFaculty(false);
      } else {
        setIsFaculty(true);
      }

      setLoading(false);
    })();
  }, []);

  return { loading, isFaculty };
}
