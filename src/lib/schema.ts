export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "DataLatte",
    url: "https://datalatte.pro",
    logo: "https://datalatte.pro/logo.png",
    description:
      "Freelance local marketing and analytics for coffee shops, hair salons, pet groomers, and fitness studios.",
    email: "hello@datalatte.pro",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: [
      "Google Ads Management",
      "Meta Ads Management",
      "Google Business Profile Optimization",
      "Local SEO",
      "Marketing Analytics",
    ],
    sameAs: [
      "https://www.linkedin.com/company/datalatte",
      "https://www.instagram.com/datalatte.pro",
    ],
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
      name: "DataLatte",
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
