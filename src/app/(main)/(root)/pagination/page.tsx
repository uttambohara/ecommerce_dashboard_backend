import Pagination from "@/features/pagination";
import React from "react";

export default function PaginationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <Pagination searchParams={searchParams} />
    </div>
  );
}
