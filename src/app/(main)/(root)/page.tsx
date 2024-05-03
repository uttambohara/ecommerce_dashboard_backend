import { getUser } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const response = await getUser();

  if (response?.data?.role === "ADMIN") {
    redirect("/admin");
  }

  if (response?.data?.role === "VENDOR") {
    redirect("/vendor");
  }

  return (
    <div className="text-4xl">
      {/* TODO: Redirection */}
      <div>User not found in our system!</div>
    </div>
  );
}
