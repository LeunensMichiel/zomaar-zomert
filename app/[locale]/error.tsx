"use client";

import { Button } from "@components/ui/button";
import { Link } from "@lib/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = { error: Error & { digest?: string }; reset: () => void };

export default function Error({ error, reset }: Props) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='container-wide section-y bg-[url("/assets/single_z.svg")] bg-contain bg-position-[5%_50%] bg-no-repeat text-center'>
      <h1 className="mb-6 font-bold uppercase">
        <span className="text-brand-500">500</span> — {t("notFound.title")}
      </h1>
      <div className="mt-16 grid grid-cols-1 justify-center justify-items-center md:grid-cols-[minmax(0,960px)]">
        <div className="grid justify-center justify-items-center gap-8">
          <p className="font-sans text-2xl text-blue-900">
            {t("notFound.message")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              onClick={reset}
              iconRight={<ChevronRight className="h-6 w-6" />}
            >
              {t("notFound.button")}
            </Button>
            <Link href="/">
              <Button variant="minimal-dark" as="span">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
