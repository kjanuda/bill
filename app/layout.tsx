import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://elecbillview.vercel.app/"; // ← ඔයාගේ actual domain එක දාන්න

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bill Pay | Check & Pay Your CEB Electricity Bill Online",
    template: "%s | Bill Pay",
  },
  description:
    "Check your CEB (Ceylon Electricity Board) electricity bill balance instantly online. Enter your account number and get your bill sent to your email in seconds.",
  keywords: [
    "CEB bill",
    "CEB electricity bill check",
    "Sri Lanka electricity bill",
    "CEB bill payment online",
    "check CEB bill balance",
    "Ceylon Electricity Board",
    "electricity bill Sri Lanka",
  ],
  authors: [{ name: "Januda J Kodithuwakku", url: "https://kjanuda.netlify.app/" }],
  creator: "Januda J Kodithuwakku",
  publisher: "Bill Pay",
  applicationName: "Bill Pay",
  category: "Utilities",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_LK",
    url: siteUrl,
    siteName: "Bill Pay",
    title: "Bill Pay | Check Your CEB Electricity Bill Online",
    description:
      "Instantly check your CEB electricity bill balance and get it emailed to you. Fast, simple, and secure.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bill Pay - CEB Electricity Bill Checker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bill Pay | Check Your CEB Electricity Bill Online",
    description:
      "Instantly check your CEB electricity bill balance and get it emailed to you.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  verification: {
    google: "c8a0f856eba1e5e6",
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5c1414",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Bill Pay",
              url: "https://elecbillview.vercel.app/",
              description:
                "Check your CEB electricity bill balance instantly online and get it emailed to you.",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "LKR",
              },
              author: {
                "@type": "Person",
                name: "Januda J Kodithuwakku",
                url: "https://kjanuda.netlify.app/",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}