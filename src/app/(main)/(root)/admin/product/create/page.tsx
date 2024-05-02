import CreateProductDetails from "@/components/form/create-products-details";
import MainHeader from "@/components/layouts/section-header";
import {
  getAllCategoriesWithSubCategories,
  getAllImages,
  getAllItemsFromDb,
} from "@/lib/db";

import { Tables } from "@/types/supabase";

export default async function CreateProduct() {
  const [colorsResponse, sizesResponse, imagesResponse, categoriesResponse] =
    await Promise.all([
      getAllItemsFromDb("color"),
      getAllItemsFromDb("sizes"),
      getAllImages(),
      getAllCategoriesWithSubCategories(),
    ]);

  const parsedResponse1 = JSON.parse(colorsResponse);
  if (!parsedResponse1.data) {
    throw new Error("Failed to fetch colors data");
  }

  const parsedResponse2 = JSON.parse(sizesResponse);
  if (!parsedResponse2.data) {
    throw new Error("Failed to fetch sizes data");
  }

  const { data } = JSON.parse(imagesResponse);
  if (!data) {
    throw new Error("Failed to fetch images");
  }

  // https://prgbwpzcwoxdqzqzvhdh.supabase.co/storage/v1/object/public/product_upload/photo-1713988665693-b92222aa2818.avif
  const posts = data
    .filter((post: any) => !post.name.includes(".emptyFolderPlaceholder"))
    .map((post: any) => {
      return {
        name: post.name,
        image: `https://prgbwpzcwoxdqzqzvhdh.supabase.co/storage/v1/object/public/product_upload/${post.name}`,
      };
    });

  const parsedResponse4 = JSON.parse(categoriesResponse);
  if (!parsedResponse4.data) {
    throw new Error("Failed to fetch categories data");
  }

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
