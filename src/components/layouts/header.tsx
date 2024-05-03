"use client";

import supabaseBrowserClient from "@/lib/supabase/supabase-client";
import { Loader, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";

export default function Header() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <header className="flex h-[4rem] items-center justify-between bg-zinc-100 px-8 shadow-sm">
      <div></div>
      <Button
        className="flex gap-2"
        onClick={() => {
          startTransition(async () => {
            const supabase = supabaseBrowserClient();
            await supabase.auth.signOut();
            router.push("/auth");
          });
        }}
      >
        <LogOut />
        Logout
        {isPending && <Loader className="animate-spin" />}
      </Button>
    </header>
  );
}
