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

export default async function ProductList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = searchParams["search"];
  // Pagination logic
  const page = searchParams["page"] ?? 1;
  const limit = searchParams["limit"] ?? PER_PAGE;
  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);

  // ...
  const supabase = supabaseServerClient();
  let query = supabase
    .from("product")
    .select("*, category(*)")
    .order("created_at", { ascending: false });

  // Calculation of total Products
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
          route={"/admin/product/list"}
          className="w-[16rem] pl-8"
        />
        <Link href="/admin/product/create">
          <Button>
            <Plus size={18} />
            Create product
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={products} />
      <PaginationControl
        route={"/admin/product/list"}
        totalPagesLoaded={products?.length}
        totalProductLength={totalProducts as number}
        hasNextPage={end < products?.length}
        hasPreviousPage={start > 0}
      />
    </div>
  );
}
