import Spinner from "@/components/global/spinner";

export default function Loading() {
  return (
    <div className="grid h-[100%] place-content-center">
      <Spinner />
    </div>
  );
}
