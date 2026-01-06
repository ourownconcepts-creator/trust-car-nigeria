import { Helmet } from "react-helmet-async";

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string[];
  brand: string;
  model: string;
  year: number;
  price: number;
  currency?: string;
  condition?: "NewCondition" | "UsedCondition" | "RefurbishedCondition";
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url: string;
  sku?: string;
  mileage?: number;
  fuelType?: string;
  vehicleTransmission?: string;
  color?: string;
}

const ProductSchema = ({
  name,
  description,
  image,
  brand,
  model,
  year,
  price,
  currency = "NGN",
  condition = "UsedCondition",
  availability = "InStock",
  url,
  sku,
  mileage,
  fuelType,
  vehicleTransmission,
  color,
}: ProductSchemaProps) => {
  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": name,
    "description": description,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "model": model,
    "vehicleModelDate": year.toString(),
    "manufacturer": {
      "@type": "Organization",
      "name": brand
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": currency,
      "price": price,
      "itemCondition": `https://schema.org/${condition}`,
      "availability": `https://schema.org/${availability}`,
      "seller": {
        "@type": "Organization",
        "name": "List Your Car",
        "url": "https://listyourcar.ng"
      }
    },
    ...(sku && { "sku": sku }),
    ...(mileage && {
      "mileageFromOdometer": {
        "@type": "QuantitativeValue",
        "value": mileage,
        "unitCode": "KMT"
      }
    }),
    ...(fuelType && { "fuelType": fuelType }),
    ...(vehicleTransmission && { "vehicleTransmission": vehicleTransmission }),
    ...(color && { "color": color })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(vehicleSchema)}
      </script>
    </Helmet>
  );
};

export default ProductSchema;
