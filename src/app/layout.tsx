import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const businessName = "Green Leaf Lawn Care";
const description =
  "Green Leaf Lawn Care — trusted residential lawn care in Maple Grove, MN. Seasonal services, instant online quotes, and a lush, healthy lawn guaranteed. Free estimates. Call (763) 555-0142.";
const keywords = [
  "lawn care Maple Grove MN",
  "lawn care service",
  "lawn mowing",
  "aeration overseeding",
  "leaf removal",
  "fertilization",
  "residential lawn care",
  "lawn care near me",
  "Green Leaf Lawn Care",
  "instant lawn care quote",
];

export const metadata: Metadata = {
  metadataBase: new URL("https://greenleaflawncare.example"),
  title: {
    default: `${businessName} | Residential Lawn Care in Maple Grove, MN`,
    template: `%s | ${businessName}`,
  },
  description,
  keywords,
  authors: [{ name: businessName }],
  creator: businessName,
  applicationName: businessName,
  category: "Lawn Care Services",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${businessName} | Residential Lawn Care in Maple Grove, MN`,
    description,
    url: "https://greenleaflawncare.example",
    siteName: businessName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/hero.png",
        width: 1344,
        height: 768,
        alt: "Lush manicured lawn cared for by Green Leaf Lawn Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: businessName,
    description,
    images: ["/images/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LawnCareBusiness",
  name: businessName,
  image: "https://greenleaflawncare.example/images/hero.png",
  "@id": "https://greenleaflawncare.example",
  url: "https://greenleaflawncare.example",
  telephone: "+1-763-555-0142",
  priceRange: "$$",
  description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "1482 Oak Ridge Avenue",
    addressLocality: "Maple Grove",
    addressRegion: "MN",
    postalCode: "55369",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.0725,
    longitude: -93.4555,
  },
  areaServed: [
    { "@type": "City", name: "Maple Grove" },
    { "@type": "City", name: "Plymouth" },
    { "@type": "City", name: "Brooklyn Park" },
    { "@type": "City", name: "Osseo" },
    { "@type": "City", name: "Champlin" },
    { "@type": "City", name: "Dayton" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "16:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "187",
  },
  sameAs: [
    "https://www.google.com/maps",
    "https://www.facebook.com",
    "https://www.instagram.com",
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Residential Lawn Care",
  provider: {
    "@type": "LawnCareBusiness",
    name: businessName,
  },
  areaServed: "Maple Grove, MN and surrounding areas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
