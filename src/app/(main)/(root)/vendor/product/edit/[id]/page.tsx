import { getUser } from "@/actions/user";
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
  const user = await getUser();
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

  // Image parsed
  const { data } = JSON.parse(imagesResponse);
  if (!data) {
    throw new Error("Failed to fetch images");
  }

  const categoriesParsed = JSON.parse(categoriesResponse);
  if (categoriesParsed.data?.length === 0) {
    throw new Error("Failed to fetch categories data");
  }

  const individualProductParsed = JSON.parse(indvProductResponse);
  if (!individualProductParsed.data) {
    throw new Error("Failed to fetch product data");
  }

  // ------------------ No product found----------------------------
  if (individualProductParsed.data.length === 0) {
    return (
      <div className="h-100">
        <h2 className="text-3xl italic">
          No product with (id: {params.id}) found
        </h2>
      </div>
    );
  }

  const colors: Tables<"color">[] = colorParsed.data;
  const sizes: Tables<"sizes">[] = sizesParsed.data;
  type SubCategory = Tables<"sub-category">[];
  const categories: (Tables<"category"> & {
    "sub-category": SubCategory;
  })[] = categoriesParsed.data;

  return (
    <div className="space-y-6">
      <MainHeader title={"Create products"} useBreadcrumb={false} />
      <CreateProductDetails
        colors={colors}
        sizes={sizes}
        categories={categories}
        data={individualProductParsed.data[0]}
        user_id={user?.data?.id}
      />
    </div>
  );
}
