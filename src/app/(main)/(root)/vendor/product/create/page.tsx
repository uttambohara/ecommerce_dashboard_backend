import { getUser } from "@/actions/user";
import CreateProductDetails from "@/components/form/create-product-details";
import MainHeader from "@/components/layouts/section-header";
import {
  getAllCategoriesWithSubCategories,
  getAllImages,
  getAllItemsFromDb,
} from "@/data/db";

import { Tables } from "@/types/supabase";

type SubCategory = Tables<"sub-category">[];

export default async function CreateProduct() {
  const user = await getUser();
  const [colorsResponse, sizesResponse, imagesResponse, categoriesResponse] =
    await Promise.all([
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
  if (!categoriesParsed.data) {
    throw new Error("Failed to fetch categories data");
  }

  const colors: Tables<"color">[] = colorParsed.data;
  const sizes: Tables<"sizes">[] = sizesParsed.data;
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
        user_id={user?.data?.id}
      />
    </div>
  );
}
