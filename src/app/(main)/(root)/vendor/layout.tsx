import Header from "@/components/layouts/header";
import VendorSidebar from "@/components/layouts/vendor-sidebar";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-screen grid-cols-1 xl:grid-cols-[260px_1fr]">
      <VendorSidebar />
      <main>
        <Header />
        <section className="h-[calc(100vh-4rem)] overflow-scroll">
          <div className="mx-auto max-w-[90%] px-2 py-6">{children}</div>
        </section>
      </main>
    </div>
  );
}
