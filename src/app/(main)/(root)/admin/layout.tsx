import AdminSidebar from "@/components/global/admin-sidebar";
import Header from "@/components/global/header";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <main>
        <Header />
        <section className="h-[calc(100vh-4rem)] overflow-scroll bg-zinc-50">
          <div className="mx-auto max-w-[90%] px-2 py-6">{children}</div>
        </section>
      </main>
    </div>
  );
}
