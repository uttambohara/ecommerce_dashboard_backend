import { Tables } from "./supabase";

export type ProductsWithCategory = Tables<"product"> & {
  category: Tables<"category">;
};

export type ProductsWithCategoryWithColorsWithSizes = Tables<"product"> & {
  category: Tables<"category">;
} & {
  sizes: Tables<"sizes">;
} & {
  color: Tables<"color">;
};
