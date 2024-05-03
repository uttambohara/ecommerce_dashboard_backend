import CreateProductDetails from "@/components/form/create-product-details";
import MainHeader from "@/components/layouts/section-header";
import {
  getAllCategoriesWithSubCategories,
  getAllImages,
  getAllItemsFromDb,
  getItemFromDb,
} from "@/data/db";

import { Tables } from "@/types/supabase";

export default async function EditProduct({
  params,
}: {
  params: { id: number | string };
}) {
  const [
    indvProductResponse,
    colorsResponse,
    sizesResponse,
    imagesResponse,
    categoriesResponse,
  ] = await Promise.all([
    getItemFromDb(params.id),
    getAllItemsFromDb("color"),
    getAllItemsFromDb("sizes"),
    getAllImages(),
    getAllCategoriesWithSubCategories(),
  ]);

  const colorParsed = JSON.parse(colorsResponse);
  if (!colorParsed.data) {
    throw new Error("Failed to fetch colors data");
  }

  const sizesParsed = JSON.parse(sizesResponse);
  if (!sizesParsed.data) {
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

  const categoriesParsed = JSON.parse(categoriesResponse);
  if (categoriesParsed.data?.length === 0) {
    throw new Error("Failed to fetch categories data");
  }

  const individualProductParsed = JSON.parse(indvProductResponse);
  if (!individualProductParsed.data) {
    throw new Error("Failed to fetch product data");
  }
  if (individualProductParsed.data.length === 0) {
    return (
      <div className="h-100">
        <h2 className="text-3xl italic">No product with {params.id} found</h2>
      </div>
    );
  }

  const colors: Tables<"color">[] = colorParsed.data;
  const sizes: Tables<"sizes">[] = sizesParsed.data;
  type SubCategory = Tables<"sub_category">[];
  const categories: (Tables<"category"> & {
    "sub-category": SubCategory;
  })[] = categoriesParsed.data;

  console.log(individualProductParsed.data[0]);

  return (
    <div className="space-y-6">
      <MainHeader title={"Create products"} useBreadcrumb={false} />
      <CreateProductDetails
        colors={colors}
        sizes={sizes}
        posts={posts}
        categories={categories}
        data={individualProductParsed.data[0]}
      />
    </div>
  );
}
