import { getUser } from "@/actions/user";
import SectionHeader from "@/components/layouts/section-header";
import PaginationControl from "@/features/pagination/components/pagination-control";
import PaginationInput from "@/features/pagination/components/pagination-input";
import { PER_PAGE } from "@/features/pagination/constant";
import { supabaseServerClient } from "@/lib/supabase/supabase-server";
import StatusTabList from "./_components/status-tab-list";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function ProductList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  const userId = user?.data?.id;

  const search = searchParams["search"];
  const page = searchParams["page"] ?? 1;
  const limit = searchParams["limit"] ?? PER_PAGE;
  const sort = (searchParams["sort"] as string) ?? "id";
  const order = searchParams["order"] ?? "asc";
  const status = searchParams["status"] ?? "";

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit) - 1;

  // ...
  const supabase = supabaseServerClient();

  let query = supabase
    .from("order")
    .select("*, product(*), customer(*, users(*)), users(*)")
    .order(sort, { ascending: order === "asc" })
    .eq("vendor_id", userId as string)
    .limit(PER_PAGE);

  if (status && status !== "ALL") {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query.range(start, end);
  if (!orders) throw new Error(error?.message);

  let { data: allOrders } = await supabase
    .from("order")
    .select("*")
    .eq("vendor_id", userId as string);

  const totalOrders = allOrders?.length;

  return (
    <div className="space-y-4">
      <SectionHeader title={"Manage orders"} useBreadcrumb={false} />
      <div className="text-xl text-muted-foreground underline decoration-orange-500 underline-offset-8">
        All orders: {totalOrders}
      </div>
      <div className="flex flex-wrap justify-between gap-2">
        <PaginationInput
          filterBy={"Entry"}
          route={"/vendor/order"}
          className="w-[16rem] pl-8"
        />
      </div>

      <StatusTabList />

      <DataTable columns={columns} data={orders} />

      <PaginationControl
        route={"/vendor/product/list"}
        totalPagesLoaded={orders?.length}
        totalProductLength={totalOrders as number}
        hasNextPage={end < orders?.length}
        hasPreviousPage={start > 0}
      />
    </div>
  );
}
