import Spinner from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="grid h-[calc(100vh-4rem)] place-content-center">
      <Spinner />
    </div>
  );
}
