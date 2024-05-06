import { getUser } from "@/actions/user";
import SectionHeader from "@/components/layouts/section-header";
import PaginationControl from "@/features/pagination/components/pagination-control";
import PaginationInput from "@/features/pagination/components/pagination-input";
import { PER_PAGE } from "@/features/pagination/constant";
import { filterInvoicesByStatus } from "@/lib/payment-status-checker";
import { supabaseServerClient } from "@/lib/supabase/supabase-server";
import StatusCards from "./_components/status-cards";
import StatusTabList from "./_components/status-tab-list";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Invoice({
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
  const status = (searchParams["status"] as string) ?? "ALL";

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit) - 1;

  // ...
  const supabase = supabaseServerClient();

  let query = supabase
    .from("invoice")
    .select(
      "*, order(*, product(*)), users(*), payment(*),  customer(*, users(*))",
    )
    .order(sort, { ascending: order === "asc" })
    .eq("vendor_id", userId as string)
    .limit(PER_PAGE);

  const { data: invoices, error } = await query.range(start, end);
  if (!invoices) throw new Error(error?.message);

  let { data: allInvoices } = await supabase
    .from("invoice")
    .select("*")
    .eq("vendor_id", userId as string);
  const totalInvoices = allInvoices?.length;

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  let filteredInvoice;
  if (status == "ALL") {
    filteredInvoice = invoices;
  } else {
    filteredInvoice = filterInvoicesByStatus(invoices, status);
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader title={"Manage Invoices"} useBreadcrumb={false} />
        <StatusCards invoices={invoices} />
      </div>

      <div className="text-2xl">Invoice Table</div>
      <div className="flex flex-wrap justify-between gap-2">
        <PaginationInput
          filterBy={"Entry"}
          route={"/vendor/invoice"}
          className="w-[16rem] pl-8"
        />
      </div>

      <StatusTabList />

      <DataTable columns={columns} data={filteredInvoice} />

      <PaginationControl
        route={"/vendor/invoice"}
        totalPagesLoaded={invoices?.length}
        totalProductLength={totalInvoices as number}
        hasNextPage={end < invoices?.length}
        hasPreviousPage={start > 0}
      />
    </div>
  );
}
