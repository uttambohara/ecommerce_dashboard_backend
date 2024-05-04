import SectionHeader from "@/components/layouts/section-header";
import PaginationControl from "@/features/pagination/components/pagination-control";
import PaginationInput from "@/features/pagination/components/pagination-input";
import { PER_PAGE } from "@/features/pagination/constant";
import { supabaseServerClient } from "@/lib/supabase/supabase-server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { getUser } from "@/actions/user";

export default async function ProductList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  const userId = user?.data?.id;

  const search = searchParams["search"];

  // Pagination logic
  const page = searchParams["page"] ?? 1;
  const limit = searchParams["limit"] ?? PER_PAGE;
  const sort = (searchParams["sort"] as string) ?? "name";
  const order = searchParams["order"] ?? "asc";

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit) - 1;

  // ...
  const supabase = supabaseServerClient();
  let query = supabase
    .from("product")
    .select("*, category(*)")
    .order(sort, { ascending: order === "asc" })
    .eq("user_id", userId as string)
    .limit(PER_PAGE);

  const { data: allProducts } = await query;
  const totalProducts = allProducts?.length;

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data: products, error } = await query.range(start, end);
  if (!products) throw new Error(error?.message);

  return (
    <div className="space-y-6">
      <SectionHeader title={"Manage products"} useBreadcrumb={false} />
      <div className="flex flex-wrap justify-between gap-2">
        <PaginationInput
          filterBy={"Entry"}
          route={"/vendor/product/list"}
          className="w-[16rem] pl-8"
        />
        <Link href="/vendor/product/create">
          <Button>
            <Plus size={18} />
            Create product
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={products} />
      <PaginationControl
        route={"/vendor/product/list"}
        totalPagesLoaded={products?.length}
        totalProductLength={totalProducts as number}
        hasNextPage={end < products?.length}
        hasPreviousPage={start > 0}
      />
    </div>
  );
}
