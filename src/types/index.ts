import { Tables } from "./supabase";

export type ProductsWithCategory = Tables<"product"> & {
  category: Tables<"category">;
};

export type OrderWithCustomer = Tables<"order"> & {
  customer: (Tables<"customer"> & { users: Tables<"users"> | null })[] | any;
} & { users: Tables<"users"> | null };

export type ProductsWithCategoryWithColorsWithSizes = Tables<"product"> & {
  category: Tables<"category">;
} & {
  sizes: Tables<"sizes">;
} & {
  color: Tables<"color">;
} & {
  "sub-category": Tables<"sub-category">;
};
