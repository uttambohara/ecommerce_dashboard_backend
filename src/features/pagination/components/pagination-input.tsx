"use client";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { ComponentPropsWithRef, useEffect, useMemo } from "react";

type PaginationInputProps = {
  filterBy: string;
  route: string;
} & ComponentPropsWithRef<"input">;

export default function PaginationInput({
  filterBy,
  route,
  ...props
}: PaginationInputProps) {
  const router = useRouter();
  const { inputValue, setInputValue, searchResult } = useDebounce();

  const updateRoute = useMemo(() => {
    const qs = queryString.stringifyUrl(
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${route}`,
        query: {
          search: searchResult,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );
    return qs;
  }, [searchResult]);

  useEffect(() => {
    router.push(updateRoute);
  }, [updateRoute]);

  return (
    <div className="relative">
      <Input
        {...props}
        placeholder={`Filter ${filterBy}`}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <Search
        className="absolute left-2 top-2.5 text-muted-foreground"
        size={20}
      />
    </div>
  );
}
