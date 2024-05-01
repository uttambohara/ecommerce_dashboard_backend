"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import supabaseBrowserClient from "@/lib/supabase/supabase-client";
import { cn, extractNumber } from "@/lib/utils";
import { Tables } from "@/types/supabase";
import clsx from "clsx";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { toast } from "sonner";
import FileUpload from "../global/file-upload";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  salesPrice: z.string().min(2, {
    message: "Price must be at least 2 characters.",
  }),
  discount: z.string().min(2, {
    message: "Discount must be at least 2 characters.",
  }),
  sku: z.string().min(2, {
    message: "SKU must be at least 2 characters.",
  }),
  publishDate: z.date(),
});

type FormSchema = z.infer<typeof formSchema>;

// Supabase Types needed
type Size = Tables<"sizes">;
type Color = Tables<"color">;
type SubCategory = Tables<"sub-category">;
type Category = Tables<"category">;
type CategoryWithSubCategory = (Tables<"category"> & {
  "sub-category": SubCategory[];
})[];

interface ProductState {
  sizes: Size[];
  colors: Color[];
  productImgs: { name: string; image: string }[];
  categories: Category | null;
  sub_categories: SubCategory | null;
}

const initialState: ProductState = {
  sizes: [],
  colors: [],
  productImgs: [],
  categories: null,
  sub_categories: null,
};

const reducer = (
  state: ProductState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case "SET_SIZE":
      const { sizes } = state;
      const sizeIndex = sizes.findIndex(
        (size) => size.id === action.payload.id,
      );
      if (sizeIndex === -1) {
        return { ...state, sizes: [...sizes, action.payload] };
      } else {
        return {
          ...state,
          sizes: sizes.filter((color, index) => index !== sizeIndex),
        };
      }
    case "SET_COLOR":
      const { colors } = state;
      const colorIndex = colors.findIndex(
        (color) => color.id === action.payload.id,
      );
      if (colorIndex === -1) {
        return { ...state, colors: [...colors, action.payload] };
      } else {
        return {
          ...state,
          colors: colors.filter((color, index) => index !== colorIndex),
        };
      }
    case "SET_IMAGES":
      return { ...state, productImgs: action.payload };
    case "REMOVE_IMAGE": {
      const imageName = action.payload;
      const updatedPosts = state.productImgs.filter(
        (post) => post.name !== imageName,
      );
      return { ...state, productImgs: updatedPosts };
    }
    case "SET_CATEGORY_SUBCATEGORY_IDS":
      return {
        ...state,
        categories: action.payload.categories,
        sub_categories: action.payload.sub_categories,
      };
    case "SET_PUBLISHED_DATE":
      return { ...state, publishedDate: action.payload };
    default:
      return state;
  }
};

interface CreateProductDetailsProps {
  colors: Tables<"color">[];
  sizes: Tables<"sizes">[];
  posts: { name: string; image: string }[];
  categories: CategoryWithSubCategory;
}

