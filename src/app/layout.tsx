import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/config";
import { ServiceWorkerCleanup } from "@/components/service-worker-cleanup";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.siteDes,
  keywords: siteConfig.siteKeywords,
  authors: [{ name: siteConfig.siteAuthor }],
  applicationName: siteConfig.siteName,
  icons: {
    icon: siteConfig.siteLogo,
    apple: siteConfig.siteAppleLogo,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: siteConfig.siteName,
    title: siteConfig.siteName,
    description: siteConfig.siteDes,
    url: `https://${siteConfig.siteUrl}`,
    images: [`https://${siteConfig.siteUrl}${siteConfig.siteOgImage}`],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.siteDes,
    images: [`https://${siteConfig.siteUrl}${siteConfig.siteOgImage}`],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": siteConfig.siteName,
    "msapplication-TileColor": siteConfig.siteThemeColor,
    "msapplication-TileImage": siteConfig.siteAppleLogo,
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.siteThemeColor,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={sans.variable}>
      <head>
        <link rel="preconnect" href="https://bsz.saop.cc" crossOrigin="" />
        <link rel="preconnect" href="https://v1.hitokoto.cn" crossOrigin="" />
        <link rel="preconnect" href="https://meting-api.saop.cc" crossOrigin="" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <ServiceWorkerCleanup />
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
