"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { status } from "@/data/constant";
import { useRouter } from "next/navigation";

export default function StatusTabList() {
  const router = useRouter();

  function handleClick(item: string) {
    router.push(`/vendor/order/?status=${item.toUpperCase()}`);
  }
  return (
    <Tabs defaultValue="All" className="w-[400px]">
      <TabsList>
        {status.map((item) => (
          <TabsTrigger
            value={item}
            onClick={() => handleClick(item)}
            key={item}
          >
            {item}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
