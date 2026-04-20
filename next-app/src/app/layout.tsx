import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Noto_Sans_SC } from "next/font/google";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/config";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-sans",
});

const pacifico = localFont({
  src: "../../public/font/Pacifico-Regular.ttf",
  variable: "--font-pacifico",
  display: "swap",
});

const led = localFont({
  src: "../../public/font/UnidreamLED.ttf",
  variable: "--font-led",
  display: "swap",
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
  manifest: "/manifest.webmanifest",
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
    <html lang="zh-CN" className={`${sans.variable} ${pacifico.variable} ${led.variable}`}>
      <head>
        <link rel="preconnect" href="https://bsz.saop.cc" crossOrigin="" />
        <link rel="preconnect" href="https://v1.hitokoto.cn" crossOrigin="" />
        <link rel="preconnect" href="https://ipapi.co" crossOrigin="" />
        <link rel="preconnect" href="https://api.open-meteo.com" crossOrigin="" />
        <link rel="preconnect" href="https://meting-api.saop.cc" crossOrigin="" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <ServiceWorkerRegister />
        <Toaster position="top-center" theme="dark" richColors />
      </body>
    </html>
  );
}
