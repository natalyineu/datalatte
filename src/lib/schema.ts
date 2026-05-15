export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://datalatte.pro/#business",
    name: "DataLatte",
    url: "https://datalatte.pro",
    logo: "https://datalatte.pro/logo.png",
    description:
      "Data-driven digital marketing agency for local businesses, mid-market companies, and enterprise brands. Google Ads, Meta Ads, SEO, programmatic advertising, analytics, and full-service marketing strategy.",
    email: "hi@datalatte.pro",
    telephone: "+48503589781",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bałtyk Business Square",
      addressLocality: "Poznań",
      addressCountry: "PL",
    },
    priceRange: "$$",
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "Canada" },
    ],
    serviceType: [
      "Google Ads Management",
      "Meta Ads Management",
      "Google Business Profile Optimization",
      "Local SEO",
      "Marketing Analytics",
      "Programmatic Advertising",
      "Email Marketing",
      "Social Media Marketing",
      "AI Marketing Automation",
      "Website & Landing Page Design",
      "Marketing Strategy Consulting",
    ],
    sameAs: [
      "https://www.linkedin.com/company/datalattepro",
      "https://www.instagram.com/datalatte.pro",
    ],
    founder: {
      "@type": "Person",
      name: "Nataliia Makota",
      url: "https://datalatte.pro/about",
    },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nataliia Makota",
    jobTitle: "Digital Marketing Consultant & Founder",
    url: "https://datalatte.pro/about",
    email: "hi@datalatte.pro",
    worksFor: {
      "@type": "Organization",
      name: "DataLatte",
      url: "https://datalatte.pro",
    },
    alumniOf: [
      { "@type": "Organization", name: "OMD" },
      { "@type": "Organization", name: "Dentsu" },
      { "@type": "Organization", name: "BBDO" },
      { "@type": "Organization", name: "GroupM" },
    ],
    knowsAbout: [
      "Google Ads", "Meta Ads", "Local SEO", "Programmatic Advertising",
      "Marketing Analytics", "Email Marketing", "Marketing Automation",
      "Brand Strategy", "Media Planning", "Performance Marketing",
    ],
    sameAs: [
      "https://www.linkedin.com/company/datalattepro",
      "https://www.instagram.com/datalatte.pro",
    ],
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Person",
      name: "Nataliia Makota",
      url: "https://datalatte.pro/about",
    },
    publisher: {
      "@type": "Organization",
      name: "DataLatte",
      url: "https://datalatte.pro",
      logo: { "@type": "ImageObject", url: "https://datalatte.pro/logo.png" },
    },
    image: image ?? "https://datalatte.pro/og-image.png",
  };
}
