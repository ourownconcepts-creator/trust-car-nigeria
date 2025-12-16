import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Shield, CheckCircle2, MapPin, Calendar, 
  Gauge, Fuel, Settings2, Car, MessageCircle, Phone, Heart, Share2, 
  AlertTriangle, FileCheck, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockCar = {
  id: 1,
  title: "Toyota Camry XLE 2021",
  price: 18500000,
  location: "Lagos, Nigeria",
  year: "2021",
  mileage: "35,000 km",
  transmission: "Automatic",
  fuelType: "Petrol",
  engineSize: "2.5L",
  color: "Pearl White",
  vin: "JTDKN3DU5A0******",
  verified: true,
  inspected: true,
  images: [
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
  ],
  description: "This Toyota Camry XLE is in excellent condition, well-maintained with full service history. Features include leather seats, sunroof, premium sound system, and advanced safety features. One careful owner, always serviced at authorized dealer.",
  features: [
    "Leather Seats", "Sunroof", "Navigation System", "Backup Camera", 
    "Bluetooth", "Apple CarPlay", "Android Auto", "Keyless Entry", 
    "Push Start", "Cruise Control", "Lane Departure Warning", "Blind Spot Monitor"
  ],
  seller: {
    name: "Verified Auto Sales",
    type: "dealer",
    verified: true,
    rating: 4.8,
    totalSales: 156,
    memberSince: "2019",
    responseTime: "Usually responds within 2 hours",
  },
};

const CarDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockCar.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockCar.images.length) % mockCar.images.length);
  };

  return (
    <>
      <Helmet>
        <title>{mockCar.title} - List Your Car Nigeria</title>
        <meta name="description" content={`${mockCar.title} for sale in ${mockCar.location}. ${mockCar.mileage}, ${mockCar.transmission}. Verified seller.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Breadcrumb */}
          <div className="container-wide py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/browse" className="hover:text-primary">Cars</Link>
              <span>/</span>
              <Link to="/browse?make=toyota" className="hover:text-primary">Toyota</Link>
              <span>/</span>
              <span className="text-foreground">{mockCar.title}</span>
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
                    src={mockCar.images[currentImageIndex]}
                    alt={mockCar.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
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

                  {/* Trust Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {mockCar.verified && (
                      <Badge className="bg-success text-success-foreground">
                        <Shield className="h-3 w-3 mr-1" /> Verified Seller
                      </Badge>
                    )}
                    {mockCar.inspected && (
                      <Badge className="bg-verification text-verification-foreground">
                        <FileCheck className="h-3 w-3 mr-1" /> Inspected
                      </Badge>
                    )}
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {mockCar.images.length}
                  </div>
                </motion.div>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {mockCar.images.map((img, index) => (
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

                {/* Details Tabs */}
                <Tabs defaultValue="overview" className="bg-card rounded-xl border border-border">
                  <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Overview</TabsTrigger>
                    <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Features</TabsTrigger>
                    <TabsTrigger value="inspection" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Inspection Report</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About this car</h2>
                    <p className="text-muted-foreground mb-6">{mockCar.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: Calendar, label: "Year", value: mockCar.year },
                        { icon: Gauge, label: "Mileage", value: mockCar.mileage },
                        { icon: Settings2, label: "Transmission", value: mockCar.transmission },
                        { icon: Fuel, label: "Fuel Type", value: mockCar.fuelType },
                        { icon: Car, label: "Engine", value: mockCar.engineSize },
                        { icon: MapPin, label: "Location", value: mockCar.location.split(",")[0] },
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
                    <h2 className="text-xl font-semibold mb-4">Features & Equipment</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {mockCar.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="inspection" className="p-6">
                    <div className="flex items-center gap-4 p-4 bg-success/10 rounded-lg border border-success/20 mb-6">
                      <FileCheck className="h-8 w-8 text-success" />
                      <div>
                        <h3 className="font-semibold text-success">Inspection Passed</h3>
                        <p className="text-sm text-muted-foreground">This vehicle has been professionally inspected and passed all checks.</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">Detailed inspection report available upon request.</p>
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
                      <p className="text-3xl font-bold text-primary">{formatPrice(mockCar.price)}</p>
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

                  <h1 className="text-xl font-semibold mb-2">{mockCar.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-1 mb-6">
                    <MapPin className="h-4 w-4" /> {mockCar.location}
                  </p>

                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" /> Contact Seller
                    </Button>
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
                        <p className="font-medium">{mockCar.seller.name}</p>
                        {mockCar.seller.verified && (
                          <Shield className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{mockCar.seller.type}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium">⭐ {mockCar.seller.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Sales</span>
                      <span className="font-medium">{mockCar.seller.totalSales} cars</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">{mockCar.seller.memberSince}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                    {mockCar.seller.responseTime}
                  </p>

                  <Button variant="outline" className="w-full mt-4">
                    View Seller Profile
                  </Button>
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
