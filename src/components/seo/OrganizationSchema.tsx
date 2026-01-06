import { Helmet } from "react-helmet-async";

const OrganizationSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://listyourcar.ng/#organization",
    "name": "List Your Car",
    "alternateName": "ListYourCar Nigeria",
    "url": "https://listyourcar.ng",
    "logo": {
      "@type": "ImageObject",
      "url": "https://listyourcar.ng/logo.png",
      "width": 512,
      "height": 512
    },
    "image": "https://listyourcar.ng/og-image.png",
    "description": "Nigeria's most trusted car marketplace. Buy and sell verified vehicles with secure escrow payments, fraud protection, and verified sellers.",
    "email": "hello@listyourcar.ng",
    "telephone": "+234-900-000-0000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Victoria Island",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos",
      "addressCountry": "NG"
    },
    "sameAs": [
      "https://www.facebook.com/listyourcarng",
      "https://twitter.com/listyourcarng",
      "https://www.instagram.com/listyourcarng",
      "https://www.linkedin.com/company/listyourcarng",
      "https://www.youtube.com/@listyourcarng"
    ],
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "List Your Car Team"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    },
    "slogan": "One Car. One Poster. Zero Fraud.",
    "knowsAbout": [
      "Car Sales",
      "Vehicle Marketplace",
      "Used Cars",
      "Car Dealerships",
      "Vehicle Verification",
      "Secure Car Transactions"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://listyourcar.ng/#website",
    "url": "https://listyourcar.ng",
    "name": "List Your Car",
    "description": "Nigeria's most trusted car marketplace",
    "publisher": {
      "@id": "https://listyourcar.ng/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://listyourcar.ng/browse?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-NG"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
