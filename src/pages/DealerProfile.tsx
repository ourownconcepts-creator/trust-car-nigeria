import { motion } from "framer-motion";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";
import { useParams } from "react-router-dom";
import { 
  Shield, MapPin, Phone, Mail, Clock, Star, 
  CheckCircle2, Car, Calendar, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";

const mockDealer = {
  id: 1,
  name: "Verified Auto Sales",
  logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200",
  coverImage: "https://images.unsplash.com/photo-1562141962-cd54c2e6de4f?w=1200",
  verified: true,
  rating: 4.8,
  reviewCount: 156,
  totalSales: 320,
  memberSince: "2019",
  location: "Victoria Island, Lagos",
  phone: "+234 800 123 4567",
  email: "sales@verifiedauto.ng",
  description: "Verified Auto Sales is a premier car dealership in Lagos, specializing in foreign used and brand new vehicles. With over 5 years of experience, we pride ourselves on quality, transparency, and customer satisfaction.",
  workingHours: "Mon-Sat: 9AM - 6PM",
  specialties: ["Foreign Used", "Brand New", "Luxury Vehicles", "SUVs"],
};

const mockInventory = [
  { id: 1, title: "Toyota Camry 2021", price: 18500000, location: "Lagos", year: "2021", mileage: "35,000 km", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400", verified: true, featured: true },
  { id: 2, title: "Mercedes-Benz C300 2020", price: 32000000, location: "Lagos", year: "2020", mileage: "28,000 km", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400", verified: true, featured: false },
  { id: 3, title: "BMW X5 2022", price: 48000000, location: "Lagos", year: "2022", mileage: "12,000 km", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400", verified: true, featured: true },
  { id: 4, title: "Lexus RX 350 2021", price: 38000000, location: "Lagos", year: "2021", mileage: "22,000 km", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400", verified: true, featured: false },
];

const DealerProfile = () => {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>{mockDealer.name} - Verified Dealer | List Your Car</title>
        <meta name="description" content={`${mockDealer.name} - ${mockDealer.description.slice(0, 150)}...`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Cover Image */}
          <div className="relative h-64 md:h-80 bg-muted">
            <img
              src={mockDealer.coverImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <div className="container-wide">
            {/* Dealer Header */}
            <div className="relative -mt-20 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-muted overflow-hidden border-4 border-background shadow-lg">
                      <img
                        src={mockDealer.logo}
                        alt={mockDealer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-2xl md:text-3xl font-bold">{mockDealer.name}</h1>
                          {mockDealer.verified && (
                            <Badge className="bg-success text-success-foreground">
                              <Shield className="h-3 w-3 mr-1" /> Verified Dealer
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {mockDealer.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-verification fill-verification" /> {mockDealer.rating} ({mockDealer.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mockDealer.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary">{specialty}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button>
                          <MessageCircle className="h-4 w-4 mr-2" /> Contact
                        </Button>
                        <Button variant="outline">
                          <Phone className="h-4 w-4 mr-2" /> Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                  {[
                    { label: "Total Sales", value: mockDealer.totalSales, icon: Car },
                    { label: "Rating", value: mockDealer.rating, icon: Star },
                    { label: "Reviews", value: mockDealer.reviewCount, icon: CheckCircle2 },
                    { label: "Member Since", value: mockDealer.memberSince, icon: Calendar },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 pb-12">
              {/* Main Content - Inventory */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Current Inventory</h2>
                  <span className="text-muted-foreground">{mockInventory.length} vehicles</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {mockInventory.map((car, index) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CarCard {...car} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* About */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold mb-4">About</h3>
                  <p className="text-muted-foreground text-sm">{mockDealer.description}</p>
                </div>

                {/* Contact Info */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{mockDealer.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{mockDealer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{mockDealer.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{mockDealer.workingHours}</span>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="bg-success/10 rounded-xl border border-success/20 p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-success" /> Verified Dealer
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Business Registration Verified
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Physical Location Confirmed
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      ID Verification Complete
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DealerProfile;