export default function CreateProductDetails({
  colors,
  sizes,
  posts,
  categories,
}: CreateProductDetailsProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Default image load
  useEffect(() => {
    dispatch({ type: "SET_IMAGES", payload: posts });
  }, []);

  //...
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      salesPrice: "Rs. 100.00",
      discount: "10%",
      sku: "",
      publishDate: new Date(),
    },
  });

  async function onSubmit(values: FormSchema) {
    const { categories, sub_categories, productImgs, ...other } = state;
    const finalData = {
      ...values,
      category_id: categories?.id,
      productImgs,
      sub_category_id: sub_categories?.id,
      salesPrice: extractNumber(values.salesPrice),
      discount: extractNumber(values.discount),
    };

    const arrWithEmptyField = Object.entries(state).reduce(
      (emptyValues, [key, value]) => {
        if (!Boolean(value) || value.length === 0) {
          emptyValues.push(key);
        }
        return emptyValues;
      },
      [] as string[],
    );

    if (arrWithEmptyField.length > 0) {
      toast.error(
        `These fields are empty: ${arrWithEmptyField.join(", ").toUpperCase()}`,
      );
      return;
    }

    // ... Supabase
    (async () => {
      try {
        const supabase = supabaseBrowserClient();
        // Products
        const { data, error } = await supabase
          .from("product")
          .upsert(finalData)
          .select();
        if (error) return toast.error(JSON.stringify(error));
        const insertedProductId = data && data[0].id;

        // Colors
        const colorUpsertPromises = other.colors.map((color: Tables<"color">) =>
          supabase
            .from("product_color")
            .insert({ product_id: insertedProductId, color_id: color.id }),
        );
        await Promise.all(colorUpsertPromises);

        // Sizes
        const sizeUpsertPromises = other.sizes.map((size: Tables<"sizes">) =>
          supabase
            .from("product_size")
            .insert({ product_id: insertedProductId, size_id: size.id }),
        );
        await Promise.all(sizeUpsertPromises);

        toast.success("Product created 🎉");
      } catch (error) {
        toast.error(JSON.stringify(error));
        console.error("Error upserting data:", error);
      }
    })();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Layout 1*/}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-xl text-muted-foreground underline decoration-[#074787] underline-offset-8">
                General Information
              </h2>
              <div className="flex flex-col items-end gap-4 md:flex-row">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-[100%] md:w-[70%]">
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="w-[100%] md:w-[30%]">
                      <FormLabel>SKU code*</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description"
                        {...field}
                        className="h-[8rem] bg-[#f4f4f4] text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Category & Sub-category*</FormLabel>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex w-fit min-w-[12rem] items-center justify-between"
                      >
                        <div>
                          {Boolean(state.categories?.id) ||
                          Boolean(state.sub_categories?.id) ? (
                            <span>
                              {`${state.categories.name} ↪ ${state.sub_categories.name}`}
                            </span>
                          ) : (
                            <span>Select...</span>
                          )}
                        </div>
                        <ChevronDown size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-max">
                      <DropdownMenuLabel>Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {categories.map((category) => (
                          <DropdownMenuSub key={category.id}>
                            <DropdownMenuSubTrigger>
                              <span>{category.name}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {category["sub-category"].map((sub) => (
                                  <DropdownMenuItem
                                    key={sub.id}
                                    onClick={() =>
                                      dispatch({
                                        type: "SET_CATEGORY_SUBCATEGORY_IDS",
                                        payload: {
                                          categories: category,
                                          sub_categories: sub,
                                        },
                                      })
                                    }
                                  >
                                    <span>{sub.name}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <FormField
                  control={form.control}
                  name="salesPrice"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Price*</FormLabel>
                      <FormControl>
                        <Input placeholder="$100.00 " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Discount*</FormLabel>
                      <FormControl>
                        <Input placeholder="10%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-6 md:flex-row md:items-center lg:gap-12">
                <div>
                  <FormLabel>Select colors*</FormLabel>
                  <div className="flex flex-wrap gap-3 p-2">
                    {colors.map((color) => (
                      <div
                        key={color.id}
                        className={clsx(
                          "flex cursor-pointer items-center gap-2 text-sm",
                          {
                            "rounded-full ring ring-orange-600 ring-offset-2":
                              state.colors.some((item) => item.id === color.id),
                          },
                        )}
                        onClick={() =>
                          dispatch({ type: "SET_COLOR", payload: color })
                        }
                      >
                        <div
                          key={color.id}
                          className={clsx(`h-6 w-6 rounded-full border`)}
                          style={{ backgroundColor: color.hex }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-[3rem] w-[0.2px] bg-orange-200 max-md:hidden"></div>
                <div>
                  <FormLabel>Select sizes*</FormLabel>
                  <div className="flex flex-wrap items-center gap-3 rounded-full p-2 text-xs">
                    {sizes.map((size) => (
                      <div
                        key={size.id}
                        className={clsx(
                          `grid h-6 w-6 cursor-pointer place-content-center rounded-full bg-zinc-300`,
                          {
                            "ring ring-orange-600 ring-offset-2":
                              state.sizes.some((item) => item.id === size.id),
                          },
                        )}
                        onClick={() =>
                          dispatch({ type: "SET_SIZE", payload: size })
                        }
                      >
                        {size.code}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Calander */}
              <div className="space-y-2">
                <FormLabel>Visibility</FormLabel>
                <FormField
                  control={form.control}
                  name="publishDate"
                  render={({ field }) => (
                    <div className="rounded-md border p-4">
                      <Tabs defaultValue="published">
                        <TabsList>
                          <TabsTrigger value="published">Publish</TabsTrigger>
                          <TabsTrigger value="schedule">Schedule</TabsTrigger>
                        </TabsList>
                        <TabsContent value="published">
                          <FormField
                            control={form.control}
                            name="publishDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    onCheckedChange={() =>
                                      field.onChange(new Date())
                                    }
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Publish immediately</FormLabel>
                                  <FormDescription>
                                    Check this option to immediately publish the
                                    current product.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                        <TabsContent value="schedule">
                          <FormItem className="flex flex-col gap-1 rounded-md border p-4">
                            <FormLabel>Schedule release</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={new Date(field.value)}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                />
              </div>
            </div>
            {/* Layout  2*/}
            <div>
              <div className="space-y-2">
                <FormLabel>Upload Photos</FormLabel>
                <div className="space-y-2">
                  <FileUpload dispatch={dispatch} />
                  <div>
                    {posts.length === 0 && (
                      <div className="text-center italic">
                        <h3 className="mt-6 text-2xl text-muted-foreground underline decoration-orange-400 underline-offset-8">
                          No images uploaded!
                        </h3>
                      </div>
                    )}
                    {posts.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                        {posts.map((post) => (
                          <div
                            key={post.name}
                            className="relative h-[12rem] w-[100%]"
                          >
                            <Image
                              src={post.image}
                              alt={post.name}
                              fill
                              priority
                              className="object-cover"
                            />
                            <div
                              className="absolute left-1/2 top-2 flex -translate-x-1/2 cursor-pointer items-center justify-center gap-1 rounded-full bg-red-400/30 p-2 text-xs text-orange-600 shadow-md backdrop-blur-md transition-all hover:bg-red-600/30 hover:text-red-800"
                              onClick={async () => {
                                // handle remove image from bucket
                                const supabase = supabaseBrowserClient();
                                await supabase.storage
                                  .from("product_upload")
                                  .remove([post.name]);

                                dispatch({
                                  type: "REMOVE_IMAGE",
                                  payload: post.name,
                                });
                                router.refresh();
                                // Update state
                              }}
                            >
                              <X size={18} />
                              <span>Remove</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="mt-8">
            Create product
          </Button>
        </form>
      </Form>
    </div>
  );
}
