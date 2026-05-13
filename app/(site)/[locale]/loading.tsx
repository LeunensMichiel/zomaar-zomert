import { StrokeLoader } from "./_components/stroke-loader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16 md:py-24">
      <StrokeLoader className="w-full max-w-md md:max-w-xl lg:max-w-2xl" />
    </div>
  );
}
