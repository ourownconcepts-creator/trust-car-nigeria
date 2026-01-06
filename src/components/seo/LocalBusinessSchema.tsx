import { Helmet } from "react-helmet-async";

const LocalBusinessSchema = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://listyourcar.ng/#localbusiness",
    "name": "List Your Car Nigeria",
    "image": "https://listyourcar.ng/og-image.png",
    "url": "https://listyourcar.ng",
    "telephone": "+234-900-000-0000",
    "email": "hello@listyourcar.ng",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Victoria Island",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos",
      "postalCode": "101241",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.4281,
      "longitude": 3.4219
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "15:00"
      }
    ],
    "priceRange": "₦₦",
    "currenciesAccepted": "NGN",
    "paymentAccepted": "Bank Transfer, Card Payment, Escrow",
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
