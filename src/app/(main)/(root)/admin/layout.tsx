import AdminSidebar from "@/components/layouts/admin-sidebar";
import Header from "@/components/layouts/header";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-screen grid-cols-1 xl:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <main>
        <Header />
        <section className="h-[calc(100vh-4rem)] overflow-scroll">
          <div className="mx-auto max-w-[85%] px-2 py-6">{children}</div>
        </section>
      </main>
    </div>
  );
}
