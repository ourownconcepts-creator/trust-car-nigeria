import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Car, Shield, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Dealers = () => {
  const dealers = [
    {
      id: "1",
      name: "Premium Motors Lagos",
      location: "Victoria Island, Lagos",
      rating: 4.8,
      reviews: 124,
      carsListed: 45,
      verified: true,
      specialties: ["Luxury", "SUVs"],
    },
    {
      id: "2",
      name: "AutoHub Nigeria",
      location: "Ikeja, Lagos",
      rating: 4.6,
      reviews: 89,
      carsListed: 32,
      verified: true,
      specialties: ["Japanese", "Korean"],
    },
    {
      id: "3",
      name: "CarMax Abuja",
      location: "Wuse, Abuja",
      rating: 4.7,
      reviews: 67,
      carsListed: 28,
      verified: true,
      specialties: ["German", "American"],
    },
    {
      id: "4",
      name: "Elite Auto Dealers",
      location: "Lekki, Lagos",
      rating: 4.5,
      reviews: 52,
      carsListed: 21,
      verified: true,
      specialties: ["Sports Cars", "Luxury"],
    },
  ];

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
              <h1 className="text-4xl font-bold mb-4">Verified Dealers</h1>
              <p className="text-muted-foreground text-lg">
                Browse our network of verified and trusted car dealerships across Nigeria
              </p>
            </div>

            <div className="flex gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search dealers..." className="pl-10" />
              </div>
              <Button variant="outline">Filter by Location</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {dealers.map((dealer) => (
                <Card key={dealer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold">{dealer.name}</h3>
                          {dealer.verified && (
                            <Badge variant="secondary" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4" />
                          {dealer.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-semibold">{dealer.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{dealer.reviews} reviews</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Car className="h-4 w-4" />
                        {dealer.carsListed} cars listed
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {dealer.specialties.map((spec) => (
                        <Badge key={spec} variant="outline">{spec}</Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button asChild className="flex-1">
                        <Link to={`/dealer/${dealer.id}`}>View Inventory</Link>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dealers;
