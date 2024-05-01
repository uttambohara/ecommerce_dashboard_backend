"use server";

import { Database } from "@/types/supabase";
import { supabaseServerClient } from "./supabase/supabase-server";

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
