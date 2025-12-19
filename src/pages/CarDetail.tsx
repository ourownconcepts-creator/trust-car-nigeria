import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Shield, CheckCircle2, MapPin, Calendar, 
  Gauge, Fuel, Settings2, Car, Phone, Heart, Share2, 
  AlertTriangle, FileCheck, User, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessageDialog from "@/components/MessageDialog";
import { supabase } from "@/integrations/supabase/client";

interface CarListing {
  id: string;
  title: string;
  price: number;
  location: string;
  year: number;
  mileage: number | null;
  transmission: string | null;
  fuel_type: string | null;
  color: string | null;
  vin: string | null;
  images: string[] | null;
  description: string | null;
  body_type: string | null;
  condition: string | null;
  user_id: string;
  make: string;
  model: string;
}

interface SellerProfile {
  id: string;
  full_name: string | null;
  email: string;
  is_verified: boolean | null;
  business_name: string | null;
}

const CarDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [car, setCar] = useState<CarListing | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) return;

      try {
        const { data: carData, error: carError } = await supabase
          .from("car_listings")
          .select("*")
          .eq("id", id)
          .single();

        if (carError) throw carError;
        setCar(carData);

        // Fetch seller profile
        if (carData?.user_id) {
          const { data: sellerData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", carData.user_id)
            .single();

          setSeller(sellerData);
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    if (!car?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % car.images!.length);
  };

  const prevImage = () => {
    if (!car?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + car.images!.length) % car.images!.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 container-wide py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
            <Link to="/browse">
              <Button>Back to Browse</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = car.images && car.images.length > 0 
    ? car.images 
    : ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"];

  return (
    <>
      <Helmet>
        <title>{car.title} - List Your Car Nigeria</title>
        <meta name="description" content={`${car.title} for sale in ${car.location}. ${car.mileage ? `${car.mileage.toLocaleString()} km` : ""}, ${car.transmission || ""}. Verified seller.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Breadcrumb */}
          <div className="container-wide py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/browse" className="hover:text-primary">Cars</Link>
              <span>/</span>
              <Link to={`/browse?make=${car.make.toLowerCase()}`} className="hover:text-primary">{car.make}</Link>
              <span>/</span>
              <span className="text-foreground">{car.title}</span>
            </nav>
          </div>

          <div className="container-wide pb-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Gallery */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-2xl overflow-hidden bg-muted aspect-[16/10]"
                >
                  <img
                    src={images[currentImageIndex]}
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {/* Trust Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {seller?.is_verified && (
                      <Badge className="bg-success text-success-foreground">
                        <Shield className="h-3 w-3 mr-1" /> Verified Seller
                      </Badge>
                    )}
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </motion.div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? "border-primary" : "border-transparent"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Details Tabs */}
                <Tabs defaultValue="overview" className="bg-card rounded-xl border border-border">
                  <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Overview</TabsTrigger>
                    <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Features</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About this car</h2>
                    <p className="text-muted-foreground mb-6">{car.description || "No description provided."}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: Calendar, label: "Year", value: car.year.toString() },
                        { icon: Gauge, label: "Mileage", value: car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A" },
                        { icon: Settings2, label: "Transmission", value: car.transmission || "N/A" },
                        { icon: Fuel, label: "Fuel Type", value: car.fuel_type || "N/A" },
                        { icon: Car, label: "Body Type", value: car.body_type || "N/A" },
                        { icon: MapPin, label: "Location", value: car.location.split(",")[0] },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <p className="font-medium">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {car.color && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span>Color: {car.color}</span>
                        </div>
                      )}
                      {car.condition && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span>Condition: {car.condition}</span>
                        </div>
                      )}
                      {car.vin && (
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-success" />
                          <span>VIN Available</span>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-xl border border-border p-6 sticky top-24"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-3xl font-bold text-primary">{formatPrice(car.price)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsSaved(!isSaved)}
                        className={isSaved ? "text-destructive border-destructive" : ""}
                      >
                        <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <h1 className="text-xl font-semibold mb-2">{car.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-1 mb-6">
                    <MapPin className="h-4 w-4" /> {car.location}
                  </p>

                  <div className="space-y-3">
                    <MessageDialog
                      listingId={car.id}
                      sellerId={car.user_id}
                      listingTitle={car.title}
                    />
                    <Button variant="outline" className="w-full" size="lg">
                      <Phone className="h-5 w-5 mr-2" /> Request Callback
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Use our secure messaging. Never share payment details.</span>
                    </div>
                  </div>
                </motion.div>

                {/* Seller Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <h3 className="font-semibold mb-4">Seller Information</h3>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {seller?.business_name || seller?.full_name || "Private Seller"}
                        </p>
                        {seller?.is_verified && (
                          <Shield className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {seller?.is_verified ? "Verified Seller" : "Seller"}
                      </p>
                    </div>
                  </div>

                  <Link to={`/dealer/${car.user_id}`}>
                    <Button variant="outline" className="w-full">
                      View Seller Profile
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CarDetail;
