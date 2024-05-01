"use client";

import { Button } from "@/components/ui/button";
import supabaseBrowserClient from "@/lib/supabase/supabase-client";
import { Provider } from "@supabase/supabase-js";
import { GithubIcon } from "lucide-react";

export default function AuthPage() {
  // ...
  async function handleOAUTH(provider: Provider) {
    const supabase = supabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <Button onClick={() => handleOAUTH("github")} className="flex gap-2">
      <GithubIcon />
      Login with Github
    </Button>
  );
}
