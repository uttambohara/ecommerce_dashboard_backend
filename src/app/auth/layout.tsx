import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid h-[100svh] place-content-center">{children}</div>;
}
