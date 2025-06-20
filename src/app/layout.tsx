import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tumaini Fitness Management",
  description: "Comprehensive gym management system for Tumaini Fitness Center",
  manifest: "/manifest.json",
  keywords: [
    "gym management",
    "fitness center",
    "member management",
    "payment processing",
    "tumaini fitness",
  ],
  authors: [
    {
      name: "Tumaini Fitness",
    },
  ],
  creator: "Tumaini Fitness",
  metadataBase: new URL("https://gym.tumaini.fitness"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gym.tumaini.fitness",
    title: "Tumaini Fitness Management",
    description:
      "Comprehensive gym management system for Tumaini Fitness Center",
    siteName: "Tumaini Fitness Management",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tumaini Fitness Management",
    description:
      "Comprehensive gym management system for Tumaini Fitness Center",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tumaini Gym",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#37465A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tumaini Gym" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#37465A" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>

        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
