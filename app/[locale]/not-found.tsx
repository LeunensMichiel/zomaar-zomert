import { Button } from "@components/ui/button";
import { Link } from "@lib/i18n/navigation";
import { ChevronRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className='container-wide section-y bg-[url("/assets/single_z.svg")] bg-[length:contain] bg-[5%_50%] bg-no-repeat text-center'>
      <h1 className="mb-6 font-bold uppercase">
        <span className="text-brand-500">404</span> — Festival not found
      </h1>
      <div className="mt-16 grid grid-cols-1 justify-center justify-items-center md:grid-cols-[minmax(0,960px)]">
        <div className="grid justify-center justify-items-center gap-8">
          <p className="font-sans text-2xl text-blue-900">
            Looks like you entered a page that does not exist. Please contact us
            if this should not be the case.
          </p>
          <Link href="/">
            <Button
              variant="primary"
              as="span"
              iconRight={<ChevronRight className="h-6 w-6" />}
            >
              Return to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
