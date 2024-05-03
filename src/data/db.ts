"use server";

import { Database } from "@/types/supabase";
import { supabaseServerClient } from "../lib/supabase/supabase-server";
import { getUser } from "@/actions/user";

export async function getItemFromDb(id: string | number) {
  const supabase = supabaseServerClient();
  const user = await getUser();

  if (!user?.data?.id) return JSON.stringify("No user found!");

  let response = await supabase
    .from("product")
    .select("*, color(*), sizes(*), category(*), sub-category(*)")
    .eq("id", id)
    .eq("user_id", user?.data?.id);
  return JSON.stringify(response);
}

export async function getAllItemsFromDb(
  item: keyof Database["public"]["Tables"],
) {
  const supabase = supabaseServerClient();
  let response = await supabase.from(item).select("*");
  return JSON.stringify(response);
}

export async function getAllImages() {
  const supabase = supabaseServerClient();
  const response = await supabase.storage.from("product_upload").list();
  return JSON.stringify(response);
}

export async function getAllCategoriesWithSubCategories() {
  const supabase = supabaseServerClient();
  let response = await supabase.from("category").select("*, sub-category(*)");
  return JSON.stringify(response);
}
