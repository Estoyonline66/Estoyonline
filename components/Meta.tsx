"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import { SeoData } from "@/types/PropTypes";
import React from "react";

type Props = {
  route: string;
};


export default function Meta({ route }: Props) {
  const { t } = useTranslation();
  const data = t("seo") as SeoData;
  const metadata = data.pages?.find((d) => d.route === route)?.datas;

  return (
    <>
      <title>{metadata?.title as string}</title>
      <meta name="description" content={metadata?.description as string} />
    </>
  );
}
