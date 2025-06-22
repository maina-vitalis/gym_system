import type { Metadata } from "next";

// SEO Configuration
export const SEO_CONFIG = {
  siteName: "Tumaini Fitness Centre",
  siteUrl: "https://gym.tumaini.fitness",
  defaultImage:
    "https://res.cloudinary.com/dl0w5seja/image/upload/f_auto,q_auto/tumaini_hero_wegjkt",
  twitterHandle: "@tumainifitness",
  businessName: "Tumaini Fitness Centre",
  location: "Kasarani, Nairobi, Kenya",
  phone: "+254700000000",
  email: "info@tumainifitness.co.ke",
  address: {
    streetAddress: "Kastemil Business Centre",
    addressLocality: "Kasarani",
    addressRegion: "Nairobi",
    addressCountry: "KE",
    postalCode: "00100",
  },
  geo: {
    latitude: "-1.2167",
    longitude: "36.9167",
  },
  openingHours: ["Mo-Fr 05:30-22:00", "Sa-Su 06:00-21:00"],
} as const;

// Common keywords for all pages
const baseKeywords = [
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
];

// Generate page metadata
export function generatePageMetadata({
  title,
  description,
  path = "/",
  image,
  keywords = [],
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const url = `${SEO_CONFIG.siteUrl}${path}`;
  const imageUrl = image || SEO_CONFIG.defaultImage;

  return {
    title,
    description,
    keywords: [...baseKeywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: "en_US",
      url,
      title,
      description,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: SEO_CONFIG.twitterHandle,
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
  };
}

// Organization Schema (Business)
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Gym",
  "@id": `${SEO_CONFIG.siteUrl}/#organization`,
  name: SEO_CONFIG.businessName,
  alternateName: "TFC",
  url: SEO_CONFIG.siteUrl,
  logo: `${SEO_CONFIG.siteUrl}/gym.png`,
  image: SEO_CONFIG.defaultImage,
  description:
    "Modern fitness gym offering comprehensive fitness services including strength training, cardio, nutrition guidance, and kids karate programs in Kasarani, Nairobi.",
  telephone: SEO_CONFIG.phone,
  email: SEO_CONFIG.email,
  address: {
    "@type": "PostalAddress",
    ...SEO_CONFIG.address,
  },
  geo: {
    "@type": "GeoCoordinates",
    ...SEO_CONFIG.geo,
  },
  openingHours: SEO_CONFIG.openingHours,
  priceRange: "KES 2,500 - KES 7,500",
  paymentAccepted: ["Cash", "Credit Card", "Mobile Money"],
  currenciesAccepted: "KES",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Fitness Programs",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Cardio Training",
          description:
            "High-energy workouts combining rhythmic exercise with strength training",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Strength Training",
          description:
            "Professional strength training programs to build muscle and improve endurance",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Nutrition Guidance",
          description:
            "Personalized nutrition consultation for optimal health and fitness goals",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Kids Karate",
          description:
            "Martial arts program for children focusing on discipline and physical fitness",
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "150",
  },
  sameAs: [
    "https://www.facebook.com/tumainifitness",
    "https://www.instagram.com/tumainifitness",
    "https://twitter.com/tumainifitness",
  ],
});

// Website Schema
export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SEO_CONFIG.siteUrl}/#website`,
  url: SEO_CONFIG.siteUrl,
  name: SEO_CONFIG.siteName,
  description:
    "Transform your fitness journey at Tumaini Fitness Centre in Kasarani, Nairobi. Professional training, modern equipment, and comprehensive fitness programs.",
  publisher: {
    "@id": `${SEO_CONFIG.siteUrl}/#organization`,
  },
});

// Breadcrumb Schema
export const getBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// Service Schema
export const getServiceSchema = (service: {
  name: string;
  description: string;
  image?: string;
  offers?: Array<{
    name: string;
    price: string;
    priceCurrency: string;
    description: string;
  }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  image: service.image || SEO_CONFIG.defaultImage,
  provider: {
    "@id": `${SEO_CONFIG.siteUrl}/#organization`,
  },
  areaServed: {
    "@type": "Place",
    name: "Nairobi, Kenya",
  },
  ...(service.offers && {
    offers: service.offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      description: offer.description,
      availability: "https://schema.org/InStock",
    })),
  }),
});

// FAQ Schema
export const getFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Generate JSON-LD script data
export function generateJsonLd(data: object | object[]) {
  const jsonLd = Array.isArray(data) ? data : [data];
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(jsonLd),
    },
  };
}
