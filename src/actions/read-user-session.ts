"use server";

import { supabaseServerClient } from "@/lib/supabase/supabase-server";

export default async function readUserSession() {
  const supabase = supabaseServerClient();
  return supabase.auth.getSession();
}
