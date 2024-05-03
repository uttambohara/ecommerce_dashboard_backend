"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { PER_PAGE } from "../constant";

interface PaginationControlProps {
  route: string;
  totalPagesLoaded: number;
  totalProductLength: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export default function PaginationControl({
  route,
  totalProductLength,
  hasPreviousPage,
  hasNextPage,
}: PaginationControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? 1;
  const limit = searchParams.get("limit") ?? PER_PAGE;

  return (
    <div className="flex">
      <div className="ml-auto flex items-center gap-2">
        <Button
          disabled={!hasPreviousPage}
          onClick={() =>
            router.push(
              `${process.env.NEXT_PUBLIC_SITE_URL}/${route}/?page=${Number(page) - 1}&limit=${Number(limit)}`,
            )
          }
        >
          Prevous
        </Button>
        <div>
          {page} /{Math.ceil(totalProductLength / PER_PAGE)}
        </div>
        <Button
          disabled={!hasNextPage}
          onClick={() =>
            router.push(
              `${process.env.NEXT_PUBLIC_SITE_URL}/${route}/?page=${Number(page) + 1}&limit=${Number(limit)}`,
            )
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
