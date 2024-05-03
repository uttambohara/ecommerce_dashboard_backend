import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <section className="dots-container">
      <Loader2 className="animate-spin" size={50} color="gray" />
    </section>
  );
}
