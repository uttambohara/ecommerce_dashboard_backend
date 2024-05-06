import { Table } from "lucide-react";
import { Tables } from "./supabase";

export type ProductsWithCategory = Tables<"product"> & {
  category: Tables<"category">;
};

export type OrderWithCustomer = Tables<"order"> & {
  customer: any;
} & { users: Tables<"users"> | null } & {
  product: Tables<"product">[];
} & {
  order_product: (Tables<"order_product"> & { product: Tables<"product">[] })[];
};

export type InvoiceWithOrderUsersAndPayment = Tables<"invoice"> & {
  order: (Tables<"order"> & { product: Tables<"product">[] }) | null;
} & {
  users: Tables<"users"> | null;
} & {
  payment: Tables<"payment">[];
} & {
  customer: (Tables<"customer"> & { users: Tables<"users"> | null }) | null;
} & {
  order_product: (Tables<"order_product"> & { product: Tables<"product">[] })[];
};

export type ProductsWithCategoryWithColorsWithSizes = Tables<"product"> & {
  category: Tables<"category">;
} & {
  sizes: Tables<"sizes">;
} & {
  color: Tables<"color">;
} & {
  "sub-category": Tables<"sub-category">;
};
