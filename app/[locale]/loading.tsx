import { Spinner } from "@components/ui/spinner";

export default function Loading() {
  return (
    <div className="container-wide section-y flex justify-center">
      <Spinner size="xl" className="text-brand-500" />
    </div>
  );
}
