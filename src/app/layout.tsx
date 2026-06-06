import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Tumaini Fitness Centre - Premier Gym in Kasarani, Nairobi",
    template: "%s | Tumaini Fitness Centre",
  },
  description:
    "Transform your fitness journey at Tumaini Fitness Centre in Kasarani, Nairobi. Professional training, modern equipment, cardio, strength training, nutrition guidance, and kids karate programs. Affordable membership plans available.",
  manifest: "/manifest.json",
  keywords: [
    "gym nairobi",
    "fitness center kasarani",
    "tumaini fitness",
    "strength training nairobi",
    "cardio training",
    "nutrition guidance",
    "kids karate nairobi",
    "personal training",
    "gym membership kenya",
    "fitness classes nairobi",
    "kastemil business centre gym",
    "affordable gym nairobi",
    "professional fitness trainers",
  ],
  authors: [
    {
      name: "Tumaini Fitness Centre",
    },
  ],
  creator: "Tumaini Fitness Centre",
  metadataBase: new URL("https://gym.tumaini.fitness"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gym.tumaini.fitness",
    title: "Tumaini Fitness Centre - Premier Gym in Kasarani, Nairobi",
    description:
      "Transform your fitness journey at Tumaini Fitness Centre in Kasarani, Nairobi. Professional training, modern equipment, and comprehensive fitness programs.",
    siteName: "Tumaini Fitness Centre",
    images: [
      {
        url: "https://res.cloudinary.com/dl0w5seja/image/upload/f_auto,q_auto/tumaini_hero_wegjkt",
        width: 1200,
        height: 630,
        alt: "Tumaini Fitness Centre - Modern Gym Facility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tumaini Fitness Centre - Premier Gym in Kasarani, Nairobi",
    description:
      "Transform your fitness journey at Tumaini Fitness Centre in Kasarani, Nairobi. Professional training, modern equipment, and comprehensive fitness programs.",
    images: [
      "https://res.cloudinary.com/dl0w5seja/image/upload/f_auto,q_auto/tumaini_hero_wegjkt",
    ],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tumaini Fitness",
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#37465A" },
  ],
  width: "device-width",
  initialScale: 1,
  // Relaxed scaling for better accessibility and fewer mobile rendering quirks.
  // Previously userScalable: false + maximumScale: 1 could cause issues on some mobile browsers.
  maximumScale: 5,
  userScalable: true,
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
                  // Use a simple version so we can detect stale SWs from previous deploys
                  const SW_VERSION = 'minimal-1';

                  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
                    .then(function(registration) {
                      console.log('[PWA] SW registered successfully (version ' + SW_VERSION + '):', registration);

                      // Proactively check for updates (helps mobile browsers pick up the safe minimal SW faster)
                      registration.update().catch(function() {});

                      // If there's a waiting worker, tell it to activate immediately
                      if (registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                      }
                    })
                    .catch(function(registrationError) {
                      console.warn('[PWA] SW registration failed (this is usually harmless):', registrationError);
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
