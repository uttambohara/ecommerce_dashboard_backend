import { supabaseServerClient } from "@/lib/supabase/supabase-server";
import PaginationControl from "./components/pagination-control";

import PaginationInput from "./components/pagination-input";
import { PER_PAGE } from "./constant";

export default async function Pagination({
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
  let query = supabase.from("product").select("*");
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data: colors, error } = await query.range(start, end);

  if (!colors) throw new Error(error?.message);

  return (
    <>
      <PaginationInput filterBy={"Entry"} route={""} />
      {/* Table */}
      <PaginationControl
        route={"pagination"}
        totalPagesLoaded={colors?.length}
        hasNextPage={end < colors?.length}
        hasPreviousPage={start > 0}
        totalProductLength={0}
      />
    </>
  );
}
