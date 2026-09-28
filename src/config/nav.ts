import type { Icon3DName } from "@/components/site/icon-3d";

export const mainNav: { label: string; href: string; icon: Icon3DName }[] = [
  { label: "Services", href: "/services", icon: "seedling" },
  { label: "Service Areas", href: "/service-areas", icon: "map" },
  { label: "Reviews", href: "/reviews", icon: "star" },
  { label: "Our Work", href: "/gallery", icon: "camera" },
  { label: "About", href: "/about", icon: "house" },
  { label: "Lawn Tips", href: "/blog", icon: "books" },
];

export const footerNav = {
  company: [
    { label: "About us", href: "/about" },
    { label: "Reviews", href: "/reviews" },
    { label: "Our work", href: "/gallery" },
    { label: "Lawn care tips", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};
