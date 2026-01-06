import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  showVisual?: boolean;
}

const routeNames: Record<string, string> = {
  "/": "Home",
  "/browse": "Browse Cars",
  "/sell": "Sell Your Car",
  "/about": "About Us",
  "/contact": "Contact",
  "/dealers": "Dealers",
  "/how-it-works": "How It Works",
  "/valuation": "Car Valuation",
  "/careers": "Careers",
  "/press": "Press",
  "/help": "Help Center",
  "/safety": "Safety Tips",
  "/report": "Report Fraud",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/cookies": "Cookie Policy",
  "/escrow-terms": "Escrow Terms",
  "/auth": "Sign In",
  "/dashboard": "Dashboard",
  "/admin": "Admin",
};

export const getBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [{ name: "Home", path: "/" }];
  
  if (pathname === "/") return items;
  
  const segments = pathname.split("/").filter(Boolean);
  let currentPath = "";
  
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = routeNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    items.push({ name, path: currentPath });
  });
  
  return items;
};

const BreadcrumbSchema = ({ items, showVisual = true }: BreadcrumbSchemaProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://listyourcar.ng${item.path}`
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      {showVisual && items.length > 1 && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            {items.map((item, index) => (
              <li key={item.path} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                {index === items.length - 1 ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="transition-colors hover:text-foreground"
                  >
                    {index === 0 ? (
                      <span className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                      </span>
                    ) : (
                      item.name
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
};

export default BreadcrumbSchema;
