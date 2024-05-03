"use server";

import { supabaseServerClient } from "@/lib/supabase/supabase-server";

export async function getUser() {
  const supabase = supabaseServerClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;
  const response = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();
  return response;
}
