"use client";

import React from "react";
import Script from "next/script";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
	<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="b6efb9d0-82ac-41af-b406-a6bba12d150c" type="text/javascript" async></script>
	
      {/* Google Ads Tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-1040846615"
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-1040846615');
          `,
        }}
      />
      {children}
    </>
  );
}
