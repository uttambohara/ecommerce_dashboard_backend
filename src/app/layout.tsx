import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Redressed } from "next/font/google";
import "./globals.css";
import ModalProvider from "@/providers/modal-provider";

const inter = Redressed({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider>{children}</ModalProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
