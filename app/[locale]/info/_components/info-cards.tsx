"use client";

import { TexturedImage } from "@components/textured-image";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Map } from "@components/ui/map";
import { isSignupOpen, PAELLA_LINK, PETANQUE_LINK } from "@lib/models";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Masonry from "react-masonry-css";

const breakpointColumns = {
  default: 3,
  "1023": 2,
  "639": 1,
};

export function InfoCards() {
  const t = useTranslations("info");
  const signupDisabled = !isSignupOpen();

  const richBr = { br: () => <br /> };
  const richStrongBr = {
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    br: () => <br />,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      <Card title={t("faq.1.title")}>
        <p>{t.rich("faq.1.content", richBr)}</p>
      </Card>
      <div className="relative h-0 overflow-hidden pb-[100%]">
        <div className="absolute inset-0 h-full w-full">
          <Map height="100%" />
        </div>
      </div>
      <Card title={t("faq.2.title")}>
        <p>{t.rich("faq.2.content", richBr)}</p>
      </Card>
      <Card title={t("faq.3.title")}>
        <p>{t.rich("faq.3.content", richStrongBr)}</p>
      </Card>
      <Card title={t("faq.4.title")}>
        <p>{t.rich("faq.4.content", richBr)}</p>
      </Card>
      <TexturedImage src="/assets/random/terras.jpg" alt="Terras" />
      <Card title={t("faq.5.title")}>
        <p>{t("faq.5.content")}</p>
      </Card>
      <Card title={t("faq.6.title")}>
        <p>{t("faq.6.content")}</p>
      </Card>
      <Card title={t("faq.7.title")}>
        <p>{t.rich("faq.7.content", richStrongBr)}</p>
      </Card>
      <TexturedImage src="/assets/random/petanque.jpg" alt="" />
      <Card title={t("faq.8.title")}>
        <p>{t.rich("faq.8.content", richStrongBr)}</p>
        <div className="mt-6 grid gap-2">
          <Button
            as="a"
            {...(!signupDisabled && {
              href: PETANQUE_LINK,
              target: "_blank",
              rel: "noreferrer noopener",
            })}
            size="sm"
            disabled={signupDisabled}
            variant="primary"
            outlined
            iconRight={<ChevronRight className="h-4 w-4" />}
          >
            {t("faq.8.petanque")}
          </Button>
          <Button
            as="a"
            {...(!signupDisabled && {
              href: PAELLA_LINK,
              target: "_blank",
              rel: "noreferrer noopener",
            })}
            disabled={signupDisabled}
            variant="primary"
            outlined
            size="sm"
            iconRight={<ChevronRight className="h-4 w-4" />}
          >
            {t("faq.8.paella")}
          </Button>
        </div>
      </Card>
      <TexturedImage src="/assets/random/food.jpg" alt="A sausage" />
    </Masonry>
  );
}
