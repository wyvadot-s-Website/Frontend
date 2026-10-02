/**
 * Central SEO configuration.
 *
 * IMPORTANT: every absolute URL in this file is built from SITE_URL, which must
 * stay in sync with `public/robots.txt`, `public/sitemap.xml` and the canonical
 * domain configured on Vercel. Never hardcode a vercel.app URL here.
 */

/** Canonical origin. No trailing slash. */
export const SITE_URL = "https://wyvadotpr.com";

/** Builds an absolute URL from a path ("/about" -> "https://wyvadotpr.com/about"). */
export const absoluteUrl = (path = "/") => {
  const clean = String(path).startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
};

/** Fallback metadata, also mirrored into index.html at build time. */
export const DEFAULT_SEO = {
  title: "Wyvadot PR - Project Management, Engineering & Construction Services",
  description:
    "Wyvadot Projects & Resources Ltd offers professional project management, construction, facilities management, engineering, and general contracting services. What we build, we build with purpose.",
  image: absoluteUrl("/og-image.png"),
};

/** Per-route metadata. Keys are React Router pathnames. */
export const ROUTE_SEO = {
  "/": {
    title: "Wyvadot PR - Project Management, Engineering & Construction Services",
    description:
      "Wyvadot Projects & Resources Ltd offers professional project management, construction, facilities management, engineering, and general contracting services. What we build, we build with purpose.",
  },
  "/about": {
    title: "About Us | Wyvadot Projects & Resources Ltd",
    description:
      "Learn about Wyvadot Projects & Resources Ltd - our history, mission, vision and the values behind our project management, engineering and construction work in Nigeria.",
  },
  "/services": {
    title: "Our Services | Project Management, Construction & Engineering",
    description:
      "Explore our services: project management and resources (PMR), civil engineering and construction (CEC), facilities maintenance and management (FMM), engineering and project services (EPS), technical engineering (TE) and general contracting (GC).",
  },
  "/projects": {
    title: "Our Projects | Wyvadot Projects & Resources Ltd",
    description:
      "View completed and ongoing project management, construction, engineering and facilities projects delivered by Wyvadot Projects & Resources Ltd across Nigeria.",
  },
  "/products": {
    title: "Products | Wyvadot Projects & Resources Ltd",
    description:
      "Browse professional project management and engineering products and supplies from Wyvadot Projects & Resources Ltd.",
  },
  "/shop": {
    title: "Shop | Wyvadot Projects & Resources Ltd",
    description:
      "Shop professional tools, equipment and project supplies from Wyvadot Projects & Resources Ltd. Quality products for contractors, engineers and project managers.",
  },
  "/contact": {
    title: "Contact Us | Wyvadot Projects & Resources Ltd",
    description:
      "Contact Wyvadot Projects & Resources Ltd for project management, construction, engineering and general contracting services in Benin City, Port Harcourt, Warri, Asaba, Abuja and Lagos. Request a quote within 24-48 hours.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Wyvadot Projects & Resources Ltd",
    description:
      "Read the Wyvadot Projects & Resources Ltd privacy policy covering how we collect, use, store and protect your personal data.",
  },
  "/terms-and-conditions": {
    title: "Terms & Conditions | Wyvadot Projects & Resources Ltd",
    description:
      "Read the Wyvadot Projects & Resources Ltd terms and conditions governing use of our website, services, accounts, transactions and content.",
  },
};

/**
 * Paths that must never be indexed: cart/checkout/payment flow, authenticated
 * dashboards and the admin area.
 */
export const NOINDEX_PREFIXES = [
  "/cart",
  "/checkout",
  "/payment",
  "/order-complete",
  "/home",
  "/wishlist",
  "/account",
  "/theboss",
];

/** Returns true when the given pathname should be excluded from indexing. */
export const isNoIndexPath = (pathname) => {
  if (!pathname || pathname === "/") return false;
  return NOINDEX_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
};

/** Organisation-level structured data, rendered on every page. */
export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Wyvadot Projects & Resources Ltd",
  alternateName: "Wyvadot PR",
  url: `${SITE_URL}/`,
  logo: absoluteUrl("/logo.png"),
  description:
    "Professional project management, construction, facilities management, engineering, and general contracting services. What we build, we build with purpose.",
  foundingDate: "2020",
  address: {
    "@type": "PostalAddress",
    addressCountry: "Nigeria",
  },
  serviceArea: {
    "@type": "Place",
    name: "Nigeria",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Project Management & Resources (PMR)",
          description: "Comprehensive project management services",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Civil Engineering & Construction (CEC)",
          description: "Professional civil engineering and construction services",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Facilities Maintenance & Management (FMM)",
          description: "Complete facilities maintenance and management solutions",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Engineering & Project Services (EPS)",
          description: "Engineering and project execution services",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Technical Engineering (TE)",
          description: "Specialized technical engineering solutions",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "General Contracting (GC)",
          description: "General contracting and construction services",
        },
      },
    ],
  },
  sameAs: [
    "https://facebook.com/wyvadotpr",
    "https://linkedin.com/company/wyvadotpr",
    "https://twitter.com/wyvadotpr",
    "https://instagram.com/wyvadotpr",
  ],
};
