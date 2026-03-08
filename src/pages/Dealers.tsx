import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Car, Shield, Phone, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DealerProfile {
  id: string;
  full_name: string | null;
  business_name: string | null;
  phone_number: string | null;
  is_verified: boolean;
  avatar_url: string | null;
  listings_count: number;
  locations: string[];
}

const Dealers = () => {
  const [dealers, setDealers] = useState<DealerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      // Get profiles that have active car listings (these are sellers/dealers)
      const { data: listings, error: listingsError } = await supabase
        .from("car_listings")
        .select("user_id, location")
        .eq("status", "active");

      if (listingsError) throw listingsError;

      // Group listings by user and count
      const sellerData: Record<string, { count: number; locations: Set<string> }> = {};
      (listings || []).forEach((listing) => {
        if (!sellerData[listing.user_id]) {
          sellerData[listing.user_id] = { count: 0, locations: new Set() };
        }
        sellerData[listing.user_id].count++;
        if (listing.location) {
          sellerData[listing.user_id].locations.add(listing.location);
        }
      });

      const sellerIds = Object.keys(sellerData);

      if (sellerIds.length === 0) {
        setDealers([]);
        setLoading(false);
        return;
      }

      // Fetch profiles for these sellers
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", sellerIds);

      if (profilesError) throw profilesError;

      const dealerProfiles: DealerProfile[] = (profiles || []).map((profile) => ({
        id: profile.id,
        full_name: profile.full_name,
        business_name: profile.business_name,
        phone_number: profile.phone_number,
        is_verified: profile.is_verified || false,
        avatar_url: profile.avatar_url,
        listings_count: sellerData[profile.id]?.count || 0,
        locations: Array.from(sellerData[profile.id]?.locations || []),
      }));

      // Sort by listings count (most active first)
      dealerProfiles.sort((a, b) => b.listings_count - a.listings_count);

      setDealers(dealerProfiles);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDealers = dealers.filter((dealer) => {
    const name = dealer.business_name || dealer.full_name || "";
    const locations = dealer.locations.join(" ");
    const searchLower = searchQuery.toLowerCase();
    return (
      name.toLowerCase().includes(searchLower) ||
      locations.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <Helmet>
        <title>Dealer Profiles - AutoTrust Nigeria</title>
        <meta name="description" content="Browse verified car dealers on AutoTrust Nigeria. Find trusted dealerships with quality vehicles and excellent service." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          <div className="container-wide py-16">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Verified Sellers & Dealers</h1>
              <p className="text-muted-foreground text-lg">
                Browse our network of active car sellers across Nigeria
              </p>
            </div>

            <div className="flex gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search dealers by name or location..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredDealers.length === 0 ? (
              <div className="text-center py-20">
                <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No sellers found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Be the first to list a car and become a dealer!"}
                </p>
                <Button asChild className="mt-4">
                  <Link to="/sell">List Your Car</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDealers.map((dealer) => (
                  <Card key={dealer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {dealer.avatar_url ? (
                              <img 
                                src={dealer.avatar_url} 
                                alt={dealer.business_name || dealer.full_name || "Dealer"} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl font-bold text-primary">
                                {(dealer.business_name || dealer.full_name || "D").charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                {dealer.business_name || dealer.full_name || "Anonymous Seller"}
                              </h3>
                              {dealer.is_verified && (
                                <Badge variant="secondary" className="gap-1">
                                  <Shield className="h-3 w-3" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            {dealer.locations.length > 0 && (
                              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                <MapPin className="h-4 w-4" />
                                {dealer.locations.slice(0, 2).join(", ")}
                                {dealer.locations.length > 2 && ` +${dealer.locations.length - 2} more`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Car className="h-4 w-4" />
                          {dealer.listings_count} {dealer.listings_count === 1 ? "car" : "cars"} listed
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button asChild className="flex-1">
                          <Link to={`/browse?seller=${dealer.id}`}>View Inventory</Link>
                        </Button>
                        {dealer.phone_number && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={`tel:${dealer.phone_number}`}>
                              <Phone className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dealers;
