import CreateProductDetails from "@/components/form/create-products-details";
import MainHeader from "@/components/global/main-header";
import {
  getAllCategoriesWithSubCategories,
  getAllImages,
  getAllItemsFromDb,
} from "@/lib/db";

import { Tables } from "@/types/supabase";

export default async function CreateProduct() {
  const response1 = await getAllItemsFromDb("color");
  const parsedResponse1 = JSON.parse(response1);

  const response2 = await getAllItemsFromDb("sizes");
  const parsedResponse2 = JSON.parse(response2);

  const response3 = await getAllImages();
  const { data } = JSON.parse(response3);

  // https://prgbwpzcwoxdqzqzvhdh.supabase.co/storage/v1/object/public/product_upload/photo-1713988665693-b92222aa2818.avif
  const posts = data
    .filter((post: any) => !post.name.includes(".emptyFolderPlaceholder"))
    .map((post: any) => {
      return {
        name: post.name,
        image: `https://prgbwpzcwoxdqzqzvhdh.supabase.co/storage/v1/object/public/product_upload/${post.name}`,
      };
    });

  const response4 = await getAllCategoriesWithSubCategories();
  const parsedResponse4 = JSON.parse(response4);

  const colors: Tables<"color">[] = parsedResponse1.data;
  const sizes: Tables<"sizes">[] = parsedResponse2.data;
  // ...
  type SubCategory = Tables<"sub-category">[];
  const categories: (Tables<"category"> & {
    "sub-category": SubCategory;
  })[] = parsedResponse4.data;

  return (
    <div className="space-y-8">
      <MainHeader title={"Create products"} />
      <CreateProductDetails
        colors={colors}
        sizes={sizes}
        posts={posts}
        categories={categories}
      />
    </div>
  );
}
