export const PWA_CONFIG = {
  // App Information
  name: "Tumaini Fitness Management",
  shortName: "Tumaini Gym",
  description: "Comprehensive gym management system for Tumaini Fitness Center",

  // URLs and Paths
  startUrl: "/dashboard",
  scope: "/",

  // Appearance
  display: "standalone" as const,
  backgroundColor: "#ffffff",
  themeColor: "#37465A",
  orientation: "portrait-primary" as const,

  // Cache Configuration
  cacheVersion: "v2",
  cacheName: "tumaini-gym-v2",

  // Pages to cache
  staticPages: [
    // Main pages
    "/",
    "/about",
    "/contact",
    "/nutrition",
    "/register",

    // Auth pages
    "/sign-in",

    // Dashboard pages
    "/dashboard",
    "/dashboard/members",
    "/dashboard/members/new",
    "/dashboard/members/reports",
    "/dashboard/payments",
    "/dashboard/payments/new",
    "/dashboard/payments/reports",
    "/dashboard/membership-plans",
  ],

  // Static assets to cache
  staticAssets: [
    "/offline.html",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
  ],

  // Runtime caching strategies
  runtimeCaching: {
    // API routes - Network first
    apiRoutes: {
      urlPattern: /^\/api\//,
      handler: "NetworkFirst" as const,
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },

    // Images - Cache first
    images: {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },

    // External resources - Stale while revalidate
    external: {
      urlPattern: /^https:\/\/res\.cloudinary\.com\//,
      handler: "StaleWhileRevalidate" as const,
      options: {
        cacheName: "external-resources",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  },

  // Notification settings
  notifications: {
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    actions: [
      {
        action: "explore",
        title: "View Details",
        icon: "/icons/icon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/icon-192x192.png",
      },
    ],
  },

  // Update settings
  updateSettings: {
    checkInterval: 60000, // Check for updates every minute
    showUpdatePrompt: true,
    autoUpdate: false,
  },
} as const;

export type PWAConfig = typeof PWA_CONFIG;
